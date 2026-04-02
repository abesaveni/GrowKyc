import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { EntityStructureDiagram } from './EntityStructureDiagram';
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
  DollarSign,
  MapPin,
  Calendar,
  TrendingUp,
  Building,
  CreditCard,
  Flag
} from 'lucide-react';
import { Button } from '../ui/button';

interface ComprehensiveSearchResultsProps {
  formData: any;
  avmValuationResults: any;
  automatedChecksComplete: boolean;
  directors: any[];
  shareholders: any[];
  trustees: any[];
  guarantors: any[];
}

export function ComprehensiveSearchResults({ 
  formData, 
  avmValuationResults,
  automatedChecksComplete,
  directors,
  shareholders,
  trustees,
  guarantors
}: ComprehensiveSearchResultsProps) {
  
  const [expandedSections, setExpandedSections] = useState({
    entityDiagram: true,
    propertyValuation: true,
    titleSearch: true,
    borrowerIdentity: true,
    borrowerAML: true,
    borrowerCredit: true,
    guarantorIdentity: false,
    guarantorAML: false,
    guarantorCredit: false,
    compliance: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Placeholder data for comprehensive results
  const borrowerData = {
    name: `${formData.borrowerFirstName || 'John'} ${formData.borrowerLastName || 'Smith'}`,
    dob: formData.borrowerDOB || '1985-03-15',
    email: formData.borrowerEmail || 'john.smith@email.com',
    phone: formData.borrowerPhone || '0412 345 678',
    address: formData.borrowerResidentialAddress || '456 Residential Street, Sydney NSW 2000'
  };

  const guarantorData = {
    name: 'Sarah Johnson',
    dob: '1982-07-22',
    email: 'sarah.johnson@email.com',
    phone: '0423 456 789',
    address: '789 Guarantee Lane, Melbourne VIC 3000'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-300">
          <Shield className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold">Comprehensive Verification Results Dashboard</h2>
          <p className="text-gray-600 text-sm">All automated checks complete - Review results for all parties</p>
        </div>
        {automatedChecksComplete && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border-2 border-green-300 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-bold text-green-800">All Checks Complete</span>
          </div>
        )}
      </div>

      {/* Entity Structure Diagram */}
      <EntityStructureDiagram
        entityType={formData.entityType || 'personal'}
        borrowerName={`${formData.borrowerFirstName || ''} ${formData.borrowerLastName || ''}`.trim() || 'Primary Borrower'}
        companyName={formData.companyName}
        trustName={formData.trustName}
        directors={directors.map(d => ({ ...d, verified: true }))}
        shareholders={shareholders.map(s => ({ ...s, verified: true }))}
        trustees={trustees.map(t => ({ ...t, verified: true }))}
        guarantors={guarantors.map(g => ({ ...g, verified: true }))}
      />

      {/* Overall Status Summary */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-green-900 mb-2">✅ All Verifications Passed</h3>
              <p className="text-sm text-green-800 mb-3">
                All third-party verification checks have been completed successfully for all parties. 
                No adverse findings or red flags identified.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="flex items-center gap-2 bg-white p-2 rounded border border-green-200">
                  <Home className="w-4 h-4 text-green-600" />
                  <span className="text-green-900 font-semibold">Property ✓</span>
                </div>
                <div className="flex items-center gap-2 bg-white p-2 rounded border border-green-200">
                  <FileText className="w-4 h-4 text-green-600" />
                  <span className="text-green-900 font-semibold">Title ✓</span>
                </div>
                <div className="flex items-center gap-2 bg-white p-2 rounded border border-green-200">
                  <User className="w-4 h-4 text-green-600" />
                  <span className="text-green-900 font-semibold">Identity ✓</span>
                </div>
                <div className="flex items-center gap-2 bg-white p-2 rounded border border-green-200">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-green-900 font-semibold">AML/CTF ✓</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 1. PROPERTY VALUATION - RP DATA AVM */}
      <Card className="border-2 border-blue-300">
        <CardHeader 
          className="cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors"
          onClick={() => toggleSection('propertyValuation')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Home className="w-5 h-5 text-blue-600" />
              <div>
                <CardTitle className="text-lg">1. Property Valuation (RP Data AVM)</CardTitle>
                <p className="text-xs text-gray-600 mt-1">CoreLogic RP Data Automated Valuation Model</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                HIGH CONFIDENCE
              </span>
              {expandedSections.propertyValuation ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>
        </CardHeader>
        {expandedSections.propertyValuation && (
          <CardContent className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-600 mb-1">Property Address</p>
                <p className="font-semibold text-gray-900">{formData.propertyAddress || '123 Main Street'}</p>
                <p className="text-sm text-gray-600">{formData.propertySuburb || 'Bondi'}, {formData.propertyState || 'NSW'} {formData.propertyPostcode || '2026'}</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border-2 border-blue-300">
                <p className="text-xs text-gray-600 mb-1">AVM Estimated Value</p>
                <p className="text-3xl font-bold text-blue-700">
                  ${avmValuationResults?.avmMid?.toLocaleString() || '850,000'}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Range: ${avmValuationResults?.avmLow?.toLocaleString() || '765,000'} - ${avmValuationResults?.avmHigh?.toLocaleString() || '935,000'}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mt-4">
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Confidence Level</p>
                <p className="text-sm font-bold text-green-600">HIGH</p>
              </div>
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Comparable Sales</p>
                <p className="text-sm font-bold text-gray-900">15 properties</p>
              </div>
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Market Trend</p>
                <p className="text-sm font-bold text-gray-900">Stable</p>
              </div>
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Valuation Date</p>
                <p className="text-sm font-bold text-gray-900">{new Date().toLocaleDateString('en-AU')}</p>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download AVM Report
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Eye className="w-4 h-4 mr-2" />
                View Full Details
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* 2. TITLE SEARCH - INFOTRACK */}
      <Card className="border-2 border-purple-300">
        <CardHeader 
          className="cursor-pointer bg-purple-50 hover:bg-purple-100 transition-colors"
          onClick={() => toggleSection('titleSearch')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-purple-600" />
              <div>
                <CardTitle className="text-lg">2. Title Search (InfoTrack)</CardTitle>
                <p className="text-xs text-gray-600 mt-1">NSW Land Registry Services - Full Title Search</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                CLEAR
              </span>
              {expandedSections.titleSearch ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>
        </CardHeader>
        {expandedSections.titleSearch && (
          <CardContent className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs text-gray-600 mb-2 font-semibold">Title Reference</p>
                <p className="text-sm font-mono text-gray-900">LOT 123 DP 456789</p>
                <p className="text-xs text-gray-600 mt-1">Vol/Folio: 12345/678</p>
              </div>
              <div className="p-4 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs text-gray-600 mb-2 font-semibold">Registered Owner</p>
                <p className="text-sm font-bold text-gray-900">{borrowerData.name}</p>
                <p className="text-xs text-gray-600 mt-1">Ownership: Sole Owner (Torrens Title)</p>
              </div>
            </div>

            <div className="p-4 bg-green-50 border-2 border-green-300 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-sm text-green-900 mb-2">✅ Clear Title</p>
                  <ul className="space-y-1 text-xs text-green-800">
                    <li>✓ No adverse encumbrances detected</li>
                    <li>✓ No caveats registered</li>
                    <li>✓ 1 existing mortgage registered (to be discharged)</li>
                    <li>✓ Standard easements for services only</li>
                    <li>✓ No planning restrictions or overlays</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Zoning</p>
                <p className="text-sm font-bold text-gray-900">R2 Low Density Residential</p>
              </div>
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Local Government Area</p>
                <p className="text-sm font-bold text-gray-900">Waverley Council</p>
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download Title Search Certificate
            </Button>
          </CardContent>
        )}
      </Card>

      {/* 3. BORROWER - IDENTITY VERIFICATION */}
      <Card className="border-2 border-indigo-300">
        <CardHeader 
          className="cursor-pointer bg-indigo-50 hover:bg-indigo-100 transition-colors"
          onClick={() => toggleSection('borrowerIdentity')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-indigo-600" />
              <div>
                <CardTitle className="text-lg">3. Borrower - Identity Verification (InfoTrack GreenID)</CardTitle>
                <p className="text-xs text-gray-600 mt-1">
                  {borrowerData.name} • {borrowerData.dob}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                VERIFIED
              </span>
              {expandedSections.borrowerIdentity ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>
        </CardHeader>
        {expandedSections.borrowerIdentity && (
          <CardContent className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs text-gray-600 mb-2 font-semibold">Personal Details</p>
                <p className="text-sm font-bold text-gray-900">{borrowerData.name}</p>
                <p className="text-xs text-gray-600 mt-1">DOB: {new Date(borrowerData.dob).toLocaleDateString('en-AU')}</p>
                <p className="text-xs text-gray-600">Email: {borrowerData.email}</p>
                <p className="text-xs text-gray-600">Phone: {borrowerData.phone}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs text-gray-600 mb-2 font-semibold">Verified Documents</p>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>Driver's License NSW - Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>Medicare Card - Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>Bank Account (100 point check) - Verified</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 border-2 border-green-300 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-sm text-green-900 mb-2">✅ Identity Verified - 100 Points Passed</p>
                  <ul className="space-y-1 text-xs text-green-800">
                    <li>✓ GreenID score: 100/100 (Strong Match)</li>
                    <li>✓ Government database cross-verification complete</li>
                    <li>✓ Address verification: CONFIRMED</li>
                    <li>✓ Document authenticity: GENUINE</li>
                    <li>✓ Biometric checks: PASSED</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Residential Address (Verified)</p>
              <p className="text-sm font-semibold text-gray-900">{borrowerData.address}</p>
            </div>

            <Button variant="outline" size="sm" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download GreenID Verification Report
            </Button>
          </CardContent>
        )}
      </Card>

      {/* 4. BORROWER - AML/CTF SCREENING */}
      <Card className="border-2 border-red-300">
        <CardHeader 
          className="cursor-pointer bg-red-50 hover:bg-red-100 transition-colors"
          onClick={() => toggleSection('borrowerAML')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-red-600" />
              <div>
                <CardTitle className="text-lg">4. Borrower - AML/CTF Screening (AUSTRAC Compliance)</CardTitle>
                <p className="text-xs text-gray-600 mt-1">
                  Sanctions, PEP, Adverse Media & Watchlist Screening
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                CLEAR
              </span>
              {expandedSections.borrowerAML ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>
        </CardHeader>
        {expandedSections.borrowerAML && (
          <CardContent className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded border-2 border-green-300">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-xs font-bold text-green-900">SANCTIONS SCREENING</p>
                </div>
                <p className="text-xs text-green-800">
                  ✓ No matches on DFAT Sanctions List<br/>
                  ✓ No matches on UN Consolidated List<br/>
                  ✓ No matches on OFAC SDN List<br/>
                  ✓ No EU Sanctions matches
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded border-2 border-green-300">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-xs font-bold text-green-900">PEP SCREENING</p>
                </div>
                <p className="text-xs text-green-800">
                  ✓ Not identified as PEP<br/>
                  ✓ No close associates flagged<br/>
                  ✓ No family members flagged<br/>
                  ✓ Clear political exposure
                </p>
              </div>
            </div>

            <div className="p-4 bg-green-50 border-2 border-green-300 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-sm text-green-900 mb-2">✅ AML/CTF Screening Complete - NO ADVERSE FINDINGS</p>
                  <ul className="space-y-1 text-xs text-green-800">
                    <li>✓ Sanctions: CLEAR (0 matches)</li>
                    <li>✓ PEP (Politically Exposed Person): CLEAR</li>
                    <li>✓ Adverse Media: CLEAR (0 articles)</li>
                    <li>✓ Watchlist Screening: CLEAR</li>
                    <li>✓ Law Enforcement Databases: CLEAR</li>
                    <li>✓ Financial Crime Databases: CLEAR</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Source of Funds</p>
                <p className="text-sm text-gray-900">Employment Income - Verified</p>
              </div>
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Source of Wealth</p>
                <p className="text-sm text-gray-900">Career Earnings - Documented</p>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded border border-gray-200">
              <p className="text-xs text-gray-600 mb-2 font-semibold">Risk Assessment</p>
              <p className="text-sm font-bold text-green-600">LOW RISK</p>
              <p className="text-xs text-gray-600 mt-1">No enhanced due diligence required</p>
            </div>

            <Button variant="outline" size="sm" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download AML/CTF Screening Report
            </Button>
          </CardContent>
        )}
      </Card>

      {/* 5. BORROWER - CREDIT ASSESSMENT */}
      <Card className="border-2 border-orange-300">
        <CardHeader 
          className="cursor-pointer bg-orange-50 hover:bg-orange-100 transition-colors"
          onClick={() => toggleSection('borrowerCredit')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-orange-600" />
              <div>
                <CardTitle className="text-lg">5. Borrower - Credit Assessment (Equifax)</CardTitle>
                <p className="text-xs text-gray-600 mt-1">
                  Credit Bureau Report & Comprehensive Credit Reporting (CCR)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                GOOD
              </span>
              {expandedSections.borrowerCredit ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>
        </CardHeader>
        {expandedSections.borrowerCredit && (
          <CardContent className="p-6 space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded border-2 border-blue-300 text-center">
                <p className="text-xs text-gray-600 mb-1">Credit Score</p>
                <p className="text-3xl font-bold text-blue-700">742</p>
                <p className="text-xs text-blue-600 mt-1">Very Good (661-734)</p>
              </div>
              <div className="p-4 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Payment History</p>
                <p className="text-sm font-bold text-green-600">100% On-Time</p>
                <p className="text-xs text-gray-600 mt-1">No late payments</p>
              </div>
              <div className="p-4 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Credit Utilization</p>
                <p className="text-sm font-bold text-green-600">28%</p>
                <p className="text-xs text-gray-600 mt-1">Well below threshold</p>
              </div>
            </div>

            <div className="p-4 bg-green-50 border-2 border-green-300 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-sm text-green-900 mb-2">✅ Strong Credit Profile</p>
                  <ul className="space-y-1 text-xs text-green-800">
                    <li>✓ No defaults or judgements recorded</li>
                    <li>✓ No bankruptcy or Part IX/X agreements</li>
                    <li>✓ No adverse credit events in past 7 years</li>
                    <li>✓ Credit enquiries: 2 in last 12 months (normal)</li>
                    <li>✓ Established credit history: 12+ years</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Total Credit Accounts</p>
                <p className="text-sm font-bold text-gray-900">5 accounts</p>
                <p className="text-xs text-gray-600">3 active, 2 closed</p>
              </div>
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Total Credit Limit</p>
                <p className="text-sm font-bold text-gray-900">$85,000</p>
                <p className="text-xs text-gray-600">Across all facilities</p>
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download Credit Bureau Report
            </Button>
          </CardContent>
        )}
      </Card>

      {/* 6. GUARANTOR - IDENTITY VERIFICATION */}
      <Card className="border-2 border-teal-300">
        <CardHeader 
          className="cursor-pointer bg-teal-50 hover:bg-teal-100 transition-colors"
          onClick={() => toggleSection('guarantorIdentity')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-teal-600" />
              <div>
                <CardTitle className="text-lg">6. Guarantor - Identity Verification (InfoTrack GreenID)</CardTitle>
                <p className="text-xs text-gray-600 mt-1">
                  {guarantorData.name} • {guarantorData.dob}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                VERIFIED
              </span>
              {expandedSections.guarantorIdentity ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>
        </CardHeader>
        {expandedSections.guarantorIdentity && (
          <CardContent className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs text-gray-600 mb-2 font-semibold">Personal Details</p>
                <p className="text-sm font-bold text-gray-900">{guarantorData.name}</p>
                <p className="text-xs text-gray-600 mt-1">DOB: {new Date(guarantorData.dob).toLocaleDateString('en-AU')}</p>
                <p className="text-xs text-gray-600">Email: {guarantorData.email}</p>
                <p className="text-xs text-gray-600">Phone: {guarantorData.phone}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs text-gray-600 mb-2 font-semibold">Verified Documents</p>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>Passport - Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>Driver's License VIC - Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>Utility Bill (Address proof) - Verified</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 border-2 border-green-300 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-sm text-green-900 mb-2">✅ Identity Verified - 100 Points Passed</p>
                  <ul className="space-y-1 text-xs text-green-800">
                    <li>✓ GreenID score: 100/100 (Strong Match)</li>
                    <li>✓ Government database cross-verification complete</li>
                    <li>✓ Address verification: CONFIRMED</li>
                    <li>✓ Document authenticity: GENUINE</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Residential Address (Verified)</p>
              <p className="text-sm font-semibold text-gray-900">{guarantorData.address}</p>
            </div>

            <Button variant="outline" size="sm" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download GreenID Verification Report (Guarantor)
            </Button>
          </CardContent>
        )}
      </Card>

      {/* 7. GUARANTOR - AML/CTF SCREENING */}
      <Card className="border-2 border-rose-300">
        <CardHeader 
          className="cursor-pointer bg-rose-50 hover:bg-rose-100 transition-colors"
          onClick={() => toggleSection('guarantorAML')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-rose-600" />
              <div>
                <CardTitle className="text-lg">7. Guarantor - AML/CTF Screening</CardTitle>
                <p className="text-xs text-gray-600 mt-1">
                  Sanctions, PEP, Adverse Media & Watchlist Screening
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                CLEAR
              </span>
              {expandedSections.guarantorAML ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>
        </CardHeader>
        {expandedSections.guarantorAML && (
          <CardContent className="p-6 space-y-4">
            <div className="p-4 bg-green-50 border-2 border-green-300 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-sm text-green-900 mb-2">✅ AML/CTF Screening Complete - NO ADVERSE FINDINGS</p>
                  <ul className="space-y-1 text-xs text-green-800">
                    <li>✓ Sanctions: CLEAR (0 matches)</li>
                    <li>✓ PEP (Politically Exposed Person): CLEAR</li>
                    <li>✓ Adverse Media: CLEAR (0 articles)</li>
                    <li>✓ Watchlist Screening: CLEAR</li>
                    <li>✓ Law Enforcement Databases: CLEAR</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded border border-gray-200">
              <p className="text-xs text-gray-600 mb-2 font-semibold">Risk Assessment</p>
              <p className="text-sm font-bold text-green-600">LOW RISK</p>
              <p className="text-xs text-gray-600 mt-1">No enhanced due diligence required</p>
            </div>

            <Button variant="outline" size="sm" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download AML/CTF Report (Guarantor)
            </Button>
          </CardContent>
        )}
      </Card>

      {/* 8. GUARANTOR - CREDIT ASSESSMENT */}
      <Card className="border-2 border-amber-300">
        <CardHeader 
          className="cursor-pointer bg-amber-50 hover:bg-amber-100 transition-colors"
          onClick={() => toggleSection('guarantorCredit')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-amber-600" />
              <div>
                <CardTitle className="text-lg">8. Guarantor - Credit Assessment (Equifax)</CardTitle>
                <p className="text-xs text-gray-600 mt-1">
                  Credit Bureau Report & Serviceability Assessment
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                EXCELLENT
              </span>
              {expandedSections.guarantorCredit ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>
        </CardHeader>
        {expandedSections.guarantorCredit && (
          <CardContent className="p-6 space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded border-2 border-blue-300 text-center">
                <p className="text-xs text-gray-600 mb-1">Credit Score</p>
                <p className="text-3xl font-bold text-blue-700">823</p>
                <p className="text-xs text-blue-600 mt-1">Excellent (833-1200)</p>
              </div>
              <div className="p-4 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Payment History</p>
                <p className="text-sm font-bold text-green-600">100% On-Time</p>
                <p className="text-xs text-gray-600 mt-1">Never missed payment</p>
              </div>
              <div className="p-4 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Credit Utilization</p>
                <p className="text-sm font-bold text-green-600">15%</p>
                <p className="text-xs text-gray-600 mt-1">Excellent management</p>
              </div>
            </div>

            <div className="p-4 bg-green-50 border-2 border-green-300 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-sm text-green-900 mb-2">✅ Excellent Credit Profile</p>
                  <ul className="space-y-1 text-xs text-green-800">
                    <li>✓ No adverse credit events</li>
                    <li>✓ Strong credit history: 18+ years</li>
                    <li>✓ Excellent payment track record</li>
                    <li>✓ High financial capacity confirmed</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download Credit Report (Guarantor)
            </Button>
          </CardContent>
        )}
      </Card>

      {/* 9. COMPLIANCE SUMMARY */}
      <Card className="border-2 border-green-400 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardHeader 
          className="cursor-pointer hover:bg-green-100 transition-colors"
          onClick={() => toggleSection('compliance')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Flag className="w-5 h-5 text-green-600" />
              <div>
                <CardTitle className="text-lg">9. Compliance Summary & Regulatory Sign-Off</CardTitle>
                <p className="text-xs text-gray-600 mt-1">
                  AUSTRAC AML/CTF, NCCP, Privacy Act, ASIC Compliance
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                COMPLIANT
              </span>
              {expandedSections.compliance ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>
        </CardHeader>
        {expandedSections.compliance && (
          <CardContent className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded border-2 border-green-300">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-sm font-bold text-green-900">AML/CTF Act 2006</p>
                </div>
                <ul className="space-y-1 text-xs text-gray-700">
                  <li>✓ Customer Due Diligence (CDD) complete</li>
                  <li>✓ Enhanced Due Diligence (EDD) not required</li>
                  <li>✓ Ongoing Customer Due Diligence (OCDD) scheduled</li>
                  <li>✓ Transaction Monitoring: Active</li>
                  <li>✓ Record keeping: Compliant (7 years)</li>
                </ul>
              </div>

              <div className="p-4 bg-white rounded border-2 border-green-300">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-sm font-bold text-green-900">NCCP Act 2009</p>
                </div>
                <ul className="space-y-1 text-xs text-gray-700">
                  <li>✓ Consumer credit verification: Complete</li>
                  <li>✓ Responsible lending obligations: Met</li>
                  <li>✓ Assessment of unsuitability: Pending Step 9</li>
                  <li>✓ Disclosure requirements: Pending Step 10</li>
                  <li>✓ Credit licence verification: Required</li>
                </ul>
              </div>

              <div className="p-4 bg-white rounded border-2 border-green-300">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-sm font-bold text-green-900">Privacy Act 1988</p>
                </div>
                <ul className="space-y-1 text-xs text-gray-700">
                  <li>✓ Consent obtained for all checks</li>
                  <li>✓ Credit reporting privacy compliant</li>
                  <li>✓ Data handling: Encrypted & secure</li>
                  <li>✓ Notifiable Data Breach scheme: Compliant</li>
                </ul>
              </div>

              <div className="p-4 bg-white rounded border-2 border-green-300">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-sm font-bold text-green-900">ASIC Guidelines</p>
                </div>
                <ul className="space-y-1 text-xs text-gray-700">
                  <li>✓ RG 209: Credit licensing obligations met</li>
                  <li>✓ Consumer protection standards: Applied</li>
                  <li>✓ Best interests duty: Framework in place</li>
                  <li>✓ Disclosure obligations: In progress</li>
                </ul>
              </div>
            </div>

            <div className="p-5 bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-400 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-700 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-base text-green-900 mb-2">✅ ALL VERIFICATION CHECKS COMPLETE & COMPLIANT</p>
                  <p className="text-sm text-green-800 mb-3">
                    All third-party verifications have been completed successfully for borrower, guarantor, and property. 
                    No red flags or compliance concerns identified. Case ready to proceed to responsible lending assessment (Step 9).
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-green-900">
                    <div>✓ Total Parties Verified: 2 (Borrower + Guarantor)</div>
                    <div>✓ Total Checks Completed: 8</div>
                    <div>✓ Risk Rating: LOW</div>
                    <div>✓ Compliance Status: FULLY COMPLIANT</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download Complete Verification Pack
              </Button>
              <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve & Continue to Step 6
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

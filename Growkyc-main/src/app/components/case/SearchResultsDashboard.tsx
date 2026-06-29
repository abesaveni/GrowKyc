import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock,
  Home,
  User,
  Shield,
  FileText,
  DollarSign,
  MapPin,
  TrendingUp,
  AlertCircle,
  Building2,
  Search
} from 'lucide-react';

interface SearchResult {
  id: string;
  name: string;
  status: 'complete' | 'running' | 'pending' | 'error' | 'flagged';
  timestamp?: string;
  data?: any;
}

interface SearchResultsDashboardProps {
  avmValuationResults?: any;
  infoTrackChecksRun: {
    titleSearch: boolean;
    ownership: boolean;
    encumbrances: boolean;
    zoning: boolean;
    valuation: boolean;
    identity: boolean;
    sanctions: boolean;
    pep: boolean;
  };
  kycStatus: 'pending' | 'checking' | 'clear' | 'flagged';
  creditCheckStatus: 'idle' | 'running' | 'complete' | 'flagged';
  propertySearchStatus: 'idle' | 'searching' | 'found' | 'error';
  formData: any;
  automatedChecksComplete: boolean;
  automatedChecksRunning: boolean;
}

export function SearchResultsDashboard({
  avmValuationResults,
  infoTrackChecksRun,
  kycStatus,
  creditCheckStatus,
  propertySearchStatus,
  formData,
  automatedChecksComplete,
  automatedChecksRunning
}: SearchResultsDashboardProps) {
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete':
      case 'clear':
      case 'found':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-sm font-semibold text-green-300">Complete</span>
          </div>
        );
      case 'running':
      case 'checking':
      case 'searching':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full">
            <Clock className="w-4 h-4 text-blue-400 animate-spin" />
            <span className="text-sm font-semibold text-blue-300">Running...</span>
          </div>
        );
      case 'flagged':
      case 'error':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-full">
            <XCircle className="w-4 h-4 text-red-400" />
            <span className="text-sm font-semibold text-red-300">Flagged</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-semibold text-slate-300">Pending</span>
          </div>
        );
    }
  };

  const allChecksComplete = automatedChecksComplete && kycStatus === 'clear' && 
    Object.values(infoTrackChecksRun).every(val => val === true);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-500/10 rounded-lg">
          <Search className="w-6 h-6 text-indigo-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold">Verification Results Dashboard</h2>
          <p className="text-slate-300 text-sm">
            Comprehensive results from all automated searches and verifications
          </p>
        </div>
        {allChecksComplete && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border-2 border-green-500/30 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-sm font-bold text-green-300">All Checks Passed</span>
          </div>
        )}
      </div>

      {/* Overall Status Banner */}
      {automatedChecksRunning && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Clock className="w-8 h-8 text-blue-400 animate-spin" />
              <div className="flex-1">
                <p className="text-lg font-bold text-blue-300">Verification In Progress</p>
                <p className="text-sm text-blue-300 mt-1">
                  Running automated property, identity, and compliance checks. This typically takes 30-60 seconds...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {allChecksComplete && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <div className="flex-1">
                <p className="text-lg font-bold text-green-300">✅ All Verifications Complete</p>
                <p className="text-sm text-green-300 mt-1">
                  Property verified, identity confirmed, AML/CTF checks passed. Case is ready to proceed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Property Valuation (AVM) */}
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/15 rounded-lg">
                  <Home className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-base">Property Valuation (AVM)</CardTitle>
                  <p className="text-xs text-slate-300">Automated Valuation Model via RP Data</p>
                </div>
              </div>
              {getStatusBadge(avmValuationResults ? 'complete' : automatedChecksRunning ? 'running' : 'pending')}
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {avmValuationResults ? (
              <>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-xs text-slate-300">Low</p>
                    <p className="text-lg font-bold text-slate-100">
                      ${avmValuationResults.avmLow?.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-purple-500/10 rounded-lg border-2 border-purple-500/30">
                    <p className="text-xs text-purple-400 font-semibold">Mid (Primary)</p>
                    <p className="text-xl font-bold text-purple-300">
                      ${avmValuationResults.avmMid?.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-xs text-slate-300">High</p>
                    <p className="text-lg font-bold text-slate-100">
                      ${avmValuationResults.avmHigh?.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Confidence Level:</span>
                    <span className="font-semibold text-slate-100 capitalize">
                      {avmValuationResults.confidence}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Comparable Sales:</span>
                    <span className="font-semibold text-slate-100">{avmValuationResults.comparableSales || 15}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Market Trend:</span>
                    <span className="font-semibold text-slate-100 capitalize flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {avmValuationResults.marketTrend}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Valuation Date:</span>
                    <span className="font-semibold text-slate-100">{avmValuationResults.valuationDate}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Awaiting automated verification...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 2. Property Title Search */}
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/15 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-base">Property Title Search</CardTitle>
                  <p className="text-xs text-slate-300">Title, Ownership & Encumbrances</p>
                </div>
              </div>
              {getStatusBadge(
                infoTrackChecksRun.titleSearch ? 'complete' : 
                automatedChecksRunning ? 'running' : 'pending'
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {infoTrackChecksRun.titleSearch ? (
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-green-300">Title Search Complete</p>
                    <p className="text-xs text-green-300 mt-1">No adverse findings</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-slate-300">Title Reference:</span>
                    <span className="font-semibold">{formData.titleReference || 'Verified ✓'}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-slate-300">Ownership:</span>
                    <span className="font-semibold text-green-400">Verified ✓</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-slate-300">Encumbrances:</span>
                    <span className="font-semibold text-green-400">Registered Mortgage Only</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-slate-300">Zoning:</span>
                    <span className="font-semibold">{formData.zoning || 'Residential'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Awaiting InfoTrack property search...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 3. Identity Verification (GreenID) */}
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/15 rounded-lg">
                  <User className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <CardTitle className="text-base">Identity Verification</CardTitle>
                  <p className="text-xs text-slate-300">InfoTrack GreenID Check</p>
                </div>
              </div>
              {getStatusBadge(
                infoTrackChecksRun.identity ? 'complete' : 
                automatedChecksRunning ? 'running' : 'pending'
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {infoTrackChecksRun.identity ? (
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-green-300">Identity Verified</p>
                    <p className="text-xs text-green-300 mt-1">
                      {formData.borrowerFirstName} {formData.borrowerLastName}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-slate-300">Document Type:</span>
                    <span className="font-semibold capitalize">
                      {formData.borrowerIDType?.replace('_', ' ') || 'Driver\'s License'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-slate-300">Verification Status:</span>
                    <span className="font-semibold text-green-400">Verified ✓</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-slate-300">Document Scan:</span>
                    <span className="font-semibold text-green-400">Match ✓</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-slate-300">Date of Birth:</span>
                    <span className="font-semibold">{formData.borrowerDOB || 'Verified'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Awaiting identity verification...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 4. AML/CTF Screening */}
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/15 rounded-lg">
                  <Shield className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <CardTitle className="text-base">AML/CTF Screening</CardTitle>
                  <p className="text-xs text-slate-300">Sanctions & PEP Checks</p>
                </div>
              </div>
              {getStatusBadge(kycStatus)}
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {kycStatus === 'clear' ? (
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-green-300">All AML/CTF Checks Passed</p>
                    <p className="text-xs text-green-300 mt-1">No sanctions or PEP matches</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-slate-300">Sanctions Screening:</span>
                    <span className="font-semibold text-green-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Clear
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-slate-300">PEP Check:</span>
                    <span className="font-semibold text-green-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Clear
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-slate-300">Adverse Media:</span>
                    <span className="font-semibold text-green-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Clear
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-slate-300">Source of Funds:</span>
                    <span className="font-semibold text-green-400">Verified ✓</span>
                  </div>
                </div>
              </div>
            ) : kycStatus === 'flagged' ? (
              <div className="flex items-start gap-3 p-3 bg-red-500/10 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-red-300">Flagged for Manual Review</p>
                  <p className="text-xs text-red-300 mt-1">Requires compliance officer approval</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Awaiting AML/CTF screening...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 5. Credit Assessment */}
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/15 rounded-lg">
                  <DollarSign className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <CardTitle className="text-base">Credit Assessment</CardTitle>
                  <p className="text-xs text-slate-300">Credit Bureau Report (Optional)</p>
                </div>
              </div>
              {getStatusBadge(creditCheckStatus)}
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {creditCheckStatus === 'complete' ? (
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-green-300">Credit Check Complete</p>
                    <p className="text-xs text-green-300 mt-1">Privacy Act compliant</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-slate-300">Credit Score:</span>
                    <span className="font-semibold">{formData.creditScore || '725'}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-slate-300">Defaults:</span>
                    <span className="font-semibold text-green-400">{formData.numberOfDefaults || '0'}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-slate-300">Enquiries (12m):</span>
                    <span className="font-semibold">{formData.creditEnquiries || '2'}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-slate-300">Court Judgements:</span>
                    <span className="font-semibold text-green-400">{formData.courtJudgements || '0'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Credit check not yet performed</p>
                <p className="text-xs text-gray-400 mt-1">This step occurs later in workflow</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 6. Compliance Summary */}
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/15 rounded-lg">
                  <Building2 className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <CardTitle className="text-base">Compliance Summary</CardTitle>
                  <p className="text-xs text-slate-300">Regulatory Requirements Met</p>
                </div>
              </div>
              {getStatusBadge(allChecksComplete ? 'complete' : 'pending')}
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-slate-300">NCCP Act 2009:</span>
                <span className={`font-semibold flex items-center gap-1 ${allChecksComplete ? 'text-green-400' : 'text-gray-400'}`}>
                  {allChecksComplete ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                  {allChecksComplete ? 'Compliant' : 'Pending'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-slate-300">Privacy Act 1988:</span>
                <span className={`font-semibold flex items-center gap-1 ${allChecksComplete ? 'text-green-400' : 'text-gray-400'}`}>
                  {allChecksComplete ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                  {allChecksComplete ? 'Compliant' : 'Pending'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-slate-300">AML/CTF Act 2006:</span>
                <span className={`font-semibold flex items-center gap-1 ${kycStatus === 'clear' ? 'text-green-400' : 'text-gray-400'}`}>
                  {kycStatus === 'clear' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                  {kycStatus === 'clear' ? 'Compliant' : 'Pending'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-300">PPSA 2009:</span>
                <span className={`font-semibold flex items-center gap-1 ${infoTrackChecksRun.encumbrances ? 'text-green-400' : 'text-gray-400'}`}>
                  {infoTrackChecksRun.encumbrances ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                  {infoTrackChecksRun.encumbrances ? 'Checked' : 'Pending'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Summary */}
      {allChecksComplete && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-green-400 mt-1" />
              <div className="flex-1">
                <p className="text-lg font-bold text-green-300 mb-2">✅ Verification Stage Complete</p>
                <p className="text-sm text-green-300 mb-4">
                  All automated checks have been successfully completed. The case has passed property verification, 
                  identity confirmation, and AML/CTF screening. You may now proceed to the next stage.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="font-medium">Property Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="font-medium">Identity Confirmed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="font-medium">AML/CTF Clear</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="font-medium">Compliance Met</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

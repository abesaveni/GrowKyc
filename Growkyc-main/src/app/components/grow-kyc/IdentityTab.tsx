import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  User,
  Fingerprint,
  MapPin,
  TrendingUp,
  AlertTriangle,
  CheckSquare
} from 'lucide-react';
import { toast } from 'sonner';

const DOCUMENT_POINTS: Record<string, number> = {
  'Passport': 70,
  'Birth Certificate': 70,
  'Citizenship Certificate': 70,
  'Driver License': 40,
  'Proof of Age Card': 40,
  'Medicare Card': 25,
  'Utility Bill': 25,
  'Bank Statement': 25,
  'Credit Card': 25,
  'Company Extract': 70,
  'Partnership Agreement': 70,
  'Certificate of Incorporation': 70,
};

interface IdentityTabProps {
  client: any;
}

export function IdentityTab({ client }: IdentityTabProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date().toLocaleTimeString());

  const handleRerunVerification = () => {
    alert("Re-running verification...");
    setIsRefreshing(true);
    toast.info('Starting fresh identity verification pulse...');

    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshed(new Date().toLocaleTimeString());
      toast.success('Identity verification completed successfully.');
    }, 2000);
  };

  const identityData = client?.identityData || {};
  const fraudFlags = Array.isArray(identityData?.fraudFlags) ? identityData.fraudFlags : [];
  
  // Dynamic Confidence Score Calculation (Out of 1000)
  const calculateConfidenceScore = () => {
    if (identityData.greenIDScore) return identityData.greenIDScore; // Use 3rd party score if available
    
    let score = 0;
    // 1. Document Verification (Up to 400 points)
    if (identityData.primaryID?.verified) score += 250;
    if (identityData.secondaryID?.verified) score += 150;
    
    // 2. Biometric Scan (Up to 300 points)
    if (identityData.biometricStatus === 'Passed') score += 300;
    else if (identityData.biometricStatus === 'Pending') score += 100;
    
    // 3. Liveness Check (150 points)
    if (identityData.livenessCheck) score += 150;
    
    // 4. Address Verification (100 points)
    if (identityData.addressVerified) score += 100;
    
    // 5. Fraud Penalties (Up to -200 points)
    const penalty = fraudFlags.length * 50;
    score = Math.max(0, score - penalty);
    
    return score;
  };

  const confidenceScore = calculateConfidenceScore();
  const isVerified = identityData?.primaryID?.verified && identityData?.biometricStatus === 'Passed' && confidenceScore > 600;

  const getPoints = (docType?: string) => docType ? (DOCUMENT_POINTS[docType] || 0) : 0;
  
  const primaryPoints = identityData?.primaryID ? getPoints(identityData.primaryID.type) : 0;
  const secondaryPoints = identityData?.secondaryID ? getPoints(identityData.secondaryID.type) : 0;
  const additionalPoints = Array.isArray(identityData?.additionalDocuments) 
    ? identityData.additionalDocuments.reduce((sum, doc) => sum + getPoints(doc.type), 0)
    : 0;

  const totalPoints = primaryPoints + secondaryPoints + additionalPoints;
  const hasDeficiency = totalPoints < 100;

  return (
    <div className="space-y-6">
      {/* Verification Status Banner */}
      <Card className={`border-2 ${isVerified ? 'border-green-300 bg-green-50/50' : 'border-red-300 bg-red-50/50'}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${isVerified ? 'bg-green-100' : 'bg-red-100'}`}>
                {isVerified ? (
                  <ShieldCheck className={`w-8 h-8 ${isVerified ? 'text-green-600' : 'text-red-600'}`} />
                ) : (
                  <ShieldAlert className={`w-8 h-8 ${isVerified ? 'text-green-600' : 'text-red-600'}`} />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {isVerified ? 'Verification Status: Verified' : 'Verification Status: Failed'}
                </h2>
                <p className="text-slate-300">
                  {isVerified
                    ? `Verified via ${identityData?.primaryID?.type || 'ID'} and Biometric Scan`
                    : 'Critical discrepancies found in submitted documentation'}
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">
                  Session ID: <span className="text-blue-500">{client.id?.split('-')[1] || '001'}</span> • Last Refreshed: {lastRefreshed}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right mr-4">
                  <p className={`text-sm font-medium uppercase tracking-wider ${confidenceScore > 800 ? 'text-green-600' : confidenceScore > 500 ? 'text-blue-600' : 'text-red-600'}`}>
                    Verification Confidence Score
                  </p>
                  <div className="flex items-center gap-2 justify-end">
                    <TrendingUp className={`w-4 h-4 ${confidenceScore > 800 ? 'text-green-600' : confidenceScore > 500 ? 'text-blue-600' : 'text-red-600'}`} />
                    <p className={`text-3xl font-black ${confidenceScore > 800 ? 'text-green-700' : confidenceScore > 500 ? 'text-blue-700' : 'text-red-700'}`}>
                      {confidenceScore}/1000
                    </p>
                  </div>
              </div>
              <Button
                onClick={handleRerunVerification}
                disabled={isRefreshing}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 min-w-[180px]"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Re-running...' : 'Re-run Verification'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 100-Point Identity Check */}
      <Card className="shadow-md border-white/10">
        <CardHeader className="border-b bg-gray-50/50 flex flex-row items-center justify-between py-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-blue-600" />
            100-Point Identity Check
          </CardTitle>
          <div className="flex items-center gap-4">
            <Badge variant={hasDeficiency ? "destructive" : "default"} className={hasDeficiency ? "bg-red-100 text-red-700 hover:bg-red-200 border-none px-3" : "bg-green-100 text-green-700 hover:bg-green-200 border-none px-3"}>
              {hasDeficiency ? "Deficient" : "Satisfied"}
            </Badge>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-black ${hasDeficiency ? 'text-red-600' : 'text-green-600'}`}>
                  {totalPoints}
                </span>
                <span className="text-sm text-slate-400 font-bold uppercase tracking-tight">/ 100 Points</span>
              </div>
              <div className="w-48 h-2 bg-[#0a0e17] rounded-full overflow-hidden border border-gray-200/50">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((totalPoints / 100) * 100, 100)}%` }}
                  className={`h-full transition-all duration-1000 ${hasDeficiency ? 'bg-red-500' : 'bg-green-500'}`}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {hasDeficiency && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-start gap-3 shadow-sm">
                  <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="font-bold text-orange-900">Additional Documentation Required</p>
                    <p className="text-sm text-orange-700 mt-1">
                        The current documents provide <span className="font-bold">{totalPoints}</span> points. At least 100 points are required. 
                        Please request additional secondary documentation from the client.
                    </p>
                  </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {identityData?.primaryID && (
                <div className="flex items-center justify-between p-4 bg-[#0d121d] border border-white/10 rounded-xl shadow-sm hover:border-blue-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{identityData.primaryID.type}</p>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Primary Identifier</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-blue-600">+{getPoints(identityData.primaryID.type)}</span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Points</p>
                  </div>
                </div>
              )}

              {identityData?.secondaryID && (
                <div className="flex items-center justify-between p-4 bg-[#0d121d] border border-white/10 rounded-xl shadow-sm hover:border-blue-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{identityData.secondaryID.type}</p>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Secondary Identifier</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-indigo-600">+{getPoints(identityData.secondaryID.type)}</span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Points</p>
                  </div>
                </div>
              )}
              {identityData?.additionalDocuments?.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-[#0d121d] border border-white/10 rounded-xl shadow-sm hover:border-blue-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0a0e17] flex items-center justify-center">
                      <FileText className="w-5 h-5 text-slate-300" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{doc.type}</p>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Additional Identifier</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-slate-300">+{getPoints(doc.type)}</span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Points</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-dashed border-white/10 flex items-center justify-between">
              <p className="text-sm text-slate-400 font-medium italic">Calculated based on standard 100-Point Identity Check guidelines.</p>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-[#0a0e17] rounded-full border border-white/10">
                <div className={`w-2 h-2 rounded-full ${hasDeficiency ? 'bg-red-400' : 'bg-green-400 animate-pulse'}`} />
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wide">
                  {hasDeficiency ? 'Requirement Not Met' : 'Requirement Satisfied'}
                </span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/10">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Accepted Document Types & Points</p>
              <div className="flex flex-wrap gap-2">
                  {Object.entries(DOCUMENT_POINTS).map(([doc, pts]) => (
                    <Badge key={doc} variant="outline" className="bg-[#0a0e17] text-slate-300 border-white/10">
                      {doc} <span className="ml-1 text-slate-400 font-semibold">({pts})</span>
                    </Badge>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ID Documentation Details */}
        <Card className="shadow-md border-white/10">
          <CardHeader className="border-b bg-gray-50/50">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Document Verification Assets
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {identityData?.primaryID ? (
                <div className="p-4 rounded-lg bg-[#0d121d] border border-white/10 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Primary Document</p>
                  <p className="font-bold text-white">{identityData.primaryID.type}</p>
                  <p className="text-sm text-slate-400 font-mono mt-1">{identityData.primaryID.number}</p>
                  <Badge className={`mt-2 ${identityData.primaryID.verified ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-red-100 text-red-700 hover:bg-red-100'} border-none`}>
                    {identityData.primaryID.verified ? (
                      <><CheckCircle2 className="w-3 h-3 mr-1" /> Verified</>
                    ) : (
                      <><XCircle className="w-3 h-3 mr-1" /> Unverified</>
                    )}
                  </Badge>
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-[#0a0e17] border border-white/10 shadow-sm flex items-center justify-center text-slate-400">
                  No Primary Document Provided
                </div>
              )}
              {identityData?.secondaryID && (
                <div className="p-4 rounded-lg bg-[#0d121d] border border-white/10 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Secondary Document</p>
                  <p className="font-bold text-white">{identityData.secondaryID.type}</p>
                  <p className="text-sm text-slate-400 font-mono mt-1">{identityData.secondaryID.number}</p>
                  <Badge className={`mt-2 ${identityData.secondaryID.verified ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-red-100 text-red-700 hover:bg-red-100'} border-none`}>
                    {identityData.secondaryID.verified ? (
                      <><CheckCircle2 className="w-3 h-3 mr-1" /> Verified</>
                    ) : (
                      <><XCircle className="w-3 h-3 mr-1" /> Unverified</>
                    )}
                  </Badge>
                </div>
              )}
              {identityData?.additionalDocuments?.map((doc, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-[#0d121d] border border-white/10 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Supporting Document</p>
                  <p className="font-bold text-white">{doc.type}</p>
                  <p className="text-sm text-slate-400 font-mono mt-1">{doc.number}</p>
                  <Badge className={`mt-2 ${doc.verified ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-red-100 text-red-700 hover:bg-red-100'} border-none`}>
                    {doc.verified ? (
                      <><CheckCircle2 className="w-3 h-3 mr-1" /> Verified</>
                    ) : (
                      <><XCircle className="w-3 h-3 mr-1" /> Unverified</>
                    )}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                <div className="flex items-center gap-3">
                  <Fingerprint className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-semibold text-white">Biometric Authenticity</p>
                    <p className="text-xs text-slate-400">Facial recognition vs ID photo</p>
                  </div>
                </div>
                <Badge 
                  variant={identityData?.biometricStatus === 'Passed' ? 'default' : 'secondary'} 
                  className={
                    identityData?.biometricStatus === 'Passed' ? 'bg-green-100 text-green-700 hover:bg-green-100 border-none' : 
                    identityData?.biometricStatus === 'Not Required' ? 'bg-[#0a0e17] text-slate-400 hover:bg-white/5 border-none' : 
                    'bg-red-100 text-red-700 hover:bg-red-100 border-none'
                  }
                >
                  {identityData?.biometricStatus === 'Not Required' ? 'Not Required (Entity)' : (identityData?.biometricStatus || 'Pending')}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="font-semibold text-white">Liveness Pulse</p>
                    <p className="text-xs text-slate-400">Real-time presence detection</p>
                  </div>
                </div>
                <Badge className={identityData?.livenessCheck === true ? 'bg-green-600' : identityData?.livenessCheck === false ? 'bg-red-600' : 'bg-orange-500'}>
                  {identityData?.livenessCheck === true ? 'PASSED' : identityData?.livenessCheck === false ? 'FAILED' : 'PENDING'}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className="font-semibold text-white">Address Geo-Verification</p>
                    <p className="text-xs text-slate-400">Electoral roll & utility link</p>
                  </div>
                </div>
                <Badge className={identityData?.addressVerified === true ? 'bg-green-600' : identityData?.addressVerified === false ? 'bg-red-600' : 'bg-orange-500'}>
                  {identityData?.addressVerified === true ? 'VERIFIED' : identityData?.addressVerified === false ? 'UNVERIFIED' : 'PENDING'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fraud & Security Flags */}
        <Card className="shadow-md border-white/10">
          <CardHeader className="border-b bg-gray-50/50 flex flex-row items-center justify-between py-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Fraud Flags & Risk Indicators
            </CardTitle>
            <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200 px-3">
              Fraud Flags: {fraudFlags.filter(f => f.type === 'warning').length} Detected
            </Badge>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {fraudFlags.length === 0 ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center shadow-sm">
                  <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="font-bold text-green-900">System Clear</p>
                  <p className="text-sm text-green-700">No fraud flags or anomalies detected on this identity profile.</p>
                </div>
              ) : (
                fraudFlags.map((flag: any) => (
                  <div
                    key={flag.id}
                    className={`flex gap-3 p-4 rounded-xl border-l-4 shadow-sm ${flag.type === 'warning' ? 'bg-red-50 border-red-500 border-red-100' :
                        flag.type === 'success' ? 'bg-green-50 border-l-green-500 border-green-100' :
                          'bg-blue-50 border-l-blue-500 border-blue-100'
                      }`}
                  >
                    <div className="mt-0.5">
                      {flag.type === 'warning' && <AlertCircle className="w-5 h-5 text-red-600" />}
                      {flag.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                      {flag.type === 'info' && <RefreshCw className="w-5 h-5 text-blue-600" />}
                    </div>
                    <div>
                      <p className={`font-bold text-sm ${flag.type === 'warning' ? 'text-red-900' :
                          flag.type === 'success' ? 'text-green-900' :
                            'text-blue-900'
                        }`}>
                        {flag.type === 'warning' ? 'High Risk Indicator' :
                          flag.type === 'success' ? 'Security Affirmation' :
                            'System Notice'}
                      </p>
                      <p className={`text-sm mt-0.5 ${flag.type === 'warning' ? 'text-red-700' :
                          flag.type === 'success' ? 'text-green-700' :
                            'text-blue-700'
                        }`}>
                        {flag.message}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-8 p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-start gap-3">
              <Shield className="w-6 h-6 text-indigo-600 mt-1" />
              <div>
                <p className="font-bold text-indigo-900">AI Trust Score Confidence</p>
                <p className="text-sm text-indigo-700 mt-1 uppercase tracking-tight font-semibold">
                  This identity profile has been cross-referenced with {10 + (identityData?.additionalDocuments?.length || 0) + fraudFlags.length} global data points and historical patterns.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

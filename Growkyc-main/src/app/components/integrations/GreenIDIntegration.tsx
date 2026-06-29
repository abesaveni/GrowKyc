import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  User,
  Calendar,
  CreditCard,
  FileCheck,
  Clock,
  Download,
  RefreshCw
} from 'lucide-react';

interface GreenIDIntegrationProps {
  entityData: any;
  onComplete?: (results: any) => void;
}

export function GreenIDIntegration({ entityData, onComplete }: GreenIDIntegrationProps) {
  const [status, setStatus] = useState<'idle' | 'verifying' | 'verified' | 'failed'>('idle');
  const [results, setResults] = useState<any>(null);

  const startVerification = async () => {
    setStatus('verifying');
    
    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock GreenID verification results
    const mockResults = {
      verificationId: 'GID-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      timestamp: new Date().toISOString(),
      overallStatus: 'verified',
      confidenceScore: 98,
      documents: [
        {
          type: 'Australian Drivers License',
          state: 'VIC',
          number: 'DL*****789',
          status: 'verified',
          expiryDate: '2028-06-15',
          dvs: 'passed',
          confidence: 99
        },
        {
          type: 'Australian Passport',
          number: 'PA*****123',
          status: 'verified',
          expiryDate: '2030-03-20',
          dvs: 'passed',
          confidence: 97
        }
      ],
      dvsChecks: {
        status: 'passed',
        documentsVerified: 2,
        governmentDatabaseMatch: true,
        dataConsistency: 'high'
      },
      amlCtfScreening: {
        pepCheck: 'clear',
        sanctionsList: 'clear',
        adverseMedia: 'clear',
        watchlists: 'clear'
      },
      addressVerification: {
        status: 'verified',
        method: 'Electoral Roll',
        confidence: 95
      },
      biometricCheck: {
        faceMatch: 98,
        livenessDetection: 'passed'
      },
      riskIndicators: [] as string[],
      recommendation: 'approve'
    };
    
    setResults(mockResults);
    setStatus('verified');
    
    if (onComplete) {
      onComplete(mockResults);
    }
  };

  if (status === 'idle') {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-8 text-white text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold mb-2">GreenID Identity Verification</h2>
          <p className="text-green-100 mb-6">DVS-certified identity verification powered by GreenID</p>
          <Button
            className="bg-white text-green-400 hover:bg-green-500/10 px-8 py-6 text-lg"
            onClick={startVerification}
          >
            <Shield className="w-6 h-6 mr-3" />
            Start Verification
          </Button>
        </div>

        <div className="bg-white rounded-lg border border-white/10 p-6">
          <h3 className="font-bold text-slate-100 mb-4">What is GreenID?</h3>
          <div className="space-y-3 text-sm text-slate-300">
            <p>
              GreenID is Australia's leading identity verification service, providing real-time verification
              against government databases through the Document Verification Service (DVS).
            </p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">DVS Certified</p>
                  <p className="text-xs text-slate-300">Direct government database checks</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">AML/CTF Screening</p>
                  <p className="text-xs text-slate-300">PEP, sanctions, and watchlist checks</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Real-time Results</p>
                  <p className="text-xs text-slate-300">Instant verification responses</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">AUSTRAC Compliant</p>
                  <p className="text-xs text-slate-300">Meets all regulatory requirements</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <h4 className="font-semibold text-blue-300 mb-2">Entity to be Verified</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-slate-300">Name:</p>
              <p className="font-semibold text-slate-100">{entityData.name || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-slate-300">Date of Birth:</p>
              <p className="font-semibold text-slate-100">{entityData.dateOfBirth || 'Not provided'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-slate-300">Address:</p>
              <p className="font-semibold text-slate-100">{entityData.address || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'verifying') {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-24 h-24 bg-green-500/15 rounded-full flex items-center justify-center mb-6">
          <RefreshCw className="w-12 h-12 text-green-400 animate-spin" />
        </div>
        <h3 className="text-2xl font-bold text-slate-100 mb-2">Verifying Identity...</h3>
        <p className="text-slate-300 mb-6">Checking government databases and screening lists</p>
        <div className="space-y-2 w-full max-w-md">
          {[
            'Verifying drivers license...',
            'Checking DVS database...',
            'Running AML/CTF screening...',
            'Verifying address...',
            'Completing biometric checks...'
          ].map((step, index) => (
            <div key={index} className="flex items-center text-sm text-slate-300">
              <Clock className="w-4 h-4 text-green-400 mr-2 animate-pulse" />
              {step}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (status === 'verified' && results) {
    return (
      <div className="space-y-6">
        {/* Success Header */}
        <div className="bg-green-500/10 border-2 border-green-500/30 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mr-4">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-green-300">Identity Verified</h3>
                <p className="text-green-300">GreenID Verification ID: {results.verificationId}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-green-400">{results.confidenceScore}%</div>
              <div className="text-sm text-green-300">Confidence Score</div>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-4 border-t border-green-500/30">
            <Button className="flex-1 bg-green-600 hover:bg-green-700">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
            <Button variant="outline" className="flex-1">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reverify
            </Button>
          </div>
        </div>

        {/* Verified Documents */}
        <div className="bg-white rounded-lg border border-white/10 p-6">
          <h4 className="font-bold text-slate-100 mb-4 flex items-center">
            <FileCheck className="w-5 h-5 text-green-400 mr-2" />
            Verified Documents
          </h4>
          <div className="space-y-3">
            {results.documents.map((doc: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                <div className="flex items-center">
                  <FileText className="w-6 h-6 text-green-400 mr-3" />
                  <div>
                    <p className="font-semibold text-slate-100">{doc.type}</p>
                    <p className="text-sm text-slate-300">
                      {doc.number} • Expires: {doc.expiryDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-300">DVS: {doc.dvs.toUpperCase()}</p>
                    <p className="text-xs text-slate-300">Confidence: {doc.confidence}%</p>
                  </div>
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DVS Checks */}
        <div className="bg-white rounded-lg border border-white/10 p-6">
          <h4 className="font-bold text-slate-100 mb-4 flex items-center">
            <Shield className="w-5 h-5 text-blue-400 mr-2" />
            Document Verification Service (DVS) Results
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30 text-center">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="font-bold text-green-300">PASSED</p>
              <p className="text-xs text-slate-300 mt-1">DVS Status</p>
            </div>
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30 text-center">
              <p className="text-3xl font-bold text-green-400">{results.dvsChecks.documentsVerified}</p>
              <p className="text-xs text-slate-300 mt-1">Documents Verified</p>
            </div>
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30 text-center">
              <p className="font-bold text-green-300">HIGH</p>
              <p className="text-xs text-slate-300 mt-1">Data Consistency</p>
            </div>
          </div>
        </div>

        {/* AML/CTF Screening */}
        <div className="bg-white rounded-lg border border-white/10 p-6">
          <h4 className="font-bold text-slate-100 mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 text-purple-400 mr-2" />
            AML/CTF Screening Results
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'PEP Check', status: results.amlCtfScreening.pepCheck },
              { label: 'Sanctions List', status: results.amlCtfScreening.sanctionsList },
              { label: 'Adverse Media', status: results.amlCtfScreening.adverseMedia },
              { label: 'Watchlists', status: results.amlCtfScreening.watchlists }
            ].map((check, index) => (
              <div key={index} className="p-3 bg-green-500/10 rounded-lg border border-green-500/30 text-center">
                <p className="text-sm text-slate-300 mb-1">{check.label}</p>
                <p className="font-bold text-green-300">{check.status.toUpperCase()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Address Verification */}
        <div className="bg-white rounded-lg border border-white/10 p-6">
          <h4 className="font-bold text-slate-100 mb-4 flex items-center">
            <User className="w-5 h-5 text-indigo-400 mr-2" />
            Additional Verifications
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-slate-100">Address Verification</p>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-sm text-slate-300">Method: {results.addressVerification.method}</p>
              <p className="text-sm text-slate-300">Confidence: {results.addressVerification.confidence}%</p>
            </div>
            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-slate-100">Biometric Check</p>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-sm text-slate-300">Face Match: {results.biometricCheck.faceMatch}%</p>
              <p className="text-sm text-slate-300">Liveness: {results.biometricCheck.livenessDetection}</p>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="bg-green-500/10 border-2 border-green-500/30 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xl font-bold text-green-300 mb-2">Recommendation: APPROVE</h4>
              <p className="text-green-300">
                All identity verification checks passed. Entity has been successfully verified through GreenID
                and meets all AUSTRAC AML/CTF requirements. Safe to proceed with onboarding.
              </p>
            </div>
            <CheckCircle className="w-16 h-16 text-green-400" />
          </div>
        </div>

        {/* Audit Trail */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <h4 className="font-semibold text-slate-100 mb-3">Audit Information</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-slate-300">Verification ID:</p>
              <p className="font-mono font-semibold text-slate-100">{results.verificationId}</p>
            </div>
            <div>
              <p className="text-slate-300">Timestamp:</p>
              <p className="font-semibold text-slate-100">{new Date(results.timestamp).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-slate-300">Provider:</p>
              <p className="font-semibold text-slate-100">GreenID</p>
            </div>
            <div>
              <p className="text-slate-300">Retention:</p>
              <p className="font-semibold text-slate-100">7 years from verification</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

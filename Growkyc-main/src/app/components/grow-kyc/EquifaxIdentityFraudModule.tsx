import React, { useState } from 'react';
import { toast } from '../../lib/toast';
import { Button } from '../ui/button';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  RefreshCw,
  Clock,
  FileText,
  User,
  Mail,
  Smartphone,
  MapPin,
  CreditCard,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  TrendingUp,
  Activity,
  Lock,
  Fingerprint,
  Scan,
  Database
} from 'lucide-react';

interface IdentityVerificationResult {
  id: string;
  clientId: string;
  clientName: string;
  verificationStatus: 'verified' | 'partial' | 'failed' | 'pending';
  fraudScore: number; // 0-100, higher = more risk
  fraudRiskLevel: 'low' | 'medium' | 'high' | 'critical';
  verifiedDate: Date;
  expiryDate: Date;
  source: 'Equifax Identity';
  pulledBy: string;
  
  // Identity Match Sources
  matchSources: {
    passport: boolean;
    driversLicense: boolean;
    medicareCard: boolean;
    birthCertificate: boolean;
    creditFile: boolean;
    electoralRoll: boolean;
    utilityBill: boolean;
  };
  
  // Biometric Results
  biometric: {
    faceMatch: boolean;
    faceMatchScore: number; // 0-100
    livenessCheck: boolean;
    documentAuthenticity: boolean;
  } | null;
  
  // Fraud Indicators
  fraudIndicators: {
    syntheticIdentity: boolean;
    identityTheft: boolean;
    documentManipulation: boolean;
    addressMismatch: boolean;
    ageMismatch: boolean;
    deceasedMatch: boolean;
    multiplePeople: boolean;
  };
  
  // Email & Device Risk
  emailRisk: {
    score: number; // 0-100
    disposable: boolean;
    suspicious: boolean;
    firstSeen: Date | null;
    breachHistory: boolean;
  };
  
  deviceRisk: {
    score: number; // 0-100
    vpnDetected: boolean;
    proxyDetected: boolean;
    emulatorDetected: boolean;
    botDetected: boolean;
    trustedDevice: boolean;
  };
  
  // Raw Response
  rawResponse: any;
  evidencePdfUrl: string;
  reportHash: string;
}

interface HistoryRecord {
  date: Date;
  action: string;
  user: string;
  fraudScore: number;
  status: string;
  changes: string[];
}

export function EquifaxIdentityFraudModule() {
  const [selectedClient, setSelectedClient] = useState<string | null>('CLI-001');
  const [showRawData, setShowRawData] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    matchSources: true,
    biometric: false,
    fraudIndicators: true,
    emailRisk: false,
    deviceRisk: false
  });

  // Mock Data
  const [verificationResult] = useState<IdentityVerificationResult>({
    id: 'EQ-ID-2024-001',
    clientId: 'CLI-001',
    clientName: 'Sarah Mitchell',
    verificationStatus: 'verified',
    fraudScore: 12,
    fraudRiskLevel: 'low',
    verifiedDate: new Date('2024-03-20T10:30:00'),
    expiryDate: new Date('2025-03-20T10:30:00'),
    source: 'Equifax Identity',
    pulledBy: 'compliance@growkyc.com',
    
    matchSources: {
      passport: true,
      driversLicense: true,
      medicareCard: true,
      birthCertificate: false,
      creditFile: true,
      electoralRoll: true,
      utilityBill: true
    },
    
    biometric: {
      faceMatch: true,
      faceMatchScore: 96,
      livenessCheck: true,
      documentAuthenticity: true
    },
    
    fraudIndicators: {
      syntheticIdentity: false,
      identityTheft: false,
      documentManipulation: false,
      addressMismatch: false,
      ageMismatch: false,
      deceasedMatch: false,
      multiplePeople: false
    },
    
    emailRisk: {
      score: 8,
      disposable: false,
      suspicious: false,
      firstSeen: new Date('2018-05-12'),
      breachHistory: false
    },
    
    deviceRisk: {
      score: 5,
      vpnDetected: false,
      proxyDetected: false,
      emulatorDetected: false,
      botDetected: false,
      trustedDevice: true
    },
    
    rawResponse: {
      verificationId: 'EQ-ID-2024-001',
      timestamp: '2024-03-20T10:30:00Z',
      status: 'success'
    },
    evidencePdfUrl: '/evidence/eq-id-2024-001.pdf',
    reportHash: 'sha256:8f3b2c1d9e4a...'
  });

  const history: HistoryRecord[] = [
    {
      date: new Date('2024-03-20T10:30:00'),
      action: 'Initial Verification',
      user: 'compliance@growkyc.com',
      fraudScore: 12,
      status: 'verified',
      changes: ['Identity verified', 'All checks passed']
    },
    {
      date: new Date('2024-02-15T14:20:00'),
      action: 'Refresh Requested',
      user: 'admin@growkyc.com',
      fraudScore: 10,
      status: 'verified',
      changes: ['Fraud score improved']
    },
    {
      date: new Date('2024-01-10T09:15:00'),
      action: 'Initial Check',
      user: 'onboarding@growkyc.com',
      fraudScore: 15,
      status: 'verified',
      changes: ['First verification completed']
    }
  ];

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'partial': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'failed': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getFraudRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 dark:text-green-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'high': return 'text-orange-600 dark:text-orange-400';
      case 'critical': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0E7C9E] to-[#13B5EA] text-white p-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-10 h-10" />
                <h1 className="text-4xl font-bold">Identity Verification & Fraud Detection</h1>
              </div>
              <p className="text-xl text-cyan-100">Equifax Identity Module • Powered by Biometrics & AI</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-cyan-100">Last Updated</div>
              <div className="text-lg font-semibold">{verificationResult.verifiedDate.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Summary Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-[#13B5EA]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <User className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Client</span>
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">{verificationResult.clientName}</div>
              <div className="text-xs text-gray-500">{verificationResult.clientId}</div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Verification Status</span>
              </div>
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(verificationResult.verificationStatus)}`}>
                {verificationResult.verificationStatus === 'verified' && <CheckCircle className="w-4 h-4" />}
                {verificationResult.verificationStatus === 'failed' && <XCircle className="w-4 h-4" />}
                {verificationResult.verificationStatus.toUpperCase()}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Fraud Score</span>
              </div>
              <div className={`text-3xl font-bold ${getFraudRiskColor(verificationResult.fraudRiskLevel)}`}>
                {verificationResult.fraudScore}
                <span className="text-sm font-normal text-gray-500">/100</span>
              </div>
              <div className="text-xs text-gray-500 capitalize">{verificationResult.fraudRiskLevel} Risk</div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Valid Until</span>
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {verificationResult.expiryDate.toLocaleDateString()}
              </div>
              <div className="text-xs text-gray-500">
                {Math.ceil((verificationResult.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days remaining
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Database className="w-4 h-4" />
                <span>Source: {verificationResult.source}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>Pulled by: {verificationResult.pulledBy}</span>
              </div>
              <div className="flex items-center gap-1">
                <Fingerprint className="w-4 h-4" />
                <span>Hash: {verificationResult.reportHash.substring(0, 20)}...</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => window.open(verificationResult.evidencePdfUrl)}>
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
              <Button size="sm" variant="outline" onClick={() => toast.info('Refresh requested')}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Data
              </Button>
            </div>
          </div>
        </div>

        {/* Match Sources Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <button
            onClick={() => toggleSection('matchSources')}
            className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-850 transition-colors"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-[#13B5EA]" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Identity Match Sources</h3>
            </div>
            {expandedSections.matchSources ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          {expandedSections.matchSources && (
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(verificationResult.matchSources).map(([source, matched]) => (
                  <div key={source} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {source.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    {matched ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                ✓ {Object.values(verificationResult.matchSources).filter(Boolean).length} of {Object.keys(verificationResult.matchSources).length} sources matched
              </div>
            </div>
          )}
        </div>

        {/* Biometric Results */}
        {verificationResult.biometric && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={() => toggleSection('biometric')}
              className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-850 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Scan className="w-5 h-5 text-[#13B5EA]" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Biometric Verification</h3>
              </div>
              {expandedSections.biometric ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            {expandedSections.biometric && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Face Match</span>
                      {verificationResult.biometric.faceMatch ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {verificationResult.biometric.faceMatchScore}%
                    </div>
                    <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${verificationResult.biometric.faceMatchScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Liveness Check</span>
                      {verificationResult.biometric.livenessCheck ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {verificationResult.biometric.livenessCheck ? 'Live person detected' : 'Failed liveness check'}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Document Authenticity</span>
                      {verificationResult.biometric.documentAuthenticity ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {verificationResult.biometric.documentAuthenticity ? 'Document verified authentic' : 'Document authenticity failed'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Fraud Indicators */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border-l-4 border-red-500">
          <button
            onClick={() => toggleSection('fraudIndicators')}
            className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-850 transition-colors"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Fraud Risk Indicators</h3>
            </div>
            {expandedSections.fraudIndicators ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          {expandedSections.fraudIndicators && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(verificationResult.fraudIndicators).map(([indicator, detected]) => (
                  <div
                    key={indicator}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      detected
                        ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                        : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                    }`}
                  >
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {indicator.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    {detected ? (
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                ))}
              </div>
              
              {Object.values(verificationResult.fraudIndicators).every(v => !v) && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">No fraud indicators detected</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Email & Device Risk */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email Risk */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={() => toggleSection('emailRisk')}
              className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-850 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#13B5EA]" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Email Risk Analysis</h3>
              </div>
              {expandedSections.emailRisk ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            {expandedSections.emailRisk && (
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Risk Score</span>
                      <span className={`text-2xl font-bold ${verificationResult.emailRisk.score < 30 ? 'text-green-600' : verificationResult.emailRisk.score < 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {verificationResult.emailRisk.score}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${verificationResult.emailRisk.score < 30 ? 'bg-green-600' : verificationResult.emailRisk.score < 60 ? 'bg-yellow-600' : 'bg-red-600'}`}
                        style={{ width: `${verificationResult.emailRisk.score}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className={`p-3 rounded-lg ${verificationResult.emailRisk.disposable ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Disposable</div>
                      <div className="text-sm font-semibold">{verificationResult.emailRisk.disposable ? 'Yes' : 'No'}</div>
                    </div>
                    <div className={`p-3 rounded-lg ${verificationResult.emailRisk.suspicious ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Suspicious</div>
                      <div className="text-sm font-semibold">{verificationResult.emailRisk.suspicious ? 'Yes' : 'No'}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                      <div className="text-xs text-gray-600 dark:text-gray-400">First Seen</div>
                      <div className="text-sm font-semibold">
                        {verificationResult.emailRisk.firstSeen?.toLocaleDateString() || 'Unknown'}
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${verificationResult.emailRisk.breachHistory ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Breach History</div>
                      <div className="text-sm font-semibold">{verificationResult.emailRisk.breachHistory ? 'Yes' : 'No'}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Device Risk */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={() => toggleSection('deviceRisk')}
              className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-850 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-[#13B5EA]" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Device Risk Analysis</h3>
              </div>
              {expandedSections.deviceRisk ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            {expandedSections.deviceRisk && (
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Risk Score</span>
                      <span className={`text-2xl font-bold ${verificationResult.deviceRisk.score < 30 ? 'text-green-600' : verificationResult.deviceRisk.score < 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {verificationResult.deviceRisk.score}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${verificationResult.deviceRisk.score < 30 ? 'bg-green-600' : verificationResult.deviceRisk.score < 60 ? 'bg-yellow-600' : 'bg-red-600'}`}
                        style={{ width: `${verificationResult.deviceRisk.score}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className={`p-3 rounded-lg ${verificationResult.deviceRisk.vpnDetected ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
                      <div className="text-xs text-gray-600 dark:text-gray-400">VPN</div>
                      <div className="text-sm font-semibold">{verificationResult.deviceRisk.vpnDetected ? 'Detected' : 'None'}</div>
                    </div>
                    <div className={`p-3 rounded-lg ${verificationResult.deviceRisk.proxyDetected ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Proxy</div>
                      <div className="text-sm font-semibold">{verificationResult.deviceRisk.proxyDetected ? 'Detected' : 'None'}</div>
                    </div>
                    <div className={`p-3 rounded-lg ${verificationResult.deviceRisk.emulatorDetected ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Emulator</div>
                      <div className="text-sm font-semibold">{verificationResult.deviceRisk.emulatorDetected ? 'Detected' : 'None'}</div>
                    </div>
                    <div className={`p-3 rounded-lg ${verificationResult.deviceRisk.botDetected ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Bot</div>
                      <div className="text-sm font-semibold">{verificationResult.deviceRisk.botDetected ? 'Detected' : 'None'}</div>
                    </div>
                  </div>

                  {verificationResult.deviceRisk.trustedDevice && (
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-300 text-sm">
                        <Lock className="w-4 h-4" />
                        <span className="font-semibold">Trusted Device</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* History Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-850 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-[#13B5EA]" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Verification History</h3>
            </div>
            {showHistory ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          {showHistory && (
            <div className="p-6">
              <div className="space-y-4">
                {history.map((record, index) => (
                  <div key={index} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-[#13B5EA] flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900 dark:text-white">{record.action}</span>
                        <span className="text-xs text-gray-500">{record.date.toLocaleString()}</span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        By: {record.user}
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <span className={`px-2 py-1 rounded ${getStatusColor(record.status)}`}>
                          {record.status.toUpperCase()}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          Fraud Score: {record.fraudScore}
                        </span>
                      </div>
                      {record.changes.length > 0 && (
                        <div className="mt-2 text-xs text-gray-500">
                          {record.changes.map((change, i) => (
                            <div key={i}>• {change}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Raw Data View */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <button
            onClick={() => setShowRawData(!showRawData)}
            className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-850 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-[#13B5EA]" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Raw Response Data</h3>
            </div>
            {showRawData ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          {showRawData && (
            <div className="p-6">
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto text-xs">
                {JSON.stringify(verificationResult.rawResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Actions</h3>
          <div className="flex gap-3">
            <Button onClick={() => toast.info('Refreshing data...')}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
            <Button variant="outline" onClick={() => toast.info('Escalating to compliance team...')}>
              <AlertCircle className="w-4 h-4 mr-2" />
              Escalate
            </Button>
            <Button variant="outline" onClick={() => toast.info('Add note dialog...')}>
              <FileText className="w-4 h-4 mr-2" />
              Add Note
            </Button>
            <Button variant="outline" onClick={() => window.open(verificationResult.evidencePdfUrl)}>
              <Download className="w-4 h-4 mr-2" />
              Download Evidence
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

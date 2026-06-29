import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Shield,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Clock,
  Eye,
  TrendingUp,
  Activity,
  MapPin,
  Smartphone,
  Globe,
  Users,
  CreditCard,
  FileText,
  Brain,
  Zap,
  Lock,
  AlertCircle
} from 'lucide-react';

interface FraudIndicator {
  id: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  detectedAt: Date;
  status: 'active' | 'resolved' | 'investigating';
  confidence: number;
  source: string;
}

interface ClientFraudPanelProps {
  clientId: string;
  clientName: string;
}

export function ClientFraudPanel({ clientId, clientName }: ClientFraudPanelProps) {
  const [activeView, setActiveView] = useState<'overview' | 'indicators' | 'device' | 'behavior' | 'network'>('overview');

  // Mock fraud data
  const fraudScore = 23; // Out of 100 (higher = more suspicious)
  const riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
  
  const indicators: FraudIndicator[] = [
    {
      id: 'ind-1',
      category: 'Device',
      severity: 'low',
      title: 'VPN Connection Detected',
      description: 'User accessed platform via VPN from Sydney, AU',
      detectedAt: new Date('2024-03-20T10:30:00'),
      status: 'resolved',
      confidence: 45,
      source: 'Device Intelligence'
    },
    {
      id: 'ind-2',
      category: 'Behavior',
      severity: 'medium',
      title: 'Unusual Login Time',
      description: 'Login at 2:47 AM (outside normal pattern)',
      detectedAt: new Date('2024-03-15T02:47:00'),
      status: 'resolved',
      confidence: 62,
      source: 'Behavioral Analysis'
    }
  ];

  const deviceProfile = {
    deviceId: 'DEV-8A3F2B1C',
    deviceType: 'Mobile - iPhone 14 Pro',
    os: 'iOS 17.2',
    browser: 'Safari 17.0',
    ipAddress: '203.45.123.78',
    location: 'Melbourne, VIC, AU',
    vpnDetected: false,
    proxyDetected: false,
    trustScore: 85,
    firstSeen: new Date('2024-01-15'),
    lastSeen: new Date('2024-03-22'),
    totalSessions: 47,
    fraudHistory: 0
  };

  const behaviorMetrics = {
    avgSessionDuration: '8m 32s',
    loginFrequency: '4.2/week',
    typicalLoginHours: '9am - 6pm',
    locationConsistency: 95,
    deviceConsistency: 98,
    anomalyScore: 12
  };

  const networkAnalysis = {
    relatedAccounts: 0,
    sharedDevices: 0,
    sharedIPs: 0,
    knownFraudRings: 0,
    suspiciousLinks: 0,
    networkRiskScore: 5
  };

  const aiPredictions = [
    {
      model: 'ML Risk Scoring',
      fraudProbability: 2.3,
      confidence: 94.2,
      verdict: 'Low Risk',
      factors: ['Consistent behavior', 'Long account history', 'No fraud patterns']
    },
    {
      model: 'Behavioral Anomaly Detection',
      fraudProbability: 8.7,
      confidence: 89.5,
      verdict: 'Low Risk',
      factors: ['Some unusual timestamps', 'Generally normal patterns']
    },
    {
      model: 'Network Graph Analysis',
      fraudProbability: 1.2,
      confidence: 96.8,
      verdict: 'Low Risk',
      factors: ['No suspicious connections', 'Clean network']
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/40 dark:text-red-300';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/40 dark:text-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/40 dark:text-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600 dark:text-red-400';
      case 'high': return 'text-orange-600 dark:text-orange-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-red-600';
    if (score >= 50) return 'text-orange-600';
    if (score >= 25) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      {/* Header with Fraud Score */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8" />
              <h3 className="text-2xl font-bold">Fraud Detection Profile</h3>
            </div>
            <p className="text-red-100">Real-time fraud monitoring and risk assessment for {clientName}</p>
          </div>
          <div className="text-center">
            <div className="text-6xl font-bold mb-2">{fraudScore}</div>
            <div className="text-sm text-red-100">Fraud Risk Score</div>
            <div className="text-xs text-red-200 mt-1">(Lower is better)</div>
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-5 gap-4 mt-6">
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <div className="text-sm text-red-100 mb-1">Risk Level</div>
            <div className="text-2xl font-bold capitalize">{riskLevel}</div>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <div className="text-sm text-red-100 mb-1">Active Alerts</div>
            <div className="text-2xl font-bold">{indicators.filter(i => i.status === 'active').length}</div>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <div className="text-sm text-red-100 mb-1">Device Trust</div>
            <div className="text-2xl font-bold">{deviceProfile.trustScore}%</div>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <div className="text-sm text-red-100 mb-1">Behavior Score</div>
            <div className="text-2xl font-bold">{behaviorMetrics.anomalyScore}/100</div>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <div className="text-sm text-red-100 mb-1">Network Risk</div>
            <div className="text-2xl font-bold">{networkAnalysis.networkRiskScore}/100</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {[
            { id: 'overview', label: 'Overview', icon: Eye },
            { id: 'indicators', label: 'Fraud Indicators', icon: AlertTriangle },
            { id: 'device', label: 'Device Analysis', icon: Smartphone },
            { id: 'behavior', label: 'Behavior Patterns', icon: Activity },
            { id: 'network', label: 'Network Graph', icon: Users }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${
                activeView === tab.id
                  ? 'bg-red-600 text-white border-b-2 border-red-700'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeView === 'overview' && (
            <div className="space-y-6">
              {/* AI Predictions */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-lg shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="w-6 h-6 text-purple-600" />
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">AI Model Predictions</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {aiPredictions.map((prediction, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                      <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{prediction.model}</div>
                      <div className={`text-3xl font-bold mb-1 ${getScoreColor(prediction.fraudProbability)}`}>
                        {prediction.fraudProbability}%
                      </div>
                      <div className="text-xs text-gray-500 mb-3">Fraud Probability</div>
                      <div className="flex items-center justify-between text-xs mb-3">
                        <span className="text-gray-600 dark:text-gray-400">Confidence</span>
                        <span className="font-bold text-gray-900 dark:text-white">{prediction.confidence}%</span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold text-center ${
                        prediction.verdict === 'Low Risk'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {prediction.verdict}
                      </div>
                      <div className="mt-3 space-y-1">
                        {prediction.factors.map((factor, j) => (
                          <div key={j} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                            <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                            {factor}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-4">
                    <Smartphone className="w-8 h-8 text-blue-600" />
                    <div className="text-3xl font-bold text-blue-600">{deviceProfile.trustScore}%</div>
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Device Trust Score</h4>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>Total Sessions:</span>
                      <span className="font-semibold">{deviceProfile.totalSessions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fraud History:</span>
                      <span className="font-semibold">{deviceProfile.fraudHistory}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-green-500">
                  <div className="flex items-center justify-between mb-4">
                    <Activity className="w-8 h-8 text-green-600" />
                    <div className="text-3xl font-bold text-green-600">{behaviorMetrics.anomalyScore}</div>
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Behavior Anomaly</h4>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>Consistency:</span>
                      <span className="font-semibold">{behaviorMetrics.locationConsistency}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Login Frequency:</span>
                      <span className="font-semibold">{behaviorMetrics.loginFrequency}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
                  <div className="flex items-center justify-between mb-4">
                    <Users className="w-8 h-8 text-purple-600" />
                    <div className="text-3xl font-bold text-purple-600">{networkAnalysis.networkRiskScore}</div>
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Network Risk Score</h4>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>Fraud Rings:</span>
                      <span className="font-semibold">{networkAnalysis.knownFraudRings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Suspicious Links:</span>
                      <span className="font-semibold">{networkAnalysis.suspiciousLinks}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Fraud Indicators Tab */}
          {activeView === 'indicators' && (
            <div className="space-y-4">
              {indicators.length === 0 ? (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-8 text-center">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Active Fraud Indicators</h4>
                  <p className="text-gray-600 dark:text-gray-400">This client has a clean fraud profile with no current alerts.</p>
                </div>
              ) : (
                indicators.map(indicator => (
                  <div
                    key={indicator.id}
                    className={`border-2 rounded-lg p-5 ${getSeverityColor(indicator.severity)} border-l-4`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white">{indicator.title}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getSeverityColor(indicator.severity)}`}>
                            {indicator.severity}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            indicator.status === 'resolved'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                              : indicator.status === 'investigating'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                              : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                          }`}>
                            {indicator.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">{indicator.description}</p>
                        <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {indicator.detectedAt.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <Brain className="w-4 h-4" />
                            {indicator.source}
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            {indicator.confidence}% confidence
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        Investigate
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Device Analysis Tab */}
          {activeView === 'device' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-[#13B5EA]" />
                  Device Profile
                </h4>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Device ID</div>
                    <div className="text-base font-semibold text-gray-900 dark:text-white">{deviceProfile.deviceId}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Device Type</div>
                    <div className="text-base font-semibold text-gray-900 dark:text-white">{deviceProfile.deviceType}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Operating System</div>
                    <div className="text-base font-semibold text-gray-900 dark:text-white">{deviceProfile.os}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Browser</div>
                    <div className="text-base font-semibold text-gray-900 dark:text-white">{deviceProfile.browser}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">IP Address</div>
                    <div className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      {deviceProfile.ipAddress}
                      {deviceProfile.vpnDetected && (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 text-xs rounded-full">VPN</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Location</div>
                    <div className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {deviceProfile.location}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">First Seen</div>
                    <div className="text-base font-semibold text-gray-900 dark:text-white">{deviceProfile.firstSeen.toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Last Seen</div>
                    <div className="text-base font-semibold text-gray-900 dark:text-white">{deviceProfile.lastSeen.toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Device Trust Score</span>
                    <span className="font-bold text-gray-900 dark:text-white">{deviceProfile.trustScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-600 to-blue-600 h-3 rounded-full"
                      style={{ width: `${deviceProfile.trustScore}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Behavior Patterns Tab */}
          {activeView === 'behavior' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-4">Session Patterns</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Average Session Duration</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{behaviorMetrics.avgSessionDuration}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Login Frequency</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{behaviorMetrics.loginFrequency}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Typical Login Hours</div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">{behaviorMetrics.typicalLoginHours}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-4">Consistency Metrics</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Location Consistency</span>
                        <span className="font-bold text-gray-900 dark:text-white">{behaviorMetrics.locationConsistency}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${behaviorMetrics.locationConsistency}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Device Consistency</span>
                        <span className="font-bold text-gray-900 dark:text-white">{behaviorMetrics.deviceConsistency}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${behaviorMetrics.deviceConsistency}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Anomaly Score</span>
                        <span className="font-bold text-gray-900 dark:text-white">{behaviorMetrics.anomalyScore}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-yellow-600 h-2 rounded-full"
                          style={{ width: `${behaviorMetrics.anomalyScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Network Graph Tab */}
          {activeView === 'network' && (
            <div className="space-y-6">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-8 text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Clean Network Profile</h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No suspicious connections or fraud ring associations detected.
                </p>
                <div className="grid grid-cols-3 gap-4 mt-6 max-w-2xl mx-auto">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{networkAnalysis.relatedAccounts}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Related Accounts</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{networkAnalysis.sharedDevices}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Shared Devices</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{networkAnalysis.knownFraudRings}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Fraud Rings</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

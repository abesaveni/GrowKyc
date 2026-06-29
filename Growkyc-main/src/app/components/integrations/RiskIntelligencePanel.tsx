import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Building,
  Globe,
  Scale,
  DollarSign,
  Users,
  XCircle
} from 'lucide-react';

interface RiskScore {
  identity: number;
  aml: number;
  business: number;
  financial: number;
  legal: number;
  ownership: number;
  overall: number;
}

interface RiskFlag {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  message: string;
}

interface RiskIntelligencePanelProps {
  matterId: string;
  riskProfile: {
    riskScores: RiskScore;
    riskBand: 'low' | 'medium' | 'high' | 'critical';
    hardStopFlags: string[];
    reviewFlags: RiskFlag[];
    recommendedDecision: 'approve' | 'escalate' | 'reject' | 'manual_review';
  };
}

export function RiskIntelligencePanel({ matterId, riskProfile }: RiskIntelligencePanelProps) {
  const { riskScores, riskBand, hardStopFlags, reviewFlags, recommendedDecision } = riskProfile;

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'red';
    if (score >= 50) return 'orange';
    if (score >= 30) return 'amber';
    return 'green';
  };

  const getBandColor = (band: string) => {
    switch (band) {
      case 'critical':
        return 'bg-red-600';
      case 'high':
        return 'bg-orange-600';
      case 'medium':
        return 'bg-amber-600';
      case 'low':
        return 'bg-green-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getDecisionBadge = (decision: string) => {
    switch (decision) {
      case 'approve':
        return (
          <Badge className="bg-green-500/15 text-green-300 border-green-300 text-sm">
            <CheckCircle className="w-4 h-4 mr-1" />
            Recommend: Approve
          </Badge>
        );
      case 'escalate':
        return (
          <Badge className="bg-amber-500/15 text-amber-300 border-amber-300 text-sm">
            <AlertTriangle className="w-4 h-4 mr-1" />
            Recommend: Escalate
          </Badge>
        );
      case 'reject':
        return (
          <Badge className="bg-red-500/15 text-red-300 border-red-300 text-sm">
            <XCircle className="w-4 h-4 mr-1" />
            Recommend: Reject
          </Badge>
        );
      case 'manual_review':
        return (
          <Badge className="bg-blue-500/15 text-blue-300 border-blue-300 text-sm">
            <AlertTriangle className="w-4 h-4 mr-1" />
            Manual Review Required
          </Badge>
        );
      default:
        return null;
    }
  };

  const riskCategories = [
    { key: 'identity', label: 'Identity Risk', icon: Users, score: riskScores.identity, providers: ['Equifax'] },
    { key: 'aml', label: 'AML Risk', icon: Shield, score: riskScores.aml, providers: ['ComplyAdvantage'] },
    { key: 'business', label: 'Business Risk', icon: Building, score: riskScores.business, providers: ['ASIC', 'Illion'] },
    { key: 'financial', label: 'Financial Risk', icon: DollarSign, score: riskScores.financial, providers: ['Equifax', 'Illion'] },
    { key: 'legal', label: 'Legal Risk', icon: Scale, score: riskScores.legal, providers: ['Illion', 'LexisNexis'] },
    { key: 'ownership', label: 'Ownership Risk', icon: Globe, score: riskScores.ownership, providers: ['ASIC'] }
  ];

  return (
    <div className="w-96 bg-white border-l-4 border-purple-600 shadow-xl overflow-y-auto h-full">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white p-6 border-b">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Risk Intelligence</h2>
            <p className="text-white/80 text-sm">Unified Risk Assessment</p>
          </div>
        </div>
        
        {/* Overall Risk Score */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/90 text-sm font-semibold">Overall Risk Score</span>
            <Badge className={`${getBandColor(riskBand)} text-white text-xs px-3 py-1`}>
              {riskBand.toUpperCase()}
            </Badge>
          </div>
          <div className="relative">
            <div className="flex items-end gap-1 mb-2">
              <span className="text-5xl font-bold">{riskScores.overall}</span>
              <span className="text-white/60 text-lg mb-2">/100</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full ${
                  riskScores.overall >= 70
                    ? 'bg-red-400'
                    : riskScores.overall >= 50
                    ? 'bg-orange-400'
                    : riskScores.overall >= 30
                    ? 'bg-amber-400'
                    : 'bg-green-400'
                } transition-all duration-500`}
                style={{ width: `${riskScores.overall}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Recommended Decision */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <p className="text-white/70 text-xs mb-2">AI-Powered Decision</p>
          {getDecisionBadge(recommendedDecision)}
        </div>
      </div>

      {/* Hard Stop Flags */}
      {hardStopFlags.length > 0 && hardStopFlags[0] !== 'none' && (
        <div className="p-4 bg-red-500/10 border-b border-red-500/30">
          <div className="flex items-start gap-2 mb-2">
            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-red-300 mb-2">Hard Stop Flags</h3>
              {hardStopFlags.map((flag, idx) => (
                <div key={idx} className="text-sm text-red-300 mb-1">
                  • {flag}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Risk Category Breakdown */}
      <div className="p-6 space-y-4">
        <div className="border-b pb-3 mb-4">
          <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            Risk Breakdown
          </h3>
          <p className="text-xs text-slate-300 mt-1">Data from 6 providers combined</p>
        </div>

        {riskCategories.map((category) => {
          const Icon = category.icon;
          const color = getRiskColor(category.score);

          return (
            <Card key={category.key} className="border-2 border-white/10 hover:border-purple-300 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 bg-${color}-100 rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 text-${color}-600`} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-100 text-sm">{category.label}</p>
                      <div className="flex gap-1 mt-1">
                        {category.providers.map((provider, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs bg-blue-500/10 text-blue-300 border-blue-300 px-2 py-0">
                            {provider}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-2xl font-bold text-${color}-600`}>{category.score}</span>
                  </div>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full bg-${color}-500 transition-all duration-500`}
                    style={{ width: `${category.score}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Review Flags */}
      {reviewFlags.length > 0 && (
        <div className="p-6 border-t bg-amber-500/10">
          <div className="flex items-start gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-amber-300 mb-1">Review Flags ({reviewFlags.length})</h3>
              <p className="text-xs text-amber-300 mb-3">Items requiring analyst attention</p>
              <div className="space-y-2">
                {reviewFlags.map((flag, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-3 border border-amber-500/30">
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-semibold text-sm text-slate-100">{flag.type}</p>
                      <Badge
                        className={
                          flag.severity === 'critical'
                            ? 'bg-red-500/15 text-red-300 text-xs'
                            : flag.severity === 'high'
                            ? 'bg-orange-500/15 text-orange-300 text-xs'
                            : flag.severity === 'medium'
                            ? 'bg-amber-500/15 text-amber-300 text-xs'
                            : 'bg-green-500/15 text-green-300 text-xs'
                        }
                      >
                        {flag.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-300 mb-1">{flag.message}</p>
                    <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-300 border-blue-300 mt-1">
                      Source: {flag.source}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Sources Summary */}
      <div className="p-6 border-t bg-white/5">
        <h3 className="font-bold text-slate-100 mb-3 text-sm">Data Sources Used</h3>
        <div className="grid grid-cols-2 gap-2">
          {['ASIC', 'Equifax', 'Illion', 'ComplyAdvantage', 'Internal AI', 'Analytics'].map((source, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{source}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Matter Reference */}
      <div className="p-4 border-t bg-white/5 text-center">
        <p className="text-xs text-slate-300">
          Matter ID: <span className="font-mono font-semibold text-slate-100">{matterId}</span>
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Last updated: {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ProviderBadge } from './ProviderBadge';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Eye,
  ChevronDown,
  ChevronUp,
  FileText,
  Shield,
  User,
  Building,
  TrendingUp,
  Scale,
  Wallet,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

type CheckStatus = 'verified' | 'clear' | 'review' | 'failed' | 'not_run' | 'running' | 'completed' | 'possible_match' | 'confirmed_match' | 'active' | 'inactive' | 'mismatch';
type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
type Provider = 'asic' | 'equifax' | 'illion' | 'complyadvantage' | 'lexisnexis' | 'chainalysis' | 'internal' | 'internal_ai' | 'analytics';

interface CheckResultCardProps {
  checkType: 'identity' | 'entity' | 'aml' | 'business_risk' | 'advanced_legal' | 'crypto_risk';
  status: CheckStatus;
  provider: Provider;
  checkedAt: string;
  riskLevel?: RiskLevel;
  confidence?: number;
  summary: string;
  details: {
    label: string;
    value: string | number | boolean;
  }[];
  flags?: string[];
  rawDataAvailable?: boolean;
  evidenceLink?: string;
  onRecheck?: () => void;
  onViewEvidence?: () => void;
}

export function CheckResultCard({
  checkType,
  status,
  provider,
  checkedAt,
  riskLevel,
  confidence,
  summary,
  details,
  flags = [],
  rawDataAvailable = true,
  evidenceLink,
  onRecheck,
  onViewEvidence
}: CheckResultCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showRawData, setShowRawData] = useState(false);

  const getCheckIcon = () => {
    switch (checkType) {
      case 'identity':
        return User;
      case 'entity':
        return Building;
      case 'aml':
        return Shield;
      case 'business_risk':
        return TrendingUp;
      case 'advanced_legal':
        return Scale;
      case 'crypto_risk':
        return Wallet;
      default:
        return FileText;
    }
  };

  const getCheckTitle = () => {
    switch (checkType) {
      case 'identity':
        return 'Identity Verification';
      case 'entity':
        return 'Entity Verification';
      case 'aml':
        return 'AML Screening';
      case 'business_risk':
        return 'Business Risk Assessment';
      case 'advanced_legal':
        return 'Advanced Legal Check';
      case 'crypto_risk':
        return 'Crypto Risk Assessment';
      default:
        return 'Check Result';
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'verified':
      case 'clear':
      case 'active':
        return (
          <Badge className="bg-green-100 text-green-700 border-green-300">
            <CheckCircle className="w-3 h-3 mr-1" />
            {status === 'verified' ? 'Verified' : status === 'clear' ? 'Clear' : 'Active'}
          </Badge>
        );
      case 'review':
      case 'possible_match':
        return (
          <Badge className="bg-amber-100 text-amber-700 border-amber-300">
            <AlertTriangle className="w-3 h-3 mr-1" />
            {status === 'review' ? 'Review Required' : 'Possible Match'}
          </Badge>
        );
      case 'failed':
      case 'confirmed_match':
      case 'inactive':
      case 'mismatch':
        return (
          <Badge className="bg-red-100 text-red-700 border-red-300">
            <XCircle className="w-3 h-3 mr-1" />
            {status === 'failed' ? 'Failed' : status === 'confirmed_match' ? 'Confirmed Match' : status === 'inactive' ? 'Inactive' : 'Mismatch'}
          </Badge>
        );
      case 'running':
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-300">
            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
            Running
          </Badge>
        );
      case 'not_run':
        return (
          <Badge className="bg-gray-100 text-gray-700 border-gray-300">
            <Clock className="w-3 h-3 mr-1" />
            Not Run
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-700 border-green-300">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      default:
        return null;
    }
  };

  const getRiskBadge = () => {
    if (!riskLevel) return null;

    const config = {
      low: 'bg-green-100 text-green-700 border-green-300',
      medium: 'bg-amber-100 text-amber-700 border-amber-300',
      high: 'bg-orange-100 text-orange-700 border-orange-300',
      critical: 'bg-red-100 text-red-700 border-red-300'
    };

    return (
      <Badge className={config[riskLevel]}>
        Risk: {riskLevel.toUpperCase()}
      </Badge>
    );
  };

  const Icon = getCheckIcon();

  return (
    <Card className="border-2 border-gray-200 hover:border-purple-300 transition-all">
      <CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-blue-50 border-b">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg mb-1">{getCheckTitle()}</CardTitle>
              <div className="flex items-center gap-2 flex-wrap">
                {getStatusBadge()}
                {getRiskBadge()}
                <ProviderBadge provider={provider} size="sm" />
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="ml-2"
          >
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {/* Summary */}
        <div className="mb-4">
          <p className="text-sm text-gray-700">{summary}</p>
        </div>

        {/* Confidence Score */}
        {confidence !== undefined && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-blue-900">Confidence Score</span>
              <span className="text-lg font-bold text-blue-900">{(confidence * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${confidence * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Flags */}
        {flags.length > 0 && (
          <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-xs font-semibold text-amber-900 mb-2 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              Flags ({flags.length})
            </p>
            <div className="space-y-1">
              {flags.map((flag, idx) => (
                <div key={idx} className="text-xs text-amber-800">
                  • {flag}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Details (Expanded) */}
        {expanded && (
          <div className="space-y-3 pt-3 border-t">
            <div className="grid grid-cols-2 gap-3">
              {details.map((detail, idx) => (
                <div key={idx} className="p-2 bg-gray-50 rounded border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">{detail.label}</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {typeof detail.value === 'boolean'
                      ? detail.value
                        ? 'Yes'
                        : 'No'
                      : detail.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Timestamp */}
            <div className="flex items-center gap-2 text-xs text-gray-600 pt-2 border-t">
              <Clock className="w-4 h-4" />
              <span>Checked at: {new Date(checkedAt).toLocaleString()}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              {rawDataAvailable && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRawData(!showRawData)}
                  className="flex-1"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  {showRawData ? 'Hide' : 'View'} Raw Data
                </Button>
              )}
              {evidenceLink && onViewEvidence && (
                <Button variant="outline" size="sm" onClick={onViewEvidence} className="flex-1">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Evidence
                </Button>
              )}
              {onRecheck && (
                <Button variant="outline" size="sm" onClick={onRecheck}>
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Re-check
                </Button>
              )}
            </div>

            {/* Raw Data Drawer */}
            {showRawData && (
              <div className="mt-3 p-4 bg-gray-900 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-gray-300">Provider Response (JSON)</p>
                  <Badge className="bg-gray-700 text-gray-300 text-xs">
                    {provider.toUpperCase()}
                  </Badge>
                </div>
                <pre className="text-xs text-green-400 font-mono overflow-x-auto">
                  {JSON.stringify(
                    {
                      screening_id: `scr_${Math.random().toString(36).substr(2, 9)}`,
                      provider: provider,
                      status: status,
                      confidence_score: confidence,
                      details: details.reduce((acc, d) => ({ ...acc, [d.label]: d.value }), {}),
                      flags: flags,
                      checked_at: checkedAt
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

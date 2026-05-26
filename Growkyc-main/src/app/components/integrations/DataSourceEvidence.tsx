import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ProviderBadge } from './ProviderBadge';
import {
  FileText,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Shield,
  User,
  Calendar,
  ExternalLink,
  Filter
} from 'lucide-react';

interface EvidenceRecord {
  checkId: string;
  checkName: string;
  provider: 'asic' | 'equifax' | 'illion' | 'complyadvantage' | 'lexisnexis' | 'chainalysis' | 'internal' | 'internal_ai' | 'analytics';
  checkedAt: string;
  result: 'passed' | 'failed' | 'review' | 'pending' | 'clear' | 'match';
  reviewer?: string;
  decision?: string;
  overrideReason?: string;
  evidenceId: string;
  responseStatus: number;
  normalised: boolean;
}

interface DataSourceEvidenceProps {
  matterId: string;
  subjectId: string;
  subjectName: string;
}

export function DataSourceEvidence({ matterId, subjectId, subjectName }: DataSourceEvidenceProps) {
  const [filterProvider, setFilterProvider] = useState<string>('all');
  const [filterResult, setFilterResult] = useState<string>('all');

  // Mock evidence records - following the audit model from the spec
  const evidenceRecords: EvidenceRecord[] = [
    {
      checkId: 'scr_001',
      checkName: 'Identity Verification (100-Point)',
      provider: 'equifax',
      checkedAt: '2026-03-21T10:00:03Z',
      result: 'passed',
      reviewer: 'AI Bot',
      decision: 'Auto-approved',
      evidenceId: 'resp_001',
      responseStatus: 200,
      normalised: true
    },
    {
      checkId: 'scr_002',
      checkName: 'PEP Screening',
      provider: 'complyadvantage',
      checkedAt: '2026-03-21T10:00:15Z',
      result: 'clear',
      reviewer: 'AI Bot',
      decision: 'Clear - No matches',
      evidenceId: 'resp_002',
      responseStatus: 200,
      normalised: true
    },
    {
      checkId: 'scr_003',
      checkName: 'Sanctions Screening (DFAT, UN, OFAC, EU)',
      provider: 'complyadvantage',
      checkedAt: '2026-03-21T10:00:20Z',
      result: 'clear',
      reviewer: 'AI Bot',
      decision: 'Clear - No sanctions',
      evidenceId: 'resp_003',
      responseStatus: 200,
      normalised: true
    },
    {
      checkId: 'scr_004',
      checkName: 'Adverse Media Check',
      provider: 'complyadvantage',
      checkedAt: '2026-03-21T10:00:25Z',
      result: 'clear',
      reviewer: 'AI Bot',
      decision: 'Clear - No adverse media',
      evidenceId: 'resp_004',
      responseStatus: 200,
      normalised: true
    },
    {
      checkId: 'scr_005',
      checkName: 'Entity Verification (ASIC)',
      provider: 'asic',
      checkedAt: '2026-03-21T10:01:00Z',
      result: 'passed',
      reviewer: 'KYB Bot',
      decision: 'Entity active and valid',
      evidenceId: 'resp_005',
      responseStatus: 200,
      normalised: true
    },
    {
      checkId: 'scr_006',
      checkName: 'Business Credit Assessment',
      provider: 'illion',
      checkedAt: '2026-03-21T10:01:30Z',
      result: 'passed',
      reviewer: 'Business Risk Bot',
      decision: 'Medium risk - acceptable',
      evidenceId: 'resp_006',
      responseStatus: 200,
      normalised: true
    },
    {
      checkId: 'scr_007',
      checkName: 'Insolvency Check',
      provider: 'illion',
      checkedAt: '2026-03-21T10:01:45Z',
      result: 'clear',
      reviewer: 'Business Risk Bot',
      decision: 'No insolvency records',
      evidenceId: 'resp_007',
      responseStatus: 200,
      normalised: true
    },
    {
      checkId: 'scr_008',
      checkName: 'Court & Litigation Check',
      provider: 'illion',
      checkedAt: '2026-03-21T10:02:00Z',
      result: 'review',
      reviewer: 'Analyst: Sarah Johnson',
      decision: 'Minor civil case - reviewed and accepted',
      overrideReason: 'Case resolved in client favor, no material impact',
      evidenceId: 'resp_008',
      responseStatus: 200,
      normalised: true
    },
    {
      checkId: 'scr_009',
      checkName: 'Beneficial Ownership Mapping',
      provider: 'asic',
      checkedAt: '2026-03-21T10:02:30Z',
      result: 'passed',
      reviewer: 'Ownership Bot',
      decision: 'All UBOs verified',
      evidenceId: 'resp_009',
      responseStatus: 200,
      normalised: true
    },
    {
      checkId: 'scr_010',
      checkName: 'Source of Funds Verification',
      provider: 'illion',
      checkedAt: '2026-03-21T10:03:00Z',
      result: 'passed',
      reviewer: 'SOF Bot',
      decision: 'Legitimate business income verified',
      evidenceId: 'resp_010',
      responseStatus: 200,
      normalised: true
    },
    {
      checkId: 'scr_011',
      checkName: 'Source of Wealth Analysis',
      provider: 'illion',
      checkedAt: '2026-03-21T10:03:15Z',
      result: 'passed',
      reviewer: 'SOW Bot',
      decision: 'Wealth accumulation documented',
      evidenceId: 'resp_011',
      responseStatus: 200,
      normalised: true
    },
    {
      checkId: 'scr_012',
      checkName: 'AI Compliance Decision',
      provider: 'internal_ai',
      checkedAt: '2026-03-21T10:04:00Z',
      result: 'passed',
      reviewer: 'Compliance Decision Bot',
      decision: 'Auto-approved with monitoring',
      evidenceId: 'resp_012',
      responseStatus: 200,
      normalised: true
    },
    {
      checkId: 'scr_013',
      checkName: 'Transaction Monitoring Setup',
      provider: 'complyadvantage',
      checkedAt: '2026-03-21T10:04:30Z',
      result: 'passed',
      reviewer: 'Monitoring Bot',
      decision: 'Live monitoring activated',
      evidenceId: 'resp_013',
      responseStatus: 200,
      normalised: true
    }
  ];

  const getResultBadge = (result: string) => {
    switch (result) {
      case 'passed':
      case 'clear':
        return (
          <Badge className="bg-green-100 text-green-700 border-green-300 text-xs">
            <CheckCircle className="w-3 h-3 mr-1" />
            {result === 'passed' ? 'Passed' : 'Clear'}
          </Badge>
        );
      case 'review':
      case 'match':
        return (
          <Badge className="bg-amber-100 text-amber-700 border-amber-300 text-xs">
            <AlertTriangle className="w-3 h-3 mr-1" />
            {result === 'review' ? 'Review' : 'Match'}
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-700 border-red-300 text-xs">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-300 text-xs">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  const filteredRecords = evidenceRecords.filter((record) => {
    const matchesProvider = filterProvider === 'all' || record.provider === filterProvider;
    const matchesResult = filterResult === 'all' || record.result === filterResult;
    return matchesProvider && matchesResult;
  });

  const uniqueProviders = Array.from(new Set(evidenceRecords.map((r) => r.provider)));

  return (
    <div className="space-y-6">
      <Card className="border-2 border-blue-300">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Shield className="w-7 h-7 text-blue-600" />
                Data Sources & Evidence
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Complete audit trail for <strong>{subjectName}</strong>
              </CardDescription>
              <div className="flex gap-2 mt-3 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  Matter: <span className="font-mono font-semibold">{matterId}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  Subject: <span className="font-mono font-semibold">{subjectId}</span>
                </div>
              </div>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Download className="w-4 h-4 mr-2" />
              Export Audit Report
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Filters */}
          <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-semibold text-gray-700">Filters:</span>
            </div>
            <div className="flex gap-2">
              <select
                value={filterProvider}
                onChange={(e) => setFilterProvider(e.target.value)}
                className="text-sm px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Providers</option>
                {uniqueProviders.map((provider) => (
                  <option key={provider} value={provider}>
                    {provider.charAt(0).toUpperCase() + provider.slice(1)}
                  </option>
                ))}
              </select>
              <select
                value={filterResult}
                onChange={(e) => setFilterResult(e.target.value)}
                className="text-sm px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Results</option>
                <option value="passed">Passed</option>
                <option value="clear">Clear</option>
                <option value="review">Review</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <span className="ml-auto text-sm text-gray-600">
              Showing <strong>{filteredRecords.length}</strong> of <strong>{evidenceRecords.length}</strong> records
            </span>
          </div>

          {/* Evidence Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Check</th>
                  <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Provider</th>
                  <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Date/Time</th>
                  <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Result</th>
                  <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Reviewer</th>
                  <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Decision</th>
                  <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr
                    key={record.checkId}
                    className="border-b border-gray-200 hover:bg-blue-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{record.checkName}</p>
                          <p className="text-xs text-gray-600 font-mono">{record.checkId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <ProviderBadge provider={record.provider} size="sm" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-sm text-gray-700">
                        <Calendar className="w-3 h-3 text-gray-500" />
                        <span>{new Date(record.checkedAt).toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{getResultBadge(record.result)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-sm text-gray-700">
                        <User className="w-3 h-3 text-gray-500" />
                        <span>{record.reviewer || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm text-gray-900">{record.decision || 'N/A'}</p>
                        {record.overrideReason && (
                          <p className="text-xs text-amber-700 mt-1">
                            <AlertTriangle className="w-3 h-3 inline mr-1" />
                            Override: {record.overrideReason}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="text-xs">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs">
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRecords.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No evidence records match your filters</p>
            </div>
          )}

          {/* Summary Stats */}
          <div className="grid md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-semibold text-green-900">Passed/Clear</span>
              </div>
              <p className="text-3xl font-bold text-green-900">
                {evidenceRecords.filter((r) => r.result === 'passed' || r.result === 'clear').length}
              </p>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span className="text-sm font-semibold text-amber-900">Review/Match</span>
              </div>
              <p className="text-3xl font-bold text-amber-900">
                {evidenceRecords.filter((r) => r.result === 'review' || r.result === 'match').length}
              </p>
            </div>

            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <span className="text-sm font-semibold text-red-900">Failed</span>
              </div>
              <p className="text-3xl font-bold text-red-900">
                {evidenceRecords.filter((r) => r.result === 'failed').length}
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-blue-900">Total Checks</span>
              </div>
              <p className="text-3xl font-bold text-blue-900">{evidenceRecords.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Note */}
      <Card className="border-2 border-purple-300 bg-purple-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-purple-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-purple-900 mb-1">Audit & Compliance Ready</h3>
              <p className="text-sm text-purple-800">
                This evidence trail includes: provider source, timestamp, decision, version, and reviewer for every
                check. All data is normalised to unified canonical schema. Ready for audits, regulators, and partner
                review.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

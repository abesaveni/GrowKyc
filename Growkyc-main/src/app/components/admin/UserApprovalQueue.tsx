import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Users,
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  FileText,
  Mail,
  Phone,
  MapPin,
  Shield,
  AlertTriangle,
  TrendingUp,
  Briefcase
} from 'lucide-react';

interface PendingOrganization {
  id: string;
  organizationName: string;
  tradingName?: string;
  abn: string;
  acn?: string;
  industry: string;
  vertical: 'accountants' | 'credit' | 'afsl' | 'funds' | 'trustees' | 'legal' | 'realestate';
  requestedDate: string;
  requestedBy: string;
  email: string;
  phone: string;
  address: string;
  estimatedUsers: number;
  estimatedMRR: number;
  verified: {
    abn: boolean;
    email: boolean;
    phone: boolean;
    address: boolean;
  };
  riskFlags: number;
  documents: string[];
}

interface UserApprovalQueueProps {
  onBack: () => void;
}

export function UserApprovalQueue({ onBack }: UserApprovalQueueProps) {
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);

  const pendingOrganizations: PendingOrganization[] = [
    {
      id: 'org-1',
      organizationName: 'Smith & Partners Chartered Accountants',
      tradingName: 'Smith & Partners',
      abn: '12 345 678 901',
      acn: '123 456 789',
      industry: 'Accounting',
      vertical: 'accountants',
      requestedDate: '2026-03-20',
      requestedBy: 'John Smith',
      email: 'john@smithpartners.com.au',
      phone: '+61 2 9876 5432',
      address: '123 Collins St, Melbourne VIC 3000',
      estimatedUsers: 8,
      estimatedMRR: 400,
      verified: {
        abn: true,
        email: true,
        phone: true,
        address: true
      },
      riskFlags: 0,
      documents: ['ABN Certificate', 'Professional Indemnity Insurance', 'Director ID']
    },
    {
      id: 'org-2',
      organizationName: 'Martinez Legal Pty Ltd',
      abn: '23 456 789 012',
      acn: '234 567 890',
      industry: 'Legal Services',
      vertical: 'legal',
      requestedDate: '2026-03-20',
      requestedBy: 'Sarah Martinez',
      email: 'sarah@martinezlegal.com.au',
      phone: '+61 3 8765 4321',
      address: '456 Queen St, Brisbane QLD 4000',
      estimatedUsers: 12,
      estimatedMRR: 720,
      verified: {
        abn: true,
        email: true,
        phone: false,
        address: true
      },
      riskFlags: 1,
      documents: ['ABN Certificate', 'Professional Indemnity Insurance']
    },
    {
      id: 'org-3',
      organizationName: 'Offshore Investment Ltd',
      abn: '34 567 890 123',
      industry: 'Investment Management',
      vertical: 'funds',
      requestedDate: '2026-03-19',
      requestedBy: 'Vladimir Petrov',
      email: 'vp@offshore-invest.com',
      phone: '+852 1234 5678',
      address: 'Hong Kong',
      estimatedUsers: 5,
      estimatedMRR: 1250,
      verified: {
        abn: false,
        email: false,
        phone: false,
        address: false
      },
      riskFlags: 5,
      documents: []
    }
  ];

  const stats = {
    totalPending: pendingOrganizations.length,
    approvedToday: 8,
    rejectedToday: 2,
    avgApprovalTime: '2.3 hours',
    estimatedMRR: pendingOrganizations.reduce((sum, org) => sum + org.estimatedMRR, 0)
  };

  const getVerticalColor = (vertical: string) => {
    switch (vertical) {
      case 'accountants': return 'bg-blue-600 text-white';
      case 'credit': return 'bg-green-600 text-white';
      case 'afsl': return 'bg-purple-600 text-white';
      case 'funds': return 'bg-indigo-600 text-white';
      case 'trustees': return 'bg-amber-600 text-white';
      case 'legal': return 'bg-red-600 text-white';
      case 'realestate': return 'bg-teal-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white px-8 py-12">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-white hover:bg-white/20 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Admin
        </Button>

        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/20">
            <Users className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-bold mb-2">User Approval Queue</h1>
            <p className="text-white/90 text-xl">Review organizations • Verify credentials • Approve access</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Pending Review</div>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.totalPending}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Approved Today</div>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.approvedToday}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Rejected Today</div>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.rejectedToday}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Potential MRR</div>
            </div>
            <div className="text-4xl font-bold mb-1">${(stats.estimatedMRR / 1000).toFixed(1)}K</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Avg Approval Time</div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.avgApprovalTime}</div>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        {/* Pending Organizations */}
        <div className="space-y-6">
          {pendingOrganizations.map((org) => (
            <Card
              key={org.id}
              className={`border-2 ${
                org.riskFlags > 0
                  ? 'border-red-200 bg-red-50'
                  : 'border-green-200 bg-green-50'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                      org.riskFlags > 0 ? 'bg-red-100' : 'bg-green-100'
                    }`}>
                      <Building2 className={`w-8 h-8 ${
                        org.riskFlags > 0 ? 'text-red-600' : 'text-green-600'
                      }`} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-gray-900">{org.organizationName}</h3>
                        <Badge className={getVerticalColor(org.vertical)}>
                          {org.vertical}
                        </Badge>
                        {org.riskFlags > 0 && (
                          <Badge className="bg-red-600 text-white">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {org.riskFlags} risk flag{org.riskFlags > 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>

                      {org.tradingName && (
                        <div className="text-sm text-gray-600 mb-2">Trading as: {org.tradingName}</div>
                      )}

                      <div className="grid grid-cols-3 gap-6 mb-4">
                        <div>
                          <div className="text-xs text-gray-600 mb-1">ABN / ACN</div>
                          <div className="font-semibold text-gray-900">
                            {org.abn}
                            {org.acn && ` / ${org.acn}`}
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-gray-600 mb-1">Industry</div>
                          <div className="font-semibold text-gray-900">{org.industry}</div>
                        </div>

                        <div>
                          <div className="text-xs text-gray-600 mb-1">Requested By</div>
                          <div className="font-semibold text-gray-900">{org.requestedBy}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="p-3 bg-white rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Mail className="w-4 h-4 text-gray-600" />
                            <span className="text-xs text-gray-600">Email</span>
                            {org.verified.email ? (
                              <CheckCircle className="w-3 h-3 text-green-600 ml-auto" />
                            ) : (
                              <XCircle className="w-3 h-3 text-red-600 ml-auto" />
                            )}
                          </div>
                          <div className="text-sm font-semibold text-gray-900">{org.email}</div>
                        </div>

                        <div className="p-3 bg-white rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Phone className="w-4 h-4 text-gray-600" />
                            <span className="text-xs text-gray-600">Phone</span>
                            {org.verified.phone ? (
                              <CheckCircle className="w-3 h-3 text-green-600 ml-auto" />
                            ) : (
                              <XCircle className="w-3 h-3 text-red-600 ml-auto" />
                            )}
                          </div>
                          <div className="text-sm font-semibold text-gray-900">{org.phone}</div>
                        </div>

                        <div className="p-3 bg-white rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-4 h-4 text-gray-600" />
                            <span className="text-xs text-gray-600">Address</span>
                            {org.verified.address ? (
                              <CheckCircle className="w-3 h-3 text-green-600 ml-auto" />
                            ) : (
                              <XCircle className="w-3 h-3 text-red-600 ml-auto" />
                            )}
                          </div>
                          <div className="text-sm font-semibold text-gray-900">{org.address}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                          <div className="text-xs text-gray-600 mb-1">Estimated Users</div>
                          <div className="text-2xl font-bold text-blue-600">{org.estimatedUsers}</div>
                        </div>

                        <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                          <div className="text-xs text-gray-600 mb-1">Estimated MRR</div>
                          <div className="text-2xl font-bold text-green-600">${org.estimatedMRR}</div>
                        </div>

                        <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                          <div className="text-xs text-gray-600 mb-1">Requested</div>
                          <div className="text-lg font-bold text-purple-600">{org.requestedDate}</div>
                        </div>
                      </div>

                      {/* Documents */}
                      {org.documents.length > 0 ? (
                        <div className="p-4 bg-white rounded-lg border border-gray-200">
                          <div className="text-sm font-bold text-gray-900 mb-2">Documents Provided:</div>
                          <div className="flex flex-wrap gap-2">
                            {org.documents.map((doc, idx) => (
                              <Badge key={idx} variant="outline" className="flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                {doc}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-red-100 rounded-lg border-2 border-red-300">
                          <div className="flex items-center gap-2 text-red-900">
                            <AlertTriangle className="w-5 h-5" />
                            <span className="font-bold">No documents provided</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-6">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Full Details
                    </Button>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 border-red-300">
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                    {org.riskFlags === 0 && (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Briefcase className="w-4 h-4 mr-2" />
                        Quick Approve
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Approval Guidelines */}
        <Card className="mt-12 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              Approval Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Required for Approval:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Valid ABN verification (via ABN Lookup API)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Email verification completed
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Phone verification (SMS code)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Professional indemnity insurance (for advisers/lawyers)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    No matches on DFAT sanctions list
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    No matches on ASIC banned/disqualified list
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-3">Automatic Rejection Triggers:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    ABN not found or cancelled
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    Match on DFAT sanctions list
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    Match on ASIC banned/disqualified list
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    Fake/disposable email address
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    High-risk jurisdiction (no local presence)
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    Missing required professional licensing
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

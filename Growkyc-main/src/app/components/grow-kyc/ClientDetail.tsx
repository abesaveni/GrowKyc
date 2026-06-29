import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import {
  ArrowLeft,
  Building2,
  Shield,
  AlertTriangle,
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle,
  FileText,
  Eye,
  Target,
  Activity,
  DollarSign,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Download,
  Share2,
  MoreVertical
} from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';

interface ClientDetailProps {
  clientId: string;
  onBack: () => void;
}

export function ClientDetail({ clientId, onBack }: ClientDetailProps) {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'documents' | 'transactions' | 'compliance'>('overview');

  // Mock client data - in production this would come from API/database
  const client = {
    id: clientId,
    name: 'Horizon Capital Pty Ltd',
    type: 'Company',
    abn: '12 345 678 901',
    acn: '123 456 789',
    registeredAddress: '123 Collins Street, Melbourne VIC 3000',
    businessPhone: '+61 3 9999 8888',
    businessEmail: 'contact@horizoncapital.com.au',
    website: 'www.horizoncapital.com.au',
    industry: 'Financial Services',
    riskTier: 'critical',
    riskScore: 85,
    kycStatus: 'aml_alert',
    engagementStatus: 'Suspended',
    onboardedDate: '2024-03-15',
    lastReviewDate: '2026-02-01',
    nextReviewDue: '2026-03-01',
    aum: '$24.5M',
    monthlyTransactionVolume: '$2.8M'
  };

  //  Compliance checks data
  const complianceChecks = [
    {
      id: 'kyc-id-verification',
      name: 'Identity Verification',
      category: 'KYC',
      status: 'passed',
      lastRun: '2026-02-01',
      nextDue: '2027-02-01',
      score: 100,
      provider: 'InfoTrack',
      automated: true,
      icon: CheckCircle,
      description: 'All verification checks passed'
    },
    {
      id: 'sanctions-screening',
      name: 'Sanctions Screening',
      category: 'AML',
      status: 'alert',
      lastRun: '2026-02-01',
      nextDue: '2026-02-02',
      score: 45,
      provider: 'Dow Jones',
      automated: true,
      icon: AlertTriangle,
      description: 'Potential match detected - requires review'
    },
    {
      id: 'pep-screening',
      name: 'PEP Screening',
      category: 'AML',
      status: 'passed',
      lastRun: '2026-02-01',
      nextDue: '2026-03-01',
      score: 100,
      provider: 'World-Check',
      automated: true,
      icon: CheckCircle,
      description: 'No PEP matches found'
    },
    {
      id: 'document-verification',
      name: 'Document Verification',
      category: 'Verification',
      status: 'passed',
      lastRun: '2026-02-01',
      nextDue: '2027-02-01',
      score: 94,
      provider: 'Onfido',
      automated: true,
      icon: FileText,
      description: 'All documents verified'
    },
    {
      id: 'risk-assessment',
      name: 'Risk Assessment',
      category: 'Risk',
      status: 'alert',
      lastRun: '2026-02-01',
      nextDue: '2026-03-01',
      score: 85,
      provider: 'Internal Model',
      automated: true,
      icon: Target,
      description: 'High risk - review required'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Dashboard', onClick: () => {
            // Navigate back two levels to dashboard
            onBack();
          }},
          { label: 'Client Registry', onClick: onBack },
          { label: client.name, active: true }
        ]}
      />

      {/* Client Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{client.name}</h1>
                <div className="flex items-center gap-3 mb-3">
                  <Badge className="bg-red-600 text-white text-sm font-bold">
                    Critical Risk • Score {client.riskScore}
                  </Badge>
                  <Badge variant="outline" className="border-red-400 text-red-900 bg-red-100">
                    {client.engagementStatus}
                  </Badge>
                  <Badge variant="outline" className="border-orange-400 text-orange-900 bg-orange-100">
                    🚨 AML Alert Active
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-6 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    <span><strong>ABN:</strong> {client.abn}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span><strong>ACN:</strong> {client.acn}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span><strong>Onboarded:</strong> {client.onboardedDate}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-8 h-8 text-red-600" />
              <TrendingUp className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-red-600">{client.riskScore}</p>
            <p className="text-xs text-gray-600 font-medium">Risk Score</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <Clock className="w-8 h-8 text-orange-600 mb-2" />
            <p className="text-lg font-bold text-gray-900">{client.nextReviewDue}</p>
            <p className="text-xs text-gray-600 font-medium">Review Due</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <DollarSign className="w-8 h-8 text-blue-600 mb-2" />
            <p className="text-lg font-bold text-gray-900">{client.aum}</p>
            <p className="text-xs text-gray-600 font-medium">AUM</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <Activity className="w-8 h-8 text-purple-600 mb-2" />
            <p className="text-lg font-bold text-gray-900">{client.monthlyTransactionVolume}</p>
            <p className="text-xs text-gray-600 font-medium">Monthly Volume</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
            <p className="text-lg font-bold text-gray-900">3/5</p>
            <p className="text-xs text-gray-600 font-medium">Checks Passed</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <AlertTriangle className="w-8 h-8 text-amber-600 mb-2" />
            <p className="text-lg font-bold text-gray-900">2</p>
            <p className="text-xs text-gray-600 font-medium">Active Alerts</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <div className="flex gap-6">
            {[
              { id: 'overview', label: 'Overview', icon: Eye },
              { id: 'documents', label: 'Documents', icon: FileText },
              { id: 'transactions', label: 'Transactions', icon: Activity },
              { id: 'compliance', label: 'Compliance', icon: Shield }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors ${
                  selectedTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {selectedTab === 'overview' && (
        <div className="grid grid-cols-2 gap-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-600">Registered Address</p>
                  <p className="font-medium">{client.registeredAddress}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-600">Business Phone</p>
                  <p className="font-medium">{client.businessPhone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-600">Business Email</p>
                  <p className="font-medium">{client.businessEmail}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-600">Industry</p>
                  <p className="font-medium">{client.industry}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Checks Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Compliance Checks
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {complianceChecks.slice(0, 4).map(check => (
                <div key={check.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      check.status === 'passed' ? 'bg-green-100' :
                      check.status === 'alert' ? 'bg-red-100' :
                      'bg-yellow-100'
                    }`}>
                      <check.icon className={`w-5 h-5 ${
                        check.status === 'passed' ? 'text-green-600' :
                        check.status === 'alert' ? 'text-red-600' :
                        'text-yellow-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{check.name}</p>
                      <p className="text-xs text-gray-600">{check.provider}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={
                      check.status === 'passed' ? 'bg-green-600' :
                      check.status === 'alert' ? 'bg-red-600' :
                      'bg-yellow-600'
                    }>
                      {check.status === 'passed' ? 'Passed' :
                       check.status === 'alert' ? 'Alert' :
                       'Pending'}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">Score: {check.score}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: 'AML Alert triggered', time: '2 hours ago', type: 'alert', icon: AlertTriangle, color: 'text-red-600' },
                  { action: 'Document verification completed', time: '1 day ago', type: 'success', icon: CheckCircle, color: 'text-green-600' },
                  { action: 'Risk assessment updated', time: '3 days ago', type: 'info', icon: Shield, color: 'text-blue-600' },
                  { action: 'Compliance review scheduled', time: '5 days ago', type: 'info', icon: Calendar, color: 'text-purple-600' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 pb-3 border-b last:border-b-0">
                    <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center ${activity.color}`}>
                      <activity.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedTab === 'documents' && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Document management coming soon...</p>
          </CardContent>
        </Card>
      )}

      {selectedTab === 'transactions' && (
        <Card>
          <CardContent className="p-12 text-center">
            <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Transaction history coming soon...</p>
          </CardContent>
        </Card>
      )}

      {selectedTab === 'compliance' && (
        <Card>
          <CardContent className="p-12 text-center">
            <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Compliance details coming soon...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

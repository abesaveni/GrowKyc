import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  FileText,
  DollarSign,
  Users,
  Activity,
  ArrowRight,
  PieChart
} from 'lucide-react';

interface PartnerDashboardProps {
  onViewClient: (clientId: string) => void;
  onViewCase: (caseId: string) => void;
}

export function PartnerDashboard({ onViewClient, onViewCase }: PartnerDashboardProps) {
  const riskHeatmap = [
    { tier: 'Critical', count: 3, color: 'bg-red-600', textColor: 'text-red-600' },
    { tier: 'High', count: 28, color: 'bg-orange-500', textColor: 'text-orange-600' },
    { tier: 'Medium', count: 142, color: 'bg-yellow-500', textColor: 'text-yellow-600' },
    { tier: 'Low', count: 1247, color: 'bg-green-500', textColor: 'text-green-600' }
  ];

  const pendingApprovals = [
    {
      id: '1',
      client: 'Sarah Mitchell',
      type: 'Credit File Approval',
      amount: '$450,000',
      submittedBy: 'Jane Chen',
      daysWaiting: 2,
      caseId: 'case-credit-001'
    },
    {
      id: '2',
      client: 'Vertex Developments',
      type: 'High Risk Override',
      reason: 'Previous insolvency - now resolved',
      submittedBy: 'Mark Thompson',
      daysWaiting: 1,
      caseId: 'case-override-002'
    }
  ];

  const fundCompliance = [
    {
      name: 'Zenith Growth Fund',
      aum: '$42.5M',
      investors: 127,
      kycCurrent: 98,
      incidents: 1,
      status: 'Good'
    },
    {
      name: 'Phoenix Property Fund',
      aum: '$87.2M',
      investors: 203,
      kycCurrent: 100,
      incidents: 0,
      status: 'Excellent'
    },
    {
      name: 'Horizon Capital Fund',
      aum: '$156.8M',
      investors: 89,
      kycCurrent: 94,
      incidents: 0,
      status: 'Good'
    }
  ];

  const recentIncidents = [
    {
      id: '1',
      type: 'Reportable Situation',
      fund: 'Zenith Growth Fund',
      description: 'Late distribution disclosure',
      severity: 'Medium',
      status: 'Under Investigation',
      reported: '2026-02-10'
    }
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Executive Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2 border-blue-300 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-semibold">Total Clients</p>
                <p className="text-4xl font-bold text-blue-700 mt-1">1,420</p>
              </div>
              <Users className="w-10 h-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-300 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-semibold">KYC Current</p>
                <p className="text-4xl font-bold text-green-700 mt-1">96%</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-300 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700 font-semibold">Pending Approvals</p>
                <p className="text-4xl font-bold text-orange-700 mt-1">8</p>
              </div>
              <FileText className="w-10 h-10 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-300 bg-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 font-semibold">Funds AUM</p>
                <p className="text-3xl font-bold text-purple-700 mt-1">$286M</p>
              </div>
              <DollarSign className="w-10 h-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Client Risk Heatmap */}
      <Card>
        <CardHeader className="border-b bg-gray-50">
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Client Risk Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {riskHeatmap.map((tier) => (
              <div key={tier.tier} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded ${tier.color}`} />
                    <span className="font-semibold text-gray-900">{tier.tier} Risk</span>
                  </div>
                  <span className={`font-bold ${tier.textColor}`}>{tier.count} clients</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${tier.color}`}
                    style={{
                      width: `${(tier.count / 1420) * 100}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Approvals */}
      <Card className="border-2 border-orange-300">
        <CardHeader className="bg-orange-50 border-b border-orange-200">
          <CardTitle className="flex items-center gap-2 text-orange-900">
            <FileText className="w-5 h-5" />
            Pending Partner Approvals ({pendingApprovals.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {pendingApprovals.map((approval) => (
              <div key={approval.id} className="p-4 bg-orange-50 border-2 border-orange-300 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-orange-600 text-white text-xs font-bold rounded-full">
                        {approval.type}
                      </span>
                      <span className="font-bold text-gray-900">{approval.client}</span>
                    </div>
                    {approval.amount && (
                      <p className="text-sm text-gray-700 mb-1">
                        <span className="font-semibold">Amount:</span> {approval.amount}
                      </p>
                    )}
                    {approval.reason && (
                      <p className="text-sm text-gray-700 mb-1">
                        <span className="font-semibold">Reason:</span> {approval.reason}
                      </p>
                    )}
                    <p className="text-xs text-gray-600">
                      Submitted by {approval.submittedBy} • {approval.daysWaiting} days ago
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => onViewCase(approval.caseId)}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Review & Approve
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 border-red-300">
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fund Compliance Status */}
        <Card>
          <CardHeader className="border-b bg-purple-50">
            <CardTitle className="flex items-center gap-2 text-purple-900">
              <Activity className="w-5 h-5" />
              Fund Compliance Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {fundCompliance.map((fund, idx) => (
                <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-gray-900">{fund.name}</p>
                      <p className="text-sm text-gray-600">
                        AUM: {fund.aum} • {fund.investors} investors
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        fund.status === 'Excellent'
                          ? 'bg-green-100 text-green-700 border border-green-300'
                          : 'bg-blue-100 text-blue-700 border border-blue-300'
                      }`}
                    >
                      {fund.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600">KYC Current</p>
                      <p className="text-lg font-bold text-green-600">{fund.kycCurrent}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Open Incidents</p>
                      <p
                        className={`text-lg font-bold ${
                          fund.incidents === 0 ? 'text-green-600' : 'text-orange-600'
                        }`}
                      >
                        {fund.incidents}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Incidents */}
        <Card>
          <CardHeader className="border-b bg-red-50">
            <CardTitle className="flex items-center gap-2 text-red-900">
              <AlertTriangle className="w-5 h-5" />
              AFSL Incidents & Reportable Situations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {recentIncidents.length > 0 ? (
              <div className="space-y-4">
                {recentIncidents.map((incident) => (
                  <div key={incident.id} className="p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="px-3 py-1 bg-yellow-600 text-white text-xs font-bold rounded-full">
                          {incident.type}
                        </span>
                        <p className="font-bold text-gray-900 mt-2">{incident.fund}</p>
                        <p className="text-sm text-gray-700 mt-1">{incident.description}</p>
                        <p className="text-xs text-gray-600 mt-2">
                          Reported: {incident.reported} • Status: {incident.status}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          incident.severity === 'High'
                            ? 'bg-red-600 text-white'
                            : 'bg-orange-600 text-white'
                        }`}
                      >
                        {incident.severity}
                      </span>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => onViewCase(incident.id)}>
                      View Investigation
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="text-sm text-gray-600">No active incidents</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quarterly Performance */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Quarterly Compliance Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">CDD Completion Rate</p>
              <p className="text-4xl font-bold text-green-600">96%</p>
              <p className="text-xs text-gray-500 mt-1">Target: 95%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Average Response Time</p>
              <p className="text-4xl font-bold text-blue-600">3.2</p>
              <p className="text-xs text-gray-500 mt-1">days (Target: 5)</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Overdue Cases</p>
              <p className="text-4xl font-bold text-orange-600">12</p>
              <p className="text-xs text-gray-500 mt-1">Down from 18</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Risk Score Trend</p>
              <p className="text-4xl font-bold text-green-600">↓ 8%</p>
              <p className="text-xs text-gray-500 mt-1">Improving</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

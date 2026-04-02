import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  ArrowLeft,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  FileText,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Filter
} from 'lucide-react';

interface ReportsProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

export function Reports({ onNavigate, onBack }: ReportsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('this-month');
  const [selectedReport, setSelectedReport] = useState('overview');

  const performanceMetrics = {
    thisMonth: {
      applications: 24,
      approvals: 18,
      settlements: 12,
      totalValue: 5420000,
      commissions: 108400,
      conversionRate: 75,
      avgDealSize: 451666
    },
    lastMonth: {
      applications: 20,
      approvals: 15,
      settlements: 10,
      totalValue: 3890000,
      commissions: 77800,
      conversionRate: 75,
      avgDealSize: 389000
    }
  };

  const monthlyData = [
    { month: 'Jan', applications: 18, settlements: 8, value: 3200000 },
    { month: 'Feb', applications: 24, settlements: 12, value: 5420000 },
    { month: 'Mar', applications: 0, settlements: 0, value: 0 },
  ];

  const loanTypeBreakdown = [
    { type: 'Commercial Mortgage', count: 8, value: 3200000, percentage: 59 },
    { type: 'SME Term Loan', count: 6, value: 1450000, percentage: 27 },
    { type: 'Asset Finance', count: 5, value: 520000, percentage: 10 },
    { type: 'Private Lending', count: 3, value: 250000, percentage: 4 }
  ];

  const topClients = [
    { name: 'Construction Co', deals: 3, value: 4200000, commission: 75600 },
    { name: 'ABC Enterprises', deals: 2, value: 1650000, commission: 33000 },
    { name: 'Tech Innovations', deals: 2, value: 900000, commission: 20250 },
    { name: 'Green Energy Solutions', deals: 2, value: 640000, commission: 16000 },
    { name: 'Retail Group', deals: 1, value: 1200000, commission: 24000 }
  ];

  const pipelineMetrics = [
    { stage: 'Enquiry', count: 8, value: 3200000 },
    { stage: 'Submitted', count: 6, value: 2700000 },
    { stage: 'Assessment', count: 5, value: 4250000 },
    { stage: 'Approved', count: 3, value: 2100000 },
    { stage: 'Settlement', count: 2, value: 3700000 }
  ];

  const calculateChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return change.toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-1">Track your performance and business insights</p>
          </div>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="this-month">This Month</option>
            <option value="last-month">Last Month</option>
            <option value="this-quarter">This Quarter</option>
            <option value="ytd">Year to Date</option>
            <option value="custom">Custom Range</option>
          </select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                +{calculateChange(performanceMetrics.thisMonth.applications, performanceMetrics.lastMonth.applications)}%
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Applications</p>
            <p className="text-2xl font-bold text-gray-900">{performanceMetrics.thisMonth.applications}</p>
            <p className="text-xs text-gray-500 mt-2">vs. {performanceMetrics.lastMonth.applications} last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                +{calculateChange(performanceMetrics.thisMonth.settlements, performanceMetrics.lastMonth.settlements)}%
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Settlements</p>
            <p className="text-2xl font-bold text-gray-900">{performanceMetrics.thisMonth.settlements}</p>
            <p className="text-xs text-gray-500 mt-2">vs. {performanceMetrics.lastMonth.settlements} last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                +{calculateChange(performanceMetrics.thisMonth.totalValue, performanceMetrics.lastMonth.totalValue)}%
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Loan Value</p>
            <p className="text-2xl font-bold text-gray-900">
              ${(performanceMetrics.thisMonth.totalValue / 1000000).toFixed(1)}M
            </p>
            <p className="text-xs text-gray-500 mt-2">vs. ${(performanceMetrics.lastMonth.totalValue / 1000000).toFixed(1)}M last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">
                {performanceMetrics.thisMonth.conversionRate}%
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">Conversion Rate</p>
            <p className="text-2xl font-bold text-gray-900">
              ${(performanceMetrics.thisMonth.commissions / 1000).toFixed(0)}K
            </p>
            <p className="text-xs text-gray-500 mt-2">Commission earned</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Monthly Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((month) => (
                <div key={month.month}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{month.month}</span>
                    <span className="text-sm text-gray-600">
                      {month.applications} apps • {month.settlements} settled
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-indigo-600 h-3 rounded-full"
                      style={{ width: `${month.settlements > 0 ? (month.settlements / month.applications) * 100 : 0}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Value: ${(month.value / 1000000).toFixed(2)}M
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Loan Type Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Loan Type Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loanTypeBreakdown.map((type, index) => (
                <div key={type.type}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{type.type}</span>
                    <span className="text-sm text-gray-600">{type.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        index === 0 ? 'bg-indigo-600' :
                        index === 1 ? 'bg-blue-500' :
                        index === 2 ? 'bg-purple-500' : 'bg-pink-500'
                      }`}
                      style={{ width: `${type.percentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500">{type.count} deals</p>
                    <p className="text-xs text-gray-500">${(type.value / 1000000).toFixed(2)}M</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Pipeline Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {pipelineMetrics.map((stage, index) => (
              <div key={stage.stage} className="relative">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <p className="text-sm font-medium text-gray-700 mb-2">{stage.stage}</p>
                  <p className="text-2xl font-bold text-indigo-600">{stage.count}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    ${(stage.value / 1000000).toFixed(1)}M
                  </p>
                </div>
                {index < pipelineMetrics.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                    <div className="w-4 h-0.5 bg-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Clients */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Top Clients
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topClients.map((client, index) => (
              <div key={client.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-600">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{client.name}</p>
                    <p className="text-sm text-gray-500">{client.deals} deals</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">${(client.value / 1000000).toFixed(2)}M</p>
                  <p className="text-sm text-green-600">${client.commission.toLocaleString()} commission</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

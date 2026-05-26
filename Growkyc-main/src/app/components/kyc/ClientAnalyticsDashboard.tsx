import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  BarChart,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  PieChart,
  Target,
  Calendar,
  Download,
  Filter
} from 'lucide-react';

export function ClientAnalyticsDashboard() {
  const [timeframe, setTimeframe] = useState('month');

  const portfolioMetrics = {
    totalClients: 247,
    totalAUM: 45600000,
    avgClientValue: 184615,
    newClientsMonth: 24,
    churnRate: 2.1,
    growthRate: 12.3,
    retentionRate: 97.9
  };

  const riskMetrics = {
    lowRisk: { count: 156, percentage: 63, aum: 28500000 },
    mediumRisk: { count: 68, percentage: 28, aum: 14200000 },
    highRisk: { count: 20, percentage: 8, aum: 2600000 },
    criticalRisk: { count: 3, percentage: 1, aum: 300000 }
  };

  const entityBreakdown = [
    { type: 'Individuals', count: 98, percentage: 40, avgValue: 120000 },
    { type: 'Companies', count: 72, percentage: 29, avgValue: 285000 },
    { type: 'Trusts', count: 52, percentage: 21, avgValue: 195000 },
    { type: 'SMSFs', count: 25, percentage: 10, avgValue: 420000 }
  ];

  const topClients = [
    { name: 'Melbourne Property Trust', value: 2400000, risk: 'Low', industry: 'Real Estate' },
    { name: 'Tech Innovations Pty Ltd', value: 1850000, risk: 'Medium', industry: 'Technology' },
    { name: 'Smith Family Trust', value: 1620000, risk: 'Low', industry: 'Investment' },
    { name: 'Global Trading Co', value: 1480000, risk: 'High', industry: 'Import/Export' },
    { name: 'Healthcare Partners', value: 1350000, risk: 'Low', industry: 'Healthcare' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BarChart className="w-16 h-16" />
            <div>
              <h1 className="text-4xl font-bold mb-2">Client Analytics</h1>
              <p className="text-xl text-purple-100">Portfolio Insights & Performance Metrics</p>
            </div>
          </div>
          <div className="flex gap-3">
            <select 
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="px-4 py-2 bg-white text-purple-600 rounded-lg font-semibold"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <Button className="bg-white text-purple-600 hover:bg-purple-50">
              <Download className="w-5 h-5 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Total Clients</h3>
              <Users className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold">{portfolioMetrics.totalClients}</p>
            <p className="text-xs text-purple-100 mt-1">+{portfolioMetrics.newClientsMonth} this month</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Total AUM</h3>
              <DollarSign className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold">${(portfolioMetrics.totalAUM / 1000000).toFixed(1)}M</p>
            <p className="text-xs text-purple-100 mt-1">Avg: ${(portfolioMetrics.avgClientValue / 1000).toFixed(0)}k</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Growth Rate</h3>
              <TrendingUp className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-green-300">+{portfolioMetrics.growthRate}%</p>
            <p className="text-xs text-white/80 mt-1">YoY growth</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Retention</h3>
              <Target className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-green-300">{portfolioMetrics.retentionRate}%</p>
            <p className="text-xs text-white/80 mt-1">Client retention</p>
          </div>
        </div>
      </div>

      {/* Portfolio Composition */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Portfolio by Entity Type</h3>
          <div className="space-y-4">
            {entityBreakdown.map((entity, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">{entity.type}</p>
                    <p className="text-sm text-gray-600">{entity.count} clients ({entity.percentage}%)</p>
                  </div>
                  <p className="font-bold text-purple-600">
                    Avg: ${(entity.avgValue / 1000).toFixed(0)}k
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-purple-600 h-3 rounded-full transition-all"
                    style={{ width: `${entity.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Risk Distribution by AUM</h3>
          <div className="space-y-4">
            {Object.entries(riskMetrics).map(([key, data]) => {
              const colors = {
                lowRisk: { bg: 'green', label: 'Low Risk' },
                mediumRisk: { bg: 'yellow', label: 'Medium Risk' },
                highRisk: { bg: 'orange', label: 'High Risk' },
                criticalRisk: { bg: 'red', label: 'Critical Risk' }
              }[key];

              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{colors?.label}</p>
                      <p className="text-sm text-gray-600">{data.count} clients ({data.percentage}%)</p>
                    </div>
                    <p className="font-bold text-gray-900">
                      ${(data.aum / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`bg-${colors?.bg}-600 h-3 rounded-full transition-all`}
                      style={{ width: `${(data.aum / portfolioMetrics.totalAUM) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Clients */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Top Clients by Value</h3>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-200">
                <th className="text-left p-3 font-semibold text-gray-900">Rank</th>
                <th className="text-left p-3 font-semibold text-gray-900">Client Name</th>
                <th className="text-left p-3 font-semibold text-gray-900">Industry</th>
                <th className="text-left p-3 font-semibold text-gray-900">Value</th>
                <th className="text-left p-3 font-semibold text-gray-900">Risk Level</th>
                <th className="text-left p-3 font-semibold text-gray-900">% of Portfolio</th>
              </tr>
            </thead>
            <tbody>
              {topClients.map((client, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-3">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 font-bold rounded-full">
                      #{index + 1}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-gray-900">{client.name}</td>
                  <td className="p-3 text-gray-700">{client.industry}</td>
                  <td className="p-3 font-bold text-gray-900">
                    ${(client.value / 1000000).toFixed(2)}M
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      client.risk === 'Low' ? 'bg-green-100 text-green-700' :
                      client.risk === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {client.risk}
                    </span>
                  </td>
                  <td className="p-3 text-gray-700">
                    {((client.value / portfolioMetrics.totalAUM) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Client Acquisition & Churn Trends</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-green-900">New Clients</h4>
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-4xl font-bold text-green-600 mb-2">{portfolioMetrics.newClientsMonth}</p>
            <p className="text-sm text-green-700">This month</p>
            <p className="text-xs text-green-600 mt-2">↑ 15% from last month</p>
          </div>

          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-red-900">Churn Rate</h4>
              <Activity className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-4xl font-bold text-red-600 mb-2">{portfolioMetrics.churnRate}%</p>
            <p className="text-sm text-red-700">Annual churn</p>
            <p className="text-xs text-green-600 mt-2">↓ 0.5% improvement</p>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-blue-900">Net Growth</h4>
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-4xl font-bold text-blue-600 mb-2">+{portfolioMetrics.newClientsMonth - 5}</p>
            <p className="text-sm text-blue-700">Net new clients</p>
            <p className="text-xs text-blue-600 mt-2">Strong growth</p>
          </div>
        </div>
      </div>

      {/* Industry Distribution */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Industry Distribution</h3>
        <div className="grid grid-cols-5 gap-4">
          {[
            { name: 'Real Estate', count: 52, color: 'blue' },
            { name: 'Technology', count: 38, color: 'purple' },
            { name: 'Healthcare', count: 34, color: 'green' },
            { name: 'Financial Services', count: 29, color: 'yellow' },
            { name: 'Professional Services', count: 25, color: 'orange' },
            { name: 'Retail', count: 22, color: 'pink' },
            { name: 'Manufacturing', count: 18, color: 'indigo' },
            { name: 'Construction', count: 15, color: 'red' },
            { name: 'Transport & Logistics', count: 10, color: 'teal' },
            { name: 'Other', count: 4, color: 'gray' }
          ].map((industry, index) => (
            <div key={index} className={`p-4 bg-${industry.color}-50 border border-${industry.color}-200 rounded-lg text-center`}>
              <p className="text-2xl font-bold text-gray-900 mb-1">{industry.count}</p>
              <p className="text-sm text-gray-700 font-semibold">{industry.name}</p>
              <p className="text-xs text-gray-600 mt-1">
                {((industry.count / portfolioMetrics.totalClients) * 100).toFixed(1)}%
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Geographic Distribution */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Geographic Distribution</h3>
        <div className="grid grid-cols-4 gap-4">
          {[
            { state: 'Victoria', count: 98, percentage: 40 },
            { state: 'New South Wales', count: 72, percentage: 29 },
            { state: 'Queensland', count: 45, percentage: 18 },
            { state: 'Other States', count: 32, percentage: 13 }
          ].map((geo, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-3xl font-bold text-gray-900 mb-2">{geo.count}</p>
              <p className="font-semibold text-gray-900">{geo.state}</p>
              <p className="text-sm text-gray-600">{geo.percentage}% of portfolio</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

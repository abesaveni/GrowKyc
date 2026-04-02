import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  FileText,
  TrendingUp,
  Download,
  Calendar,
  Filter,
  CheckCircle,
  AlertTriangle,
  Shield,
  Users,
  Activity,
  DollarSign,
  Clock,
  Target,
  BarChart,
  PieChart
} from 'lucide-react';

export function ComplianceReportsDashboard() {
  const [dateRange, setDateRange] = useState('month');
  
  const stats = {
    complianceScore: 94,
    totalClients: 247,
    highRiskClients: 23,
    reviewsCompleted: 235,
    smrSubmitted: 8,
    ttrSubmitted: 35,
    screeningCompleted: 247,
    pepDetected: 3,
    overdueReviews: 5,
    documentsExpiring: 12
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <FileText className="w-16 h-16" />
            <div>
              <h1 className="text-4xl font-bold mb-2">Compliance Reports</h1>
              <p className="text-xl text-green-100">Comprehensive Compliance Dashboard & Analytics</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button className="bg-white text-green-600 hover:bg-green-50">
              <Download className="w-5 h-5 mr-2" />
              Export Report
            </Button>
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 bg-white text-green-600 rounded-lg font-semibold"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-5 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Compliance Score</h3>
              <Shield className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-4xl font-bold">{stats.complianceScore}%</p>
            <p className="text-xs text-green-100 mt-1">AUSTRAC Ready</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Total Clients</h3>
              <Users className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-4xl font-bold">{stats.totalClients}</p>
            <p className="text-xs text-green-100 mt-1">Active portfolio</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">High Risk</h3>
              <AlertTriangle className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-4xl font-bold text-orange-300">{stats.highRiskClients}</p>
            <p className="text-xs text-white/80 mt-1">9.3% of clients</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Reviews Done</h3>
              <CheckCircle className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-4xl font-bold text-green-300">{stats.reviewsCompleted}</p>
            <p className="text-xs text-white/80 mt-1">95% complete</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Reports Filed</h3>
              <FileText className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-4xl font-bold">{stats.smrSubmitted + stats.ttrSubmitted}</p>
            <p className="text-xs text-white/80 mt-1">SMR: {stats.smrSubmitted} | TTR: {stats.ttrSubmitted}</p>
          </div>
        </div>
      </div>

      {/* Compliance Status Grid */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border-2 border-green-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900">KYC Compliance</h3>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-600 mb-2">98%</p>
          <p className="text-sm text-gray-700 mb-3">Client verification complete</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full" style={{ width: '98%' }} />
          </div>
        </div>

        <div className="bg-white rounded-lg border-2 border-blue-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900">Screening Status</h3>
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-600 mb-2">100%</p>
          <p className="text-sm text-gray-700 mb-3">All clients screened</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }} />
          </div>
        </div>

        <div className="bg-white rounded-lg border-2 border-orange-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900">Overdue Items</h3>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-orange-600 mb-2">{stats.overdueReviews}</p>
          <p className="text-sm text-gray-700 mb-3">Reviews pending action</p>
          <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700">
            Review Now
          </Button>
        </div>

        <div className="bg-white rounded-lg border-2 border-yellow-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900">Expiring Docs</h3>
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
          <p className="text-3xl font-bold text-yellow-600 mb-2">{stats.documentsExpiring}</p>
          <p className="text-sm text-gray-700 mb-3">Within 30 days</p>
          <Button size="sm" variant="outline" className="w-full">
            View List
          </Button>
        </div>
      </div>

      {/* Risk Distribution */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Client Risk Distribution</h3>
        <div className="grid grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-32 h-32 rounded-full bg-green-100 border-4 border-green-500 flex items-center justify-center mx-auto mb-3">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">156</p>
                <p className="text-xs text-green-700">63%</p>
              </div>
            </div>
            <p className="font-bold text-gray-900">Low Risk</p>
            <p className="text-sm text-gray-600">Standard CDD</p>
          </div>
          <div className="text-center">
            <div className="w-32 h-32 rounded-full bg-yellow-100 border-4 border-yellow-500 flex items-center justify-center mx-auto mb-3">
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-600">68</p>
                <p className="text-xs text-yellow-700">28%</p>
              </div>
            </div>
            <p className="font-bold text-gray-900">Medium Risk</p>
            <p className="text-sm text-gray-600">Enhanced monitoring</p>
          </div>
          <div className="text-center">
            <div className="w-32 h-32 rounded-full bg-orange-100 border-4 border-orange-500 flex items-center justify-center mx-auto mb-3">
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600">20</p>
                <p className="text-xs text-orange-700">8%</p>
              </div>
            </div>
            <p className="font-bold text-gray-900">High Risk</p>
            <p className="text-sm text-gray-600">Enhanced CDD</p>
          </div>
          <div className="text-center">
            <div className="w-32 h-32 rounded-full bg-red-100 border-4 border-red-500 flex items-center justify-center mx-auto mb-3">
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">3</p>
                <p className="text-xs text-red-700">1%</p>
              </div>
            </div>
            <p className="font-bold text-gray-900">Critical Risk</p>
            <p className="text-sm text-gray-600">Senior approval</p>
          </div>
        </div>
      </div>

      {/* Monthly Compliance Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Monthly Compliance Activity</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-blue-900">Client Onboarding</h4>
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600 mb-1">24</p>
            <p className="text-sm text-blue-700">New clients onboarded</p>
            <p className="text-xs text-blue-600 mt-2">↑ 15% from last month</p>
          </div>

          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-green-900">CDD Reviews</h4>
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600 mb-1">42</p>
            <p className="text-sm text-green-700">Reviews completed</p>
            <p className="text-xs text-green-600 mt-2">100% on-time</p>
          </div>

          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-purple-900">Screenings</h4>
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-600 mb-1">247</p>
            <p className="text-sm text-purple-700">Re-screenings performed</p>
            <p className="text-xs text-purple-600 mt-2">3 matches found</p>
          </div>
        </div>
      </div>

      {/* Reporting Compliance */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">AUSTRAC Reporting Compliance</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Suspicious Matter Reports (SMR)</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">Total SMRs Filed</span>
                <span className="font-bold text-gray-900">{stats.smrSubmitted}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-700">Filed Within 3 Days</span>
                <span className="font-bold text-green-600">{stats.smrSubmitted}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-gray-700">Average Filing Time</span>
                <span className="font-bold text-blue-600">1.8 days</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Threshold Transaction Reports (TTR)</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">Total TTRs Filed</span>
                <span className="font-bold text-gray-900">{stats.ttrSubmitted}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-700">Filed Within 10 Days</span>
                <span className="font-bold text-green-600">{stats.ttrSubmitted}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-gray-700">Average Filing Time</span>
                <span className="font-bold text-blue-600">4.5 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Findings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Key Findings & Recommendations</h3>
        <div className="space-y-3">
          <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded-r-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900">Excellent Compliance Performance</p>
                <p className="text-sm text-green-800">All AUSTRAC reporting deadlines met. KYC completion rate at 98%.</p>
              </div>
            </div>
          </div>

          <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 rounded-r-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-900">Action Required</p>
                <p className="text-sm text-yellow-800">5 client reviews overdue - schedule for completion this week.</p>
              </div>
            </div>
          </div>

          <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900">Recommendation</p>
                <p className="text-sm text-blue-800">Consider implementing automated review reminders to prevent future overdue items.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

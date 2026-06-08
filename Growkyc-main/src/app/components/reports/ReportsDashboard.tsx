import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from '../../lib/toast';
import { Breadcrumbs } from '../ui/breadcrumbs';
import { 
  BarChart3,
  TrendingUp,
  Download,
  Filter,
  Calendar,
  DollarSign,
  Users,
  FileText,
  PieChart,
  Activity,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';

export function ReportsDashboard() {
  const [dateRange, setDateRange] = useState('30days');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (reportType: string) => {
    setIsExporting(true);
    toast.loading(`Generating ${reportType} report...`);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsExporting(false);
    toast.success(`${reportType} exported successfully`, 'Downloaded to your computer');
  };

  const handleRefresh = () => {
    toast.success('Reports refreshed');
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '#' },
    { label: 'Reports & Analytics' }
  ];

  // Mock data for demonstration
  const keyMetrics = {
    totalCases: 47,
    activeCases: 23,
    totalRevenue: 12450000,
    avgCaseValue: 1050000,
    totalBids: 156,
    successRate: 68
  };

  const reportTypes = [
    {
      id: 'financial',
      title: 'Financial Summary',
      description: 'Revenue, payments, and transaction analysis',
      icon: DollarSign,
      color: 'green'
    },
    {
      id: 'cases',
      title: 'Case Performance',
      description: 'Case volume, status breakdown, and trends',
      icon: FileText,
      color: 'blue'
    },
    {
      id: 'users',
      title: 'User Activity',
      description: 'User engagement, registrations, and KYC',
      icon: Users,
      color: 'purple'
    },
    {
      id: 'auctions',
      title: 'Auction Analytics',
      description: 'Bidding activity, win rates, and pricing',
      icon: TrendingUp,
      color: 'red'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      green: 'bg-green-50 text-green-600',
      blue: 'bg-blue-50 text-blue-600',
      purple: 'bg-purple-50 text-purple-600',
      red: 'bg-red-50 text-red-600'
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive platform insights and performance metrics</p>
        </div>
        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => {
              setDateRange(e.target.value);
              toast.info('Date range updated');
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="ytd">Year to Date</option>
            <option value="all">All Time</option>
          </select>

          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Cases</p>
              <p className="text-3xl font-semibold text-gray-900">{keyMetrics.totalCases}</p>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +12% vs last period
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Cases</p>
              <p className="text-3xl font-semibold text-gray-900">{keyMetrics.activeCases}</p>
              <p className="text-xs text-blue-600 mt-1">{keyMetrics.activeCases} in progress</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-3xl font-semibold text-gray-900">A${(keyMetrics.totalRevenue / 1000000).toFixed(1)}M</p>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +18% vs last period
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg Case Value</p>
              <p className="text-3xl font-semibold text-gray-900">A${(keyMetrics.avgCaseValue / 1000).toFixed(0)}K</p>
              <p className="text-xs text-gray-600 mt-1">Per case</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Bids</p>
              <p className="text-3xl font-semibold text-gray-900">{keyMetrics.totalBids}</p>
              <p className="text-xs text-purple-600 mt-1">{(keyMetrics.totalBids / keyMetrics.totalCases).toFixed(1)} per case</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Success Rate</p>
              <p className="text-3xl font-semibold text-gray-900">{keyMetrics.successRate}%</p>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +5% vs last period
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <Card key={report.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${getColorClasses(report.color)}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button 
                    className="flex-1"
                    onClick={() => handleExport(report.title)}
                    disabled={isExporting}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Export PDF
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleExport(`${report.title} (Excel)`)}
                    disabled={isExporting}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Export Excel
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Case Volume Trend</CardTitle>
              <Button variant="outline" size="sm" onClick={() => toast.info('Opening detailed chart...')}>
                <BarChart3 className="w-4 h-4 mr-1" />
                View Details
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Interactive chart would display here</p>
                <p className="text-sm text-gray-500 mt-1">Showing case volume over time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Revenue Distribution</CardTitle>
              <Button variant="outline" size="sm" onClick={() => toast.info('Opening detailed chart...')}>
                <PieChart className="w-4 h-4 mr-1" />
                View Details
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Interactive chart would display here</p>
                <p className="text-sm text-gray-500 mt-1">Showing revenue by category</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Platform Activity</CardTitle>
            <Button variant="outline" size="sm" onClick={() => toast.info('Opening activity log...')}>
              <Activity className="w-4 h-4 mr-1" />
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { event: 'New case created', details: 'MIP-2024-012 by Sarah Mitchell', time: '5 minutes ago' },
              { event: 'Bid placed', details: 'A$1.2M bid on MIP-2024-008', time: '15 minutes ago' },
              { event: 'Contract signed', details: 'MIP-2024-005 settlement proceeding', time: '1 hour ago' },
              { event: 'KYC approved', details: 'David Wilson verified', time: '2 hours ago' },
              { event: 'Payment received', details: 'A$850K payment processed', time: '3 hours ago' }
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-medium text-gray-900">{activity.event}</p>
                  <p className="text-sm text-gray-600">{activity.details}</p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

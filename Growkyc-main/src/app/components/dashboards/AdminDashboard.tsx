import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { 
  TrendingUp, 
  TrendingDown,
  Briefcase,
  DollarSign,
  Users,
  Gavel,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Shield,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate?: (page: string) => void;
}

interface DashboardStats {
  totalKYC: number;
  pendingKYC: number;
  approvedKYC: number;
  rejectedKYC: number;
  totalUsers: number;
  activeUsers: number;
  totalDocuments: number;
}

const recentCases = [
  { id: 'MIP-2024-047', property: 'Bondi Beach Apartment', value: 1250000, status: 'live_auction', bids: 8, timeLeft: '2h 34m' },
  { id: 'MIP-2024-046', property: 'Melbourne CBD Office', value: 2150000, status: 'buy_now', bids: 0, timeLeft: 'Buy Now' },
  { id: 'MIP-2024-045', property: 'Sydney Warehouse', value: 890000, status: 'sold', bids: 12, timeLeft: 'Sold' },
  { id: 'MIP-2024-044', property: 'Brisbane Townhouse', value: 675000, status: 'live_auction', bids: 5, timeLeft: '5h 12m' },
  { id: 'MIP-2024-043', property: 'Perth Retail Space', value: 1420000, status: 'pending', bids: 0, timeLeft: 'Pending' },
];

const recentSales = [
  { id: 'MIP-2024-042', property: 'Gold Coast Villa', amount: 1850000, buyer: 'Platinum Capital', date: '2h ago', profit: 125000 },
  { id: 'MIP-2024-041', property: 'Adelaide Duplex', amount: 720000, buyer: 'Urban Investors', date: '4h ago', profit: 82000 },
  { id: 'MIP-2024-040', property: 'Canberra Apartment', amount: 1100000, buyer: 'Capital Group', date: '1d ago', profit: 95000 },
  { id: 'MIP-2024-039', property: 'Darwin Commercial', amount: 980000, buyer: 'Northern Assets', date: '1d ago', profit: 68000 },
  { id: 'MIP-2024-038', property: 'Hobart Warehouse', amount: 1350000, buyer: 'Southern Property', date: '2d ago', profit: 110000 },
];

const monthlyData = [
  { month: 'Aug', cases: 18, sales: 2800000, users: 95 },
  { month: 'Sep', cases: 22, sales: 3200000, users: 118 },
  { month: 'Oct', cases: 28, sales: 4100000, users: 142 },
  { month: 'Nov', cases: 31, sales: 4850000, users: 168 },
  { month: 'Dec', cases: 35, sales: 5200000, users: 195 },
  { month: 'Jan', cases: 42, sales: 6300000, users: 224 },
  { month: 'Feb', cases: 38, sales: 5900000, users: 251 },
];

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [liveStats, setLiveStats] = React.useState<DashboardStats | null>(null);

  React.useEffect(() => {
    const token = sessionStorage.getItem('growkyc_token');
    if (!token) return;
    fetch('/api/v1/admin/dashboard/stats', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        setLiveStats({
          totalKYC: data.kyc?.total ?? 0,
          pendingKYC: data.kyc?.pending ?? 0,
          approvedKYC: data.kyc?.approved ?? 0,
          rejectedKYC: data.kyc?.rejected ?? 0,
          totalUsers: data.users?.total ?? 0,
          activeUsers: data.users?.active ?? 0,
          totalDocuments: data.documents?.total ?? 0,
        });
      })
      .catch(() => null);
  }, []);

  const maxCases = Math.max(...monthlyData.map(d => d.cases));
  const maxSales = Math.max(...monthlyData.map(d => d.sales));

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Cases */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                <TrendingUp className="w-4 h-4" />
                12%
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Total KYC Records</p>
            <p className="text-3xl font-bold text-gray-900">{liveStats ? liveStats.totalKYC : '—'}</p>
            <p className="text-xs text-gray-500 mt-2">{liveStats ? `${liveStats.approvedKYC} approved • ${liveStats.rejectedKYC} rejected` : 'Loading…'}</p>
          </CardContent>
        </Card>

        {/* Total Sales */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                <TrendingUp className="w-4 h-4" />
                23%
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Sales</p>
            <p className="text-3xl font-bold text-gray-900">A$15.8M</p>
            <p className="text-xs text-gray-500 mt-2">Avg: A$1,053K per deal</p>
          </CardContent>
        </Card>

        {/* Platform Users */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full -mr-16 -mt-16" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                <TrendingUp className="w-4 h-4" />
                18%
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Platform Users</p>
            <p className="text-3xl font-bold text-gray-900">{liveStats ? liveStats.totalUsers.toLocaleString() : '—'}</p>
            <p className="text-xs text-gray-500 mt-2">{liveStats ? `${liveStats.pendingKYC} pending KYC` : 'Loading…'}</p>
          </CardContent>
        </Card>

        {/* Active Auctions */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -mr-16 -mt-16" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-100 rounded-lg">
                <Gavel className="w-6 h-6 text-amber-600" />
              </div>
              <div className="text-sm font-semibold text-green-600">
                94.2%
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Active Auctions</p>
            <p className="text-3xl font-bold text-gray-900">12</p>
            <p className="text-xs text-gray-500 mt-2">Success rate: 94.2%</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cases & Sales Trend */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Monthly Overview</CardTitle>
              <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                <option>Last 7 Months</option>
                <option>Last 12 Months</option>
                <option>This Year</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Cases Chart */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Cases Created</span>
                  <span className="text-sm font-semibold text-blue-600">{monthlyData[monthlyData.length - 1].cases}</span>
                </div>
                <div className="flex items-end justify-between gap-2 h-32">
                  {monthlyData.map((data, idx) => (
                    <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer relative group"
                        style={{ height: `${(data.cases / maxCases) * 100}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {data.cases} cases
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{data.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sales Chart */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Sales Volume</span>
                  <span className="text-sm font-semibold text-green-600">
                    A${(monthlyData[monthlyData.length - 1].sales / 1000000).toFixed(1)}M
                  </span>
                </div>
                <div className="flex items-end justify-between gap-2 h-32">
                  {monthlyData.map((data, idx) => (
                    <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full bg-green-500 rounded-t hover:bg-green-600 transition-colors cursor-pointer relative group"
                        style={{ height: `${(data.sales / maxSales) * 100}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          A${(data.sales / 1000000).toFixed(1)}M
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{data.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Live Auctions */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Gavel className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">Live Auctions</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">12</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Total Bids: 87</span>
                  <span>•</span>
                  <span>Avg: 7.2 bids/auction</span>
                </div>
              </div>

              {/* Pending Approvals */}
              <div className="p-4 bg-amber-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-600" />
                    <span className="font-semibold text-gray-900">Pending Approvals</span>
                  </div>
                  <span className="text-2xl font-bold text-amber-600">{liveStats ? liveStats.pendingKYC : '—'}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>KYC: {liveStats ? liveStats.pendingKYC : '—'}</span>
                  <span>•</span>
                  <span>Cases: 3</span>
                  <span>•</span>
                  <span>Contracts: 2</span>
                </div>
              </div>

              {/* Completed This Week */}
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-gray-900">Completed This Week</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">24</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Sales: 5</span>
                  <span>•</span>
                  <span>Value: A$6.2M</span>
                </div>
              </div>

              {/* Issues Requiring Attention */}
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="font-semibold text-gray-900">Requires Attention</span>
                  </div>
                  <span className="text-2xl font-bold text-red-600">3</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Disputes: 2</span>
                  <span>•</span>
                  <span>Escalations: 1</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Cases & Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Cases */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Cases</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate?.('cases')}
                className="text-blue-600 hover:text-blue-700"
              >
                View All
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentCases.map((case_) => (
                <div
                  key={case_.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => onNavigate?.('cases')}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-mono text-gray-500">{case_.id}</span>
                        {case_.status === 'live_auction' && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">LIVE</span>
                        )}
                        {case_.status === 'buy_now' && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">BUY NOW</span>
                        )}
                        {case_.status === 'sold' && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded">SOLD</span>
                        )}
                      </div>
                      <h4 className="font-semibold text-gray-900">{case_.property}</h4>
                      <p className="text-sm text-gray-600 mt-1">A${case_.value.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{case_.bids} bids</p>
                      <p className="text-xs text-gray-500 mt-1">{case_.timeLeft}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Sales</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate?.('case_detail')}
                className="text-blue-600 hover:text-blue-700"
              >
                View Reports
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSales.map((sale) => (
                <div
                  key={sale.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => onNavigate?.('case_detail')}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-mono text-gray-500">{sale.id}</span>
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">SOLD</span>
                      </div>
                      <h4 className="font-semibold text-gray-900">{sale.property}</h4>
                      <p className="text-sm text-gray-600 mt-1">{sale.buyer}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">A${(sale.amount / 1000).toFixed(0)}K</p>
                      <p className="text-xs text-green-600 mt-1 flex items-center justify-end gap-1">
                        <ArrowUpRight className="w-3 h-3" />
                        +A${(sale.profit / 1000).toFixed(0)}K
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{sale.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-24 flex-col gap-2"
              onClick={() => onNavigate?.('admin_kyc')}
            >
              <Shield className="w-6 h-6 text-indigo-600" />
              <span className="text-sm font-medium">Review KYC</span>
              <span className="text-xs text-gray-500">{stats.pendingKYC} pending</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex-col gap-2"
              onClick={() => onNavigate?.('cases')}
            >
              <Briefcase className="w-6 h-6 text-blue-600" />
              <span className="text-sm font-medium">Manage Cases</span>
              <span className="text-xs text-gray-500">{stats.activeCases} active</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex-col gap-2"
              onClick={() => onNavigate?.('reports')}
            >
              <Activity className="w-6 h-6 text-green-600" />
              <span className="text-sm font-medium">View Reports</span>
              <span className="text-xs text-gray-500">Generate</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex-col gap-2"
              onClick={() => onNavigate?.('user_management')}
            >
              <FileText className="w-6 h-6 text-purple-600" />
              <span className="text-sm font-medium">Admin Console</span>
              <span className="text-xs text-gray-500">Full access</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

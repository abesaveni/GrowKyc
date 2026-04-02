import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Clock, 
  FileText, 
  DollarSign, 
  Users, 
  Briefcase,
  Settings,
  Menu,
  X,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Calendar,
  Target,
  BarChart3,
  FileCheck,
  Timer,
  Zap,
  Building2,
  FolderOpen,
  Bell,
  LogOut,
  Activity,
  Percent,
  Play,
  Pause,
  Square,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  Eye
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { toast } from '../../lib/toast';
import { renderJobs, renderClients, renderBilling, renderReports, renderContracts, renderDocuments, renderSettings } from './pages';

interface NowWorkOSProps {
  onSwitchModule: (module: string) => void;
}

type Page = 
  | 'staff-dashboard'
  | 'management-dashboard'
  | 'time-tracking'
  | 'jobs'
  | 'contracts'
  | 'billing'
  | 'clients'
  | 'documents'
  | 'reports'
  | 'settings';

type UserRole = 'staff' | 'manager' | 'admin' | 'client';

export function NowWorkOS({ onSwitchModule }: NowWorkOSProps) {
  const [currentPage, setCurrentPage] = useState<Page>('staff-dashboard');
  const [userRole, setUserRole] = useState<UserRole>('manager');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [showCreateContractForm, setShowCreateContractForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [clientViewMode, setClientViewMode] = useState<'list' | 'view' | 'edit'>('list');

  // Mock data
  const kpiData = {
    utilisation: 78.4,
    utilisationChange: 5.2,
    recovery: 92.1,
    recoveryChange: 3.1,
    realisation: 94.8,
    realisationChange: -1.2,
    avgMargin: 42.3,
    marginChange: 2.8,
    monthlyRevenue: 847000,
    revenueChange: 12.4,
    wipBalance: 324000,
    wipChange: -8.2,
    debtorBalance: 156000,
    debtorChange: -15.3,
    activeJobs: 47
  };

  const activeJobs = [
    { id: 'JOB-2024-047', client: 'Acme Corp', service: 'Annual Audit', status: 'in-progress', budget: 45000, actual: 32400, hours: 180, margin: 44.2, due: '2024-03-15', risk: 'low' },
    { id: 'JOB-2024-046', client: 'TechStart Pty', service: 'Tax Return', status: 'review', budget: 12000, actual: 11800, hours: 52, margin: 38.5, due: '2024-03-10', risk: 'medium' },
    { id: 'JOB-2024-045', client: 'Property Group', service: 'Advisory', status: 'in-progress', budget: 28000, actual: 31200, hours: 145, margin: 22.1, due: '2024-03-20', risk: 'high' },
    { id: 'JOB-2024-044', client: 'Retail Ltd', service: 'Compliance', status: 'planning', budget: 18000, actual: 3200, hours: 15, margin: 48.2, due: '2024-03-25', risk: 'low' }
  ];

  const recentTime = [
    { date: 'Today', client: 'Acme Corp', job: 'JOB-2024-047', task: 'Financial Statement Review', hours: 4.5, billable: true, status: 'pending' },
    { date: 'Today', client: 'TechStart Pty', job: 'JOB-2024-046', task: 'Tax Calculations', hours: 2.0, billable: true, status: 'pending' },
    { date: 'Yesterday', client: 'Property Group', job: 'JOB-2024-045', task: 'Strategy Meeting', hours: 1.5, billable: true, status: 'approved' },
    { date: 'Yesterday', client: 'Internal', job: 'Admin', task: 'Training', hours: 2.0, billable: false, status: 'approved' }
  ];

  const teamUtilisation = [
    { name: 'Sarah Chen', role: 'Senior', util: 87.2, recovery: 94.5, margin: 48.2, revenue: 145000, hours: 720 },
    { name: 'James Wilson', role: 'Manager', util: 82.1, recovery: 91.2, margin: 45.8, revenue: 168000, hours: 680 },
    { name: 'Emma Thompson', role: 'Associate', util: 75.4, recovery: 88.9, margin: 42.1, revenue: 98000, hours: 640 },
    { name: 'Michael Brown', role: 'Senior', util: 79.8, recovery: 93.1, margin: 46.5, revenue: 152000, hours: 710 }
  ];

  const navigationItems = [
    { id: 'staff-dashboard', label: 'My Workspace', icon: LayoutDashboard, roles: ['staff', 'manager', 'admin'] },
    { id: 'management-dashboard', label: 'Management', icon: BarChart3, roles: ['manager', 'admin'] },
    { id: 'time-tracking', label: 'Time Tracking', icon: Clock, roles: ['staff', 'manager', 'admin'] },
    { id: 'jobs', label: 'Jobs', icon: Briefcase, roles: ['staff', 'manager', 'admin'] },
    { id: 'contracts', label: 'Contracts', icon: FileCheck, roles: ['manager', 'admin'] },
    { id: 'billing', label: 'Billing', icon: DollarSign, roles: ['manager', 'admin'] },
    { id: 'clients', label: 'Clients', icon: Users, roles: ['staff', 'manager', 'admin'] },
    { id: 'documents', label: 'Documents', icon: FolderOpen, roles: ['staff', 'manager', 'admin'] },
    { id: 'reports', label: 'Reports', icon: FileText, roles: ['manager', 'admin'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['admin'] }
  ];

  const filteredNavItems = navigationItems.filter(item => 
    item.roles.includes(userRole)
  );

  const renderStaffDashboard = () => (
    <div className="space-y-6">
      {/* Today's Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Today's Hours</span>
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">6.5</p>
            <p className="text-xs text-gray-500 mt-1">Target: 7.5h</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Active Jobs</span>
              <Briefcase className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">8</p>
            <p className="text-xs text-gray-500 mt-1">3 due this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">This Week</span>
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">34.5</p>
            <p className="text-xs text-gray-500 mt-1">92% utilisation</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Tasks Due</span>
              <Target className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">12</p>
            <p className="text-xs text-red-600 mt-1">2 overdue</p>
          </CardContent>
        </Card>
      </div>

      {/* My Active Jobs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>My Active Jobs</CardTitle>
            <Button size="sm" onClick={() => setCurrentPage('jobs')}>View All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeJobs.map((job) => (
              <div 
                key={job.id}
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => toast.info(`Opening ${job.id}...`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-sm font-semibold text-gray-900">{job.id}</span>
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                        job.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                        job.status === 'review' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {job.status.toUpperCase()}
                      </span>
                      {job.risk === 'high' && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded">HIGH RISK</span>
                      )}
                    </div>
                    <h4 className="font-semibold text-gray-900">{job.client}</h4>
                    <p className="text-sm text-gray-600">{job.service}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">Due {job.due}</p>
                    <p className="text-xs text-gray-500 mt-1">{job.hours}h logged</p>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Budget Progress</span>
                    <span>${job.actual.toLocaleString()} / ${job.budget.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${job.actual > job.budget ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{ width: `${Math.min((job.actual / job.budget) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Margin: {job.margin}%</span>
                  <Button size="sm" variant="ghost" onClick={(e) => {
                    e.stopPropagation();
                    setCurrentPage('time-tracking');
                  }}>
                    <Timer className="w-4 h-4 mr-1" />
                    Log Time
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Time Entries */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Time Entries</CardTitle>
            <Button size="sm" variant="outline" onClick={() => setCurrentPage('time-tracking')}>
              <Clock className="w-4 h-4 mr-1" />
              Track Time
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentTime.map((entry, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-500">{entry.date}</span>
                    <span className="text-sm font-semibold text-gray-900">{entry.client}</span>
                    {entry.billable && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">BILLABLE</span>}
                  </div>
                  <p className="text-sm text-gray-600">{entry.task}</p>
                  <p className="text-xs text-gray-500 mt-1">{entry.job}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-900">{entry.hours}h</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    entry.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {entry.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderManagementDashboard = () => (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-semibold ${kpiData.utilisationChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp className="w-4 h-4" />
                {kpiData.utilisationChange}%
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Utilisation Rate</p>
            <p className="text-3xl font-bold text-gray-900">{kpiData.utilisation}%</p>
            <p className="text-xs text-gray-500 mt-2">Target: 75%</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-semibold ${kpiData.recoveryChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp className="w-4 h-4" />
                {kpiData.recoveryChange}%
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Recovery Rate</p>
            <p className="text-3xl font-bold text-gray-900">{kpiData.recovery}%</p>
            <p className="text-xs text-gray-500 mt-2">Target: 90%</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full -mr-16 -mt-16" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Percent className="w-6 h-6 text-purple-600" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-semibold ${kpiData.realisationChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp className="w-4 h-4" />
                {kpiData.realisationChange}%
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Realisation Rate</p>
            <p className="text-3xl font-bold text-gray-900">{kpiData.realisation}%</p>
            <p className="text-xs text-gray-500 mt-2">Target: 95%</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -mr-16 -mt-16" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-amber-600" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-semibold ${kpiData.marginChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp className="w-4 h-4" />
                {kpiData.marginChange}%
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Average Margin</p>
            <p className="text-3xl font-bold text-gray-900">{kpiData.avgMargin}%</p>
            <p className="text-xs text-gray-500 mt-2">Target: 40%</p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Monthly Revenue</span>
              <div className={`flex items-center gap-1 text-sm font-semibold ${kpiData.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp className="w-4 h-4" />
                {kpiData.revenueChange}%
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">${(kpiData.monthlyRevenue / 1000).toFixed(0)}K</p>
            <p className="text-xs text-gray-500 mt-2">vs last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">WIP Balance</span>
              <div className={`flex items-center gap-1 text-sm font-semibold ${kpiData.wipChange < 0 ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp className="w-4 h-4" />
                {Math.abs(kpiData.wipChange)}%
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">${(kpiData.wipBalance / 1000).toFixed(0)}K</p>
            <p className="text-xs text-gray-500 mt-2">Aging &lt; 60 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Debtors</span>
              <div className={`flex items-center gap-1 text-sm font-semibold ${kpiData.debtorChange < 0 ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp className="w-4 h-4" />
                {Math.abs(kpiData.debtorChange)}%
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">${(kpiData.debtorBalance / 1000).toFixed(0)}K</p>
            <p className="text-xs text-gray-500 mt-2">Average 28 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Team Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Team Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {teamUtilisation.map((member, idx) => (
              <div key={idx} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-blue-600 text-white">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-600">{member.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">${(member.revenue / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-gray-500">{member.hours}h logged</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Utilisation</p>
                    <p className="text-sm font-semibold text-gray-900">{member.util}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Recovery</p>
                    <p className="text-sm font-semibold text-gray-900">{member.recovery}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Margin</p>
                    <p className="text-sm font-semibold text-gray-900">{member.margin}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <span className={`text-xs font-semibold ${member.util >= 80 ? 'text-green-600' : member.util >= 65 ? 'text-amber-600' : 'text-red-600'}`}>
                      {member.util >= 80 ? 'Optimal' : member.util >= 65 ? 'On Track' : 'Low'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Jobs at Risk */}
      <Card>
        <CardHeader>
          <CardTitle>Jobs Requiring Attention</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeJobs.filter(j => j.risk === 'high' || j.actual > j.budget).map((job) => (
              <div 
                key={job.id}
                className="p-4 border border-red-200 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100 transition-colors"
                onClick={() => toast.warning(`Opening ${job.id}...`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <span className="font-mono text-sm font-semibold text-gray-900">{job.id}</span>
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded">OVER BUDGET</span>
                    </div>
                    <h4 className="font-semibold text-gray-900">{job.client} - {job.service}</h4>
                    <p className="text-sm text-red-700 mt-2">
                      Budget: ${job.budget.toLocaleString()} | Actual: ${job.actual.toLocaleString()} | 
                      Variance: +${(job.actual - job.budget).toLocaleString()} ({Math.round(((job.actual - job.budget) / job.budget) * 100)}%)
                    </p>
                  </div>
                  <Button size="sm" variant="outline" className="text-red-700 border-red-300">
                    Review
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTimeTracking = () => {
    return (
      <div className="space-y-6">
        {/* Live Timer Card */}
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-blue-600" />
              Live Timer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <p className="text-6xl font-bold text-blue-600 mb-2">
                {Math.floor(timerSeconds / 3600).toString().padStart(2, '0')}:
                {Math.floor((timerSeconds % 3600) / 60).toString().padStart(2, '0')}:
                {(timerSeconds % 60).toString().padStart(2, '0')}
              </p>
              <p className="text-sm text-gray-600">Hours : Minutes : Seconds</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Client / Job</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Select job...</option>
                  <option>Acme Corp - JOB-2024-047</option>
                  <option>TechStart Pty - JOB-2024-046</option>
                  <option>Property Group - JOB-2024-045</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Task Description</label>
                <input
                  type="text"
                  placeholder="What are you working on?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              {!timerRunning ? (
                <Button 
                  size="lg" 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setTimerRunning(true);
                    toast.success('Timer started!');
                  }}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Timer
                </Button>
              ) : (
                <>
                  <Button 
                    size="lg" 
                    className="bg-amber-600 hover:bg-amber-700"
                    onClick={() => {
                      setTimerRunning(false);
                      toast.info('Timer paused');
                    }}
                  >
                    <Pause className="w-5 h-5 mr-2" />
                    Pause
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => {
                      setTimerRunning(false);
                      setTimerSeconds(0);
                      toast.success('Time logged: ' + (timerSeconds / 3600).toFixed(2) + ' hours');
                    }}
                  >
                    <Square className="w-5 h-5 mr-2" />
                    Stop & Save
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Manual Entry */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-green-600" />
              Manual Time Entry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Client / Job</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Select job...</option>
                  <option>Acme Corp - JOB-2024-047</option>
                  <option>TechStart Pty - JOB-2024-046</option>
                  <option>Property Group - JOB-2024-045</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hours</label>
                <input
                  type="number"
                  step="0.25"
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Billable</option>
                  <option>Non-Billable</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Task Description</label>
              <textarea
                rows={2}
                placeholder="Describe what you worked on..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button 
              className="w-full"
              onClick={() => toast.success('Time entry saved!')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Time Entry
            </Button>
          </CardContent>
        </Card>

        {/* This Week's Timesheet */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>This Week's Timesheet</CardTitle>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
                <Button size="sm" variant="outline">
                  <Filter className="w-4 h-4 mr-1" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Client</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Job</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Task</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Hours</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Type</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentTime.map((entry, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{entry.date}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{entry.client}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 font-mono">{entry.job}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{entry.task}</td>
                      <td className="px-4 py-3 text-sm text-center font-semibold text-gray-900">{entry.hours}h</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${
                          entry.billable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {entry.billable ? 'Billable' : 'Non-Bill'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${
                          entry.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {entry.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={() => toast.info('Edit time entry')}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-600" onClick={() => toast.error('Delete time entry')}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={4} className="px-4 py-3 text-sm font-semibold text-gray-900">Total This Week</td>
                    <td className="px-4 py-3 text-sm text-center font-bold text-blue-600">34.5h</td>
                    <td colSpan={3} className="px-4 py-3 text-sm text-gray-600">28.5h Billable | 6h Non-Billable</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Total Hours</span>
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">34.5</p>
              <p className="text-xs text-green-600 mt-1">â†‘ 12% vs last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Billable</span>
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">28.5</p>
              <p className="text-xs text-gray-500 mt-1">82.6% of total</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Utilisation</span>
                <Activity className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">92%</p>
              <p className="text-xs text-green-600 mt-1">Above target</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Pending</span>
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">6.5</p>
              <p className="text-xs text-gray-500 mt-1">Needs approval</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderPageContent = () => {
    switch (currentPage) {
      case 'staff-dashboard':
        return renderStaffDashboard();
      case 'management-dashboard':
        return renderManagementDashboard();
      case 'time-tracking':
        return renderTimeTracking();
      case 'jobs':
        return renderJobs(activeJobs, setCurrentPage);
      case 'contracts':
        return renderContracts(showCreateContractForm, setShowCreateContractForm);
      case 'billing':
        return renderBilling(activeJobs);
      case 'clients':
        return renderClients(selectedClient, clientViewMode, setSelectedClient, setClientViewMode);
      case 'documents':
        return renderDocuments();
      case 'reports':
        return renderReports();
      case 'settings':
        return renderSettings();
      default:
        return renderStaffDashboard();
    }
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'staff-dashboard':
        return 'My Workspace';
      case 'management-dashboard':
        return 'Management Dashboard';
      case 'time-tracking':
        return 'Time Tracking';
      case 'jobs':
        return 'Jobs';
      case 'contracts':
        return 'Contracts';
      case 'billing':
        return 'Billing';
      case 'clients':
        return 'Clients';
      case 'documents':
        return 'Documents';
      case 'reports':
        return 'Reports';
      case 'settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 fixed w-full top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-600" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600" />
                )}
              </button>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Now Work</h1>
                  <p className="text-xs text-gray-500">Time & Revenue OS</p>
                </div>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Role Switcher */}
              <select
                value={userRole}
                onChange={(e) => {
                  setUserRole(e.target.value as UserRole);
                  if (e.target.value === 'staff') {
                    setCurrentPage('staff-dashboard');
                  } else if (e.target.value === 'manager') {
                    setCurrentPage('management-dashboard');
                  }
                }}
                className="px-3 py-2 border border-blue-300 rounded-lg text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="staff">ðŸ‘¤ Staff</option>
                <option value="manager">ðŸ“Š Manager</option>
                <option value="admin">âš™ï¸ Admin</option>
                <option value="client">ðŸ” Client</option>
              </select>

              {/* Module Selector */}
              <select
                value="nowwork"
                onChange={(e) => onSwitchModule(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="nowwork">Now Work OS</option>
                <option value="Grow MIP">Switch to Grow MIP</option>
                <option value="grow_accounting">Switch to Grow Accounting</option>
                <option value="pfa">Switch to PFA</option>
                <option value="imfo">Switch to IMFO</option>
                <option value="receivership">Switch to Receivership OS</option>
                <option value="onecore">Switch to OneCore CRM</option>
                <option value="document-manager">Switch to Document Manager</option>
              </select>

              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              
              <div className="flex items-center gap-3 pl-3 border-l">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">Michael Carter</p>
                  <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                </div>
                <Avatar>
                  <AvatarFallback className="bg-blue-600 text-white">MC</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Navigation */}
      <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-gray-900 text-white transition-transform duration-200 z-40 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <nav className="p-4 space-y-2">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id as Page);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 mt-16 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">{getPageTitle()}</h2>
            <p className="text-gray-600 text-sm mt-1">
              {currentPage === 'staff-dashboard' && 'Your personal workspace for jobs, time and tasks'}
              {currentPage === 'management-dashboard' && 'Real-time business performance and team metrics'}
              {currentPage === 'time-tracking' && 'Track billable and non-billable time'}
            </p>
          </div>

          {/* Page Content */}
          {renderPageContent()}
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}

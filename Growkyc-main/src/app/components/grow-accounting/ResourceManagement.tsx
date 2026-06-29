import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import {
  Users,
  Calendar,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  User,
  Briefcase,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Plus,
  Download,
  Filter
} from 'lucide-react';
import { WorkpaperLayout } from './WorkpaperLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface ResourceManagementProps {
  onNavigate?: (page: string) => void;
}

export function ResourceManagement({ onNavigate }: ResourceManagementProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('week');
  const [selectedView, setSelectedView] = useState<'team' | 'individual'>('team');

  // Team capacity data
  const teamMembers = [
    {
      id: 'TM-001',
      name: 'Sarah Johnson',
      role: 'Senior Accountant',
      avatar: 'SJ',
      capacity: 40,
      allocated: 38,
      available: 2,
      utilization: 95,
      status: 'optimal',
      activeJobs: 6,
      hoursThisWeek: 38,
      skills: ['SMSF', 'Tax', 'BAS']
    },
    {
      id: 'TM-002',
      name: 'Mike Brown',
      role: 'Accountant',
      avatar: 'MB',
      capacity: 40,
      allocated: 42,
      available: -2,
      utilization: 105,
      status: 'overallocated',
      activeJobs: 8,
      hoursThisWeek: 42,
      skills: ['Tax', 'Company', 'Trust']
    },
    {
      id: 'TM-003',
      name: 'Emily Davis',
      role: 'Junior Accountant',
      avatar: 'ED',
      capacity: 40,
      allocated: 28,
      available: 12,
      utilization: 70,
      status: 'underutilized',
      activeJobs: 4,
      hoursThisWeek: 28,
      skills: ['BAS', 'Bookkeeping', 'Payroll']
    },
    {
      id: 'TM-004',
      name: 'James Wilson',
      role: 'Senior Accountant',
      avatar: 'JW',
      capacity: 40,
      allocated: 36,
      available: 4,
      utilization: 90,
      status: 'optimal',
      activeJobs: 5,
      hoursThisWeek: 36,
      skills: ['SMSF', 'Audit', 'Financial Statements']
    },
    {
      id: 'TM-005',
      name: 'Lisa Chen',
      role: 'Accountant',
      avatar: 'LC',
      capacity: 40,
      allocated: 35,
      available: 5,
      utilization: 88,
      status: 'optimal',
      activeJobs: 6,
      hoursThisWeek: 35,
      skills: ['Tax', 'Individual', 'Partnership']
    }
  ];

  // Weekly capacity chart data
  const weeklyCapacityData = [
    { day: 'Mon', allocated: 180, capacity: 200, available: 20 },
    { day: 'Tue', allocated: 185, capacity: 200, available: 15 },
    { day: 'Wed', allocated: 195, capacity: 200, available: 5 },
    { day: 'Thu', allocated: 190, capacity: 200, available: 10 },
    { day: 'Fri', allocated: 175, capacity: 200, available: 25 }
  ];

  // Utilization by role data
  const utilizationByRoleData = [
    { role: 'Senior', utilization: 92 },
    { role: 'Accountant', utilization: 88 },
    { role: 'Junior', utilization: 70 }
  ];

  // Job type distribution
  const jobTypeData = [
    { name: 'Tax Returns', value: 35, color: '#2855a6' },
    { name: 'BAS', value: 25, color: '#10b981' },
    { name: 'SMSF', value: 20, color: '#f59e0b' },
    { name: 'Audit', value: 12, color: '#ef4444' },
    { name: 'Other', value: 8, color: '#8b5cf6' }
  ];

  // Team stats
  const teamStats = {
    totalCapacity: 200,
    totalAllocated: 179,
    totalAvailable: 21,
    avgUtilization: 89,
    overallocated: 1,
    underutilized: 1,
    optimal: 3
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-green-50 text-green-700 border-green-300';
      case 'overallocated': return 'bg-red-50 text-red-700 border-red-300';
      case 'underutilized': return 'bg-yellow-50 text-yellow-700 border-yellow-300';
      default: return 'bg-gray-50 text-gray-700 border-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'optimal': return 'Optimal';
      case 'overallocated': return 'Over Capacity';
      case 'underutilized': return 'Under Utilized';
      default: return status;
    }
  };

  return (
    <WorkpaperLayout currentPage="resources" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[32px] font-bold text-gray-900">Resource Management</h1>
            <p className="text-sm text-gray-600 mt-1">Team capacity planning and workload balancing</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="bg-[#2855a6] hover:bg-[#1e4089]">
              <Plus className="w-4 h-4 mr-2" />
              Assign Job
            </Button>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedPeriod === 'week'
                ? 'bg-[#2855a6] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedPeriod === 'month'
                ? 'bg-[#2855a6] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setSelectedPeriod('quarter')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedPeriod === 'quarter'
                ? 'bg-[#2855a6] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            This Quarter
          </button>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Team Capacity</p>
                  <p className="text-2xl font-bold text-gray-900">{teamStats.totalCapacity}h</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Allocated</p>
                  <p className="text-2xl font-bold text-gray-900">{teamStats.totalAllocated}h</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-gray-900">{teamStats.totalAvailable}h</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Avg Utilization</p>
                  <p className="text-2xl font-bold text-gray-900">{teamStats.avgUtilization}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Over Capacity</p>
                  <p className="text-2xl font-bold text-gray-900">{teamStats.overallocated}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-12 gap-6">
          {/* Weekly Capacity Chart */}
          <div className="col-span-8">
            <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Weekly Capacity Overview</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyCapacityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="capacity" fill="#e5e7eb" name="Total Capacity" />
                    <Bar dataKey="allocated" fill="#2855a6" name="Allocated Hours" />
                    <Bar dataKey="available" fill="#10b981" name="Available Hours" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Job Type Distribution */}
          <div className="col-span-4">
            <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Job Type Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RePieChart>
                    <Pie
                      data={jobTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name} ${entry.value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {jobTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Team Members */}
        <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Team Members</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedView('team')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedView === 'team'
                      ? 'bg-[#2855a6] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Team View
                </button>
                <button
                  onClick={() => setSelectedView('individual')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedView === 'individual'
                      ? 'bg-[#2855a6] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Individual View
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {teamMembers.map((member) => (
                <div key={member.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                        {member.avatar}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{member.name}</h4>
                        <p className="text-sm text-gray-600">{member.role}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded border ${getStatusColor(member.status)}`}>
                      {getStatusLabel(member.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-4 mb-3">
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">Capacity</p>
                      <p className="text-lg font-bold text-gray-900">{member.capacity}h</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">Allocated</p>
                      <p className="text-lg font-bold text-blue-600">{member.allocated}h</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">Available</p>
                      <p className={`text-lg font-bold ${member.available < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {member.available}h
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">Utilization</p>
                      <p className="text-lg font-bold text-gray-900">{member.utilization}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">Active Jobs</p>
                      <p className="text-lg font-bold text-gray-900">{member.activeJobs}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-600">Capacity Utilization</span>
                    <span className="text-xs font-semibold text-gray-900">{member.utilization}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${
                        member.utilization > 100 ? 'bg-red-600' :
                        member.utilization > 90 ? 'bg-[#2855a6]' :
                        member.utilization > 70 ? 'bg-green-600' :
                        'bg-yellow-600'
                      }`}
                      style={{ width: `${Math.min(member.utilization, 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs text-gray-600">Skills:</span>
                    {member.skills.map((skill, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Utilization by Role */}
        <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Utilization by Role</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={utilizationByRoleData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="role" type="category" />
                <Tooltip />
                <Bar dataKey="utilization" fill="#2855a6" name="Utilization %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </WorkpaperLayout>
  );
}

import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  BarChart3,
  Plus,
  Download,
  Share2,
  Filter,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  Activity,
  PieChart,
  LineChart
} from 'lucide-react';

interface ReportsModuleProps {
  role: string;
}

export function ReportsModule({ role }: ReportsModuleProps) {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Reports & Analytics</h1>
          <p className="text-slate-300 mt-1">Custom dashboards and business intelligence</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Last 30 Days
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Report
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-slate-300">Total Revenue</p>
            <DollarSign className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-slate-100">$324.5K</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400 font-medium">+18.2%</span>
            <span className="text-xs text-slate-400">vs last period</span>
          </div>
        </div>

        <div className="bg-white border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-slate-300">New Customers</p>
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-slate-100">142</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400 font-medium">+12.5%</span>
            <span className="text-xs text-slate-400">vs last period</span>
          </div>
        </div>

        <div className="bg-white border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-slate-300">Conversion Rate</p>
            <Target className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-slate-100">24.8%</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingDown className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-400 font-medium">-2.1%</span>
            <span className="text-xs text-slate-400">vs last period</span>
          </div>
        </div>

        <div className="bg-white border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-slate-300">Avg Deal Size</p>
            <BarChart3 className="w-5 h-5 text-orange-400" />
          </div>
          <p className="text-3xl font-bold text-slate-100">$23.4K</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400 font-medium">+8.7%</span>
            <span className="text-xs text-slate-400">vs last period</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-100">Revenue Trend</h3>
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {[65, 78, 72, 85, 92, 88, 95, 89, 98, 94, 102, 108].map((value, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-indigo-600 rounded-t hover:bg-indigo-700 transition-colors cursor-pointer"
                  style={{ height: `${value}%` }}
                />
                <span className="text-xs text-slate-400">{idx + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-100">Lead Sources</h3>
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {[
              { source: 'Website Form', count: 145, percentage: 35, color: 'bg-blue-600' },
              { source: 'Referrals', count: 98, percentage: 24, color: 'bg-purple-600' },
              { source: 'Social Media', count: 87, percentage: 21, color: 'bg-pink-600' },
              { source: 'Cold Outreach', count: 52, percentage: 13, color: 'bg-indigo-600' },
              { source: 'Events', count: 28, percentage: 7, color: 'bg-cyan-600' }
            ].map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-100">{item.source}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-300">{item.count} leads</span>
                    <span className="font-semibold text-slate-100">{item.percentage}%</span>
                  </div>
                </div>
                <div className="h-2 bg-white/10 rounded-full">
                  <div
                    className={`h-2 ${item.color} rounded-full`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-100">Sales Pipeline</h3>
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {[
              { stage: 'Prospecting', deals: 24, value: 245000, color: 'bg-blue-600' },
              { stage: 'Qualification', deals: 18, value: 198000, color: 'bg-indigo-600' },
              { stage: 'Proposal', deals: 12, value: 285000, color: 'bg-purple-600' },
              { stage: 'Negotiation', deals: 8, value: 176000, color: 'bg-pink-600' },
              { stage: 'Closing', deals: 5, value: 124000, color: 'bg-green-600' }
            ].map((stage, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-100">{stage.stage}</span>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-100">${(stage.value / 1000).toFixed(0)}K</p>
                      <p className="text-xs text-slate-400">{stage.deals} deals</p>
                    </div>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full">
                    <div className={`h-2 ${stage.color} rounded-full`} style={{ width: `${(stage.value / 285000) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-100">Team Performance</h3>
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {[
              { name: 'Jessica Martinez', deals: 28, revenue: 234000, quota: 95 },
              { name: 'Michael Brown', deals: 24, revenue: 198000, quota: 88 },
              { name: 'Sarah Wilson', deals: 19, revenue: 156000, quota: 78 },
              { name: 'David Chen', deals: 16, revenue: 145000, quota: 72 },
              { name: 'Amanda Lopez', deals: 12, revenue: 98000, quota: 65 }
            ].map((member, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/15 flex items-center justify-center">
                      <span className="text-xs font-semibold text-indigo-400">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-100">{member.name}</p>
                      <p className="text-xs text-slate-400">{member.deals} deals • ${(member.revenue / 1000).toFixed(0)}K</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-slate-100">{member.quota}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full">
                  <div
                    className={`h-2 rounded-full ${
                      member.quota >= 90 ? 'bg-green-600' :
                      member.quota >= 75 ? 'bg-blue-600' : 'bg-yellow-600'
                    }`}
                    style={{ width: `${member.quota}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Download,
  Clock,
  AlertCircle,
  CheckCircle,
  User,
  Briefcase
} from 'lucide-react';
import { WorkpaperLayout } from './WorkpaperLayout';

interface CalendarProps {
  onNavigate?: (page: string) => void;
}

interface DeadlineItem {
  id: string;
  title: string;
  client: string;
  type: 'BAS' | 'Tax Return' | 'SMSF' | 'Meeting' | 'Review' | 'Lodgement';
  dueDate: string;
  assignee: string;
  status: 'overdue' | 'due-soon' | 'upcoming' | 'completed';
  priority: 'high' | 'medium' | 'low';
}

export function CalendarView({ onNavigate }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 1, 14)); // Feb 14, 2024
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  const deadlines: DeadlineItem[] = [
    { id: 'D001', title: 'Q2 2024 BAS', client: 'Smith SMSF', type: 'BAS', dueDate: '2024-02-18', assignee: 'Sarah Johnson', status: 'due-soon', priority: 'high' },
    { id: 'D002', title: 'Jan 2024 BAS', client: 'ABC Pty Ltd', type: 'BAS', dueDate: '2024-02-21', assignee: 'Mike Brown', status: 'due-soon', priority: 'high' },
    { id: 'D003', title: 'EOFY 2023 Tax Return', client: 'XYZ Trust', type: 'Tax Return', dueDate: '2024-02-15', assignee: 'Emily Davis', status: 'overdue', priority: 'high' },
    { id: 'D004', title: 'Annual Compliance', client: 'Wilson SMSF', type: 'SMSF', dueDate: '2024-02-28', assignee: 'Tom Wilson', status: 'upcoming', priority: 'medium' },
    { id: 'D005', title: 'Client Tax Planning Meeting', client: 'Brown Individual', type: 'Meeting', dueDate: '2024-02-16', assignee: 'Sarah Johnson', status: 'upcoming', priority: 'medium' },
    { id: 'D006', title: 'Partner Review', client: 'Johnson & Co', type: 'Review', dueDate: '2024-02-19', assignee: 'Mike Brown', status: 'upcoming', priority: 'high' },
    { id: 'D007', title: 'Dec 2023 BAS Lodgement', client: 'Green Family Trust', type: 'Lodgement', dueDate: '2024-02-21', assignee: 'Emily Davis', status: 'upcoming', priority: 'medium' },
    { id: 'D008', title: 'Q1 2024 BAS', client: 'Anderson Pty Ltd', type: 'BAS', dueDate: '2024-02-25', assignee: 'Tom Wilson', status: 'upcoming', priority: 'medium' },
    { id: 'D009', title: 'SMSF Audit', client: 'Taylor SMSF', type: 'SMSF', dueDate: '2024-03-05', assignee: 'Sarah Johnson', status: 'upcoming', priority: 'low' },
    { id: 'D010', title: 'FY2023 Financial Statements', client: 'White Industries', type: 'Review', dueDate: '2024-02-29', assignee: 'Mike Brown', status: 'upcoming', priority: 'high' },
    { id: 'D011', title: 'Q3 2023 BAS', client: 'Harris Trust', type: 'BAS', dueDate: '2024-02-12', assignee: 'Emily Davis', status: 'overdue', priority: 'high' },
    { id: 'D012', title: 'Tax Return 2023', client: 'Martin Individual', type: 'Tax Return', dueDate: '2024-03-01', assignee: 'Tom Wilson', status: 'upcoming', priority: 'medium' }
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  const getDeadlinesForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return deadlines.filter(d => d.dueDate === dateStr);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue': return 'bg-red-500/15 text-red-300 border-red-300';
      case 'due-soon': return 'bg-orange-500/15 text-orange-300 border-orange-300';
      case 'upcoming': return 'bg-blue-500/15 text-blue-300 border-blue-300';
      case 'completed': return 'bg-green-500/15 text-green-300 border-green-300';
      default: return 'bg-white/5 text-slate-300 border-white/10';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'BAS': return 'bg-purple-500/10 text-purple-300';
      case 'Tax Return': return 'bg-blue-500/10 text-blue-300';
      case 'SMSF': return 'bg-green-500/10 text-green-300';
      case 'Meeting': return 'bg-orange-500/10 text-orange-300';
      case 'Review': return 'bg-pink-500/10 text-pink-300';
      case 'Lodgement': return 'bg-indigo-500/10 text-indigo-300';
      default: return 'bg-white/5 text-slate-300';
    }
  };

  const stats = {
    overdue: deadlines.filter(d => d.status === 'overdue').length,
    dueSoon: deadlines.filter(d => d.status === 'due-soon').length,
    upcoming: deadlines.filter(d => d.status === 'upcoming').length,
    total: deadlines.length
  };

  return (
    <WorkpaperLayout currentPage="calendar" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[32px] font-bold text-slate-100">Calendar & Deadlines</h1>
            <p className="text-sm text-slate-300 mt-1">Manage job deadlines and important dates</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="bg-[#2855a6] hover:bg-[#1e4089]">
              <Plus className="w-4 h-4 mr-2" />
              Add Deadline
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-500/10 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-300">Overdue</p>
                  <p className="text-2xl font-bold text-red-400">{stats.overdue}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-500/10 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-300">Due Soon</p>
                  <p className="text-2xl font-bold text-orange-400">{stats.dueSoon}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <CalendarIcon className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-300">Upcoming</p>
                  <p className="text-2xl font-bold text-blue-400">{stats.upcoming}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <Briefcase className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-300">Total</p>
                  <p className="text-2xl font-bold text-slate-100">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Calendar */}
          <div className="col-span-8">
            <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
              <CardContent className="p-6">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold text-slate-100">
                      {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCurrentDate(new Date())}
                      >
                        Today
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant={viewMode === 'month' ? 'default' : 'outline'}
                      onClick={() => setViewMode('month')}
                    >
                      Month
                    </Button>
                    <Button
                      size="sm"
                      variant={viewMode === 'week' ? 'default' : 'outline'}
                      onClick={() => setViewMode('week')}
                    >
                      Week
                    </Button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {/* Day Headers */}
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-semibold text-sm text-slate-300 py-2">
                      {day}
                    </div>
                  ))}

                  {/* Empty cells for days before month starts */}
                  {Array.from({ length: firstDay }).map((_, idx) => (
                    <div key={`empty-${idx}`} className="aspect-square border border-white/10 rounded-lg bg-white/5" />
                  ))}

                  {/* Days of month */}
                  {Array.from({ length: daysInMonth }).map((_, idx) => {
                    const day = idx + 1;
                    const dayDeadlines = getDeadlinesForDate(day);
                    const isToday = day === 14; // Mock today

                    return (
                      <div
                        key={day}
                        className={`aspect-square border rounded-lg p-2 ${
                          isToday ? 'border-2 border-[#2855a6] bg-blue-500/10' : 'border-white/10'
                        } hover:bg-white/5 cursor-pointer`}
                      >
                        <div className={`text-sm font-semibold mb-1 ${
                          isToday ? 'text-[#2855a6]' : 'text-slate-100'
                        }`}>
                          {day}
                        </div>
                        <div className="space-y-1">
                          {dayDeadlines.slice(0, 2).map((deadline) => (
                            <div
                              key={deadline.id}
                              className={`text-xs px-1 py-0.5 rounded truncate ${getStatusColor(deadline.status)}`}
                              title={deadline.title}
                            >
                              {deadline.title}
                            </div>
                          ))}
                          {dayDeadlines.length > 2 && (
                            <div className="text-xs text-slate-300 px-1">
                              +{dayDeadlines.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Deadlines List */}
          <div className="col-span-4">
            <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-100">Upcoming Deadlines</h3>
                  <Button size="sm" variant="outline">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {deadlines
                    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                    .map((deadline) => (
                      <div
                        key={deadline.id}
                        className={`p-3 rounded-lg border-l-4 ${
                          deadline.status === 'overdue' ? 'border-red-500 bg-red-500/10' :
                          deadline.status === 'due-soon' ? 'border-orange-500 bg-orange-500/10' :
                          'border-blue-500 bg-blue-500/10'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm text-slate-100 mb-1">{deadline.title}</h4>
                            <p className="text-xs text-slate-300">{deadline.client}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-semibold rounded ${getTypeColor(deadline.type)}`}>
                            {deadline.type}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-300">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{deadline.dueDate}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{deadline.assignee}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </WorkpaperLayout>
  );
}

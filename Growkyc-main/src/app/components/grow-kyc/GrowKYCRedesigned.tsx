import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import {
  Shield,
  Users,
  FileText,
  Activity,
  Search,
  Plus,
  Sparkles,
  Home,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Zap,
  Upload,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Filter,
  Download,
  Mail,
  Phone,
  MapPin,
  Building2,
  X,
  ArrowRight,
  Command,
  ChevronRight,
  Star,
  Bell,
  Settings,
  HelpCircle,
  PlayCircle,
  BarChart3,
  Target,
  Globe,
  Lock,
  Unlock,
  Copy,
  ExternalLink,
  RefreshCw,
  Calendar,
  Clipboard,
  CheckSquare,
  XCircle
} from 'lucide-react';
import { toast } from '../../lib/toast';

interface GrowKYCRedesignedProps {
  onBack?: () => void;
}

type View = 'dashboard' | 'clients' | 'onboarding' | 'monitoring' | 'reports' | 'settings';

export function GrowKYCRedesigned({ onBack }: GrowKYCRedesignedProps) {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  
  // Quick stats for dashboard
  const stats = {
    totalClients: 1842,
    pendingVerification: 23,
    activeMonitoring: 1789,
    flaggedCases: 8,
    completedToday: 12,
    avgProcessingTime: '4.2 mins'
  };

  // Recent activity
  const recentActivity = [
    {
      id: '1',
      type: 'client_added',
      client: 'Sarah Johnson',
      action: 'Client onboarded',
      time: '2 mins ago',
      status: 'success'
    },
    {
      id: '2',
      type: 'verification_complete',
      client: 'Acme Corp Pty Ltd',
      action: 'Verification complete',
      time: '15 mins ago',
      status: 'success'
    },
    {
      id: '3',
      type: 'review_required',
      client: 'Global Investment Fund',
      action: 'Enhanced DD required',
      time: '1 hour ago',
      status: 'warning'
    },
    {
      id: '4',
      type: 'monitoring_alert',
      client: 'Tech Ventures Ltd',
      action: 'PEP match detected',
      time: '2 hours ago',
      status: 'alert'
    }
  ];

  // Quick actions
  const quickActions = [
    { 
      id: 'add_individual', 
      label: 'Add Individual', 
      icon: Users, 
      color: 'bg-blue-500',
      description: 'Onboard a new individual client'
    },
    { 
      id: 'add_company', 
      label: 'Add Company', 
      icon: Building2, 
      color: 'bg-purple-500',
      description: 'Onboard a new company'
    },
    { 
      id: 'run_screening', 
      label: 'Run Screening', 
      icon: Shield, 
      color: 'bg-green-500',
      description: 'Screen existing client'
    },
    { 
      id: 'generate_report', 
      label: 'Generate Report', 
      icon: FileText, 
      color: 'bg-orange-500',
      description: 'Create compliance report'
    }
  ];

  // Pending tasks
  const pendingTasks = [
    {
      id: '1',
      title: 'Review Enhanced DD for Global Investment Fund',
      priority: 'high',
      dueDate: 'Today',
      client: 'Global Investment Fund',
      type: 'Enhanced DD'
    },
    {
      id: '2',
      title: 'Verify PEP match for Tech Ventures Ltd',
      priority: 'high',
      dueDate: 'Today',
      client: 'Tech Ventures Ltd',
      type: 'PEP Verification'
    },
    {
      id: '3',
      title: 'Annual refresh for 12 clients',
      priority: 'medium',
      dueDate: 'This week',
      client: '12 clients',
      type: 'Annual Refresh'
    },
    {
      id: '4',
      title: 'Document expiry for 5 clients',
      priority: 'medium',
      dueDate: 'Next week',
      client: '5 clients',
      type: 'Document Expiry'
    }
  ];

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('global-search')?.focus();
      }
      // Cmd/Ctrl + N for new client
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        setShowQuickAdd(true);
      }
      // ? for help
      if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setShowHelp(!showHelp);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showHelp]);

  const handleQuickAction = (actionId: string) => {
    setShowQuickAdd(false);
    toast.success(`Starting: ${quickActions.find(a => a.id === actionId)?.label}`);
    if (actionId === 'add_individual' || actionId === 'add_company') {
      setCurrentView('onboarding');
    }
  };

  // Tour steps
  const tourSteps = [
    {
      target: 'navigation',
      title: 'Welcome to Grow KYC! 👋',
      description: 'Navigate between Dashboard, Clients, Onboarding, Monitoring, and Reports with one click.'
    },
    {
      target: 'quick-add',
      title: 'Quick Add ⚡',
      description: 'Add new clients, run screenings, or generate reports instantly. Press Cmd+N anytime!'
    },
    {
      target: 'search',
      title: 'Global Search 🔍',
      description: 'Search anything - clients, cases, documents. Press Cmd+K for instant access.'
    },
    {
      target: 'stats',
      title: 'Live Stats 📊',
      description: 'Real-time overview of your compliance operations at a glance.'
    },
    {
      target: 'tasks',
      title: 'Your Tasks ✅',
      description: 'Prioritized to-do list keeps you focused on what matters most.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Navigation Bar - Modern & Clean */}
      <div className="bg-[#0d121d] border-b border-white/10 shadow-sm sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Branding */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#13B5EA] to-[#0E7C9E] rounded-xl flex items-center justify-center shadow-md">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Grow KYC</h1>
                  <p className="text-xs text-slate-400">Compliance Made Simple</p>
                </div>
              </div>

              {/* Main Navigation - Horizontal Pills */}
              <div className="hidden md:flex items-center gap-2 ml-8" id="navigation">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: Home },
                  { id: 'clients', label: 'Clients', icon: Users },
                  { id: 'onboarding', label: 'Onboarding', icon: Plus },
                  { id: 'monitoring', label: 'Monitoring', icon: Activity },
                  { id: 'reports', label: 'Reports', icon: BarChart3 }
                ].map((nav) => {
                  const NavIcon = nav.icon;
                  const isActive = currentView === nav.id;
                  return (
                    <button
                      key={nav.id}
                      onClick={() => setCurrentView(nav.id as View)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-[#13B5EA] to-[#0E7C9E] text-white shadow-lg scale-105'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <NavIcon className="w-4 h-4" />
                      {nav.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Global Search with Keyboard Shortcut */}
              <div className="relative" id="search">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="global-search"
                  type="text"
                  placeholder="Search anything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-16 py-2 w-64 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#13B5EA] focus:border-transparent"
                />
                <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 px-2 py-1 text-xs bg-[#0a0e17] text-slate-300 rounded border border-gray-300">
                  ⌘K
                </kbd>
              </div>

              {/* Quick Add Button */}
              <div className="relative" id="quick-add">
                <Button
                  onClick={() => setShowQuickAdd(!showQuickAdd)}
                  className="bg-gradient-to-r from-[#13B5EA] to-[#0E7C9E] hover:from-[#0E7C9E] hover:to-[#13B5EA] text-white shadow-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Quick Add
                  <kbd className="ml-2 px-2 py-0.5 text-xs bg-white/20 rounded">⌘N</kbd>
                </Button>

                {/* Quick Add Dropdown */}
                {showQuickAdd && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowQuickAdd(false)}
                    />
                    <Card className="absolute right-0 mt-2 w-80 z-50 shadow-2xl border-2 animate-in fade-in slide-in-from-top-2">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Quick Actions</CardTitle>
                        <CardDescription className="text-xs">Start a new task instantly</CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        {quickActions.map((action) => {
                          const ActionIcon = action.icon;
                          return (
                            <button
                              key={action.id}
                              onClick={() => handleQuickAction(action.id)}
                              className="w-full text-left p-4 hover:bg-white/5 transition-colors border-b last:border-b-0"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                                  <ActionIcon className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-semibold text-white text-sm">{action.label}</div>
                                  <div className="text-xs text-slate-400">{action.description}</div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                              </div>
                            </button>
                          );
                        })}
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>

              {/* Help & Tour */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowTour(true)}
                className="text-slate-300 hover:text-white"
                title="Take a tour"
              >
                <HelpCircle className="w-5 h-5" />
              </Button>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-300 hover:text-white relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>

              {/* Settings */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentView('settings')}
                className="text-slate-300 hover:text-white"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6">
        {currentView === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            {/* Welcome Banner */}
            <Card className="bg-gradient-to-r from-[#13B5EA] to-[#0E7C9E] text-white border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Welcome back! 👋</h2>
                    <p className="text-white/90">You have {stats.pendingVerification} clients pending verification and {stats.flaggedCases} flagged cases to review.</p>
                  </div>
                  <Button
                    onClick={() => setCurrentView('onboarding')}
                    className="bg-[#0d121d] text-[#13B5EA] hover:bg-white/90 shadow-lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Client
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid - Beautiful Cards */}
            <div className="grid grid-cols-6 gap-4" id="stats">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-[#13B5EA]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stats.totalClients.toLocaleString()}</div>
                  <div className="text-sm text-slate-300">Total Clients</div>
                  <div className="text-xs text-green-600 mt-2">↑ 12% this month</div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-amber-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-amber-600" />
                    </div>
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stats.pendingVerification}</div>
                  <div className="text-sm text-slate-300">Pending</div>
                  <div className="text-xs text-amber-600 mt-2">Needs review</div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-green-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Activity className="w-6 h-6 text-green-600" />
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stats.activeMonitoring.toLocaleString()}</div>
                  <div className="text-sm text-slate-300">Active Monitoring</div>
                  <div className="text-xs text-green-600 mt-2">All clear</div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-red-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-red-600" />
                    </div>
                    <XCircle className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stats.flaggedCases}</div>
                  <div className="text-sm text-slate-300">Flagged Cases</div>
                  <div className="text-xs text-red-600 mt-2">Requires action</div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-purple-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <CheckSquare className="w-6 h-6 text-purple-600" />
                    </div>
                    <Sparkles className="w-5 h-5 text-purple-500" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stats.completedToday}</div>
                  <div className="text-sm text-slate-300">Completed Today</div>
                  <div className="text-xs text-purple-600 mt-2">Great progress!</div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-indigo-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-indigo-600" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stats.avgProcessingTime}</div>
                  <div className="text-sm text-slate-300">Avg Processing</div>
                  <div className="text-xs text-green-600 mt-2">↓ 15% faster</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Pending Tasks - Left Column */}
              <div className="col-span-2">
                <Card id="tasks">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Your Tasks</CardTitle>
                        <CardDescription>Prioritized by urgency and importance</CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {pendingTasks.map((task) => (
                        <div
                          key={task.id}
                          className="p-4 bg-[#0a0e17] rounded-xl hover:bg-white/5 transition-colors cursor-pointer border-2 border-transparent hover:border-[#13B5EA]"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className={
                                  task.priority === 'high' ? 'bg-red-500 text-white' :
                                  task.priority === 'medium' ? 'bg-amber-500 text-white' :
                                  'bg-blue-500 text-white'
                                }>
                                  {task.priority.toUpperCase()}
                                </Badge>
                                <Badge variant="outline">{task.type}</Badge>
                              </div>
                              <h4 className="font-semibold text-white mb-1">{task.title}</h4>
                              <div className="flex items-center gap-4 text-xs text-slate-300">
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {task.client}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {task.dueDate}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" className="bg-[#13B5EA] hover:bg-[#0E7C9E] text-white">
                                Review
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity - Right Column */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Live updates from your team</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          activity.status === 'success' ? 'bg-green-100' :
                          activity.status === 'warning' ? 'bg-amber-100' :
                          'bg-red-100'
                        }`}>
                          {activity.status === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
                          {activity.status === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                          {activity.status === 'alert' && <Shield className="w-4 h-4 text-red-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white">{activity.client}</p>
                          <p className="text-xs text-slate-300">{activity.action}</p>
                          <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Other views will show appropriate content */}
        {currentView !== 'dashboard' && (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-24 h-24 bg-[#0a0e17] rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {currentView.charAt(0).toUpperCase() + currentView.slice(1)} View
              </h3>
              <p className="text-slate-300">This view is being redesigned with an amazing UX!</p>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Tour Overlay */}
      {showTour && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full shadow-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {tourSteps[tourStep].title}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowTour(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-6">{tourSteps[tourStep].description}</p>
              
              <div className="flex items-center gap-2 mb-4">
                {tourSteps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 flex-1 rounded-full ${
                      idx === tourStep ? 'bg-[#13B5EA]' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setShowTour(false)}
                >
                  Skip Tour
                </Button>
                <div className="flex gap-2">
                  {tourStep > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => setTourStep(tourStep - 1)}
                    >
                      Previous
                    </Button>
                  )}
                  {tourStep < tourSteps.length - 1 ? (
                    <Button
                      className="bg-[#13B5EA] hover:bg-[#0E7C9E] text-white"
                      onClick={() => setTourStep(tourStep + 1)}
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => setShowTour(false)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Got it!
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Keyboard Shortcuts Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full shadow-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Keyboard Shortcuts</CardTitle>
                  <CardDescription>Work faster with these shortcuts</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowHelp(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { keys: ['⌘', 'K'], description: 'Global search' },
                  { keys: ['⌘', 'N'], description: 'Quick add new client' },
                  { keys: ['?'], description: 'Show keyboard shortcuts' },
                  { keys: ['Esc'], description: 'Close modals' },
                  { keys: ['⌘', 'S'], description: 'Save current work' },
                  { keys: ['⌘', 'F'], description: 'Filter current view' }
                ].map((shortcut, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-[#0a0e17] rounded-lg">
                    <span className="text-sm text-slate-300">{shortcut.description}</span>
                    <div className="flex gap-1">
                      {shortcut.keys.map((key, keyIdx) => (
                        <kbd
                          key={keyIdx}
                          className="px-3 py-1 text-sm bg-[#0d121d] text-slate-300 rounded border-2 border-gray-300 font-mono"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

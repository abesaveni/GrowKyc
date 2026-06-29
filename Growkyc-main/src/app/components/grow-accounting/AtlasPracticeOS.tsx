import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Home, Users, Briefcase, FolderOpen, Workflow, TrendingUp,
  Shield, DollarSign, Zap, BarChart3, Settings, Bell,
  Search, Plus, Filter, Download, Upload, Eye, Edit, Trash2,
  MoreVertical, Calendar, Clock, AlertTriangle, CheckCircle,
  XCircle, AlertCircle, User, Building2, FileText, Award,
  Target, Activity, TrendingDown, ArrowRight, ChevronDown,
  X, Check, Sparkles, Brain, MessageSquare, Send, Phone,
  Mail, FileSignature, CreditCard, RefreshCw, PlayCircle,
  PauseCircle, StopCircle, Flag, Star, ThumbsUp, ThumbsDown,
  HelpCircle, Network, ChevronRight, Maximize2, Minimize2,
  Layout, List, Grid, Move, Copy, Archive, Layers, Percent,
  TrendingUpIcon, AlertOctagon, Info, ExternalLink, Bookmark,
  BookmarkCheck, UserCheck, UserX, Clock3, Timer, Repeat,
  RotateCcw, FastForward, CircleDot, MousePointerClick,
  Gauge, Box, Package, FileCheck, FileClock, FileWarning,
  SlidersHorizontal, ArrowUpDown, ArrowUp, ArrowDown, FilterX,
  Save, Share2, Link2, Code, Database, CloudUpload, CloudDownload,
  Printer, File, Inbox, Send as SendIcon,
  Loader2, CheckCircle2, XCircle as XCircleIcon, Lightbulb,
  Rocket, Waypoints, Crosshair, GitBranch, PieChart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Skeleton } from '../ui/skeleton';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { toast } from 'sonner';
import { UltimateDocumentManager } from '../document-manager/UltimateDocumentManager';
import { ClientManagementHub } from '../onboarding/ClientManagementHub';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

type View = 
  | 'dashboard'
  | 'clients'
  | 'jobs'
  | 'documents'
  | 'document-vault'
  | 'enterprise-hub'
  | 'workflow'
  | 'capacity'
  | 'compliance'
  | 'billing'
  | 'automation'
  | 'reports'
  | 'client-portal'
  | 'settings';

type UserRole = 'partner' | 'reviewer' | 'processor' | 'admin' | 'client';

type JobStatus = 'in-progress' | 'waiting' | 'review' | 'complete' | 'blocked';

type Priority = 'critical' | 'high' | 'medium' | 'low';

interface AtlasPracticeOSProps {
  userRole?: UserRole;
  onNavigate?: (page: string) => void;
}

interface Client {
  id: number;
  name: string;
  type: string;
  entities: number;
  activeJobs: number;
  riskScore: number;
  lastContact: string;
  outstandingDocs: number;
  annualFee: number;
  status: string;
  manager: string;
  email?: string;
  phone?: string;
  nextReview?: string;
  compliance?: string;
  tags?: string[];
}

interface Job {
  id: string;
  client: string;
  entity: string;
  service: string;
  stage: string;
  assignedTo: string;
  dueDate: string;
  riskScore: number;
  budget: number;
  actual: number;
  status: JobStatus;
  priority?: Priority;
  estimatedCompletion?: number;
  dependencies?: string[];
}

interface Document {
  id: number;
  name: string;
  client: string;
  entity: string;
  year: number;
  category: string;
  uploadedBy: string;
  date: string;
  version: number;
  classification: string;
  size?: string;
  tags?: string[];
}

interface StaffMember {
  id: number;
  name: string;
  role: string;
  currentJobs: number;
  capacity: number;
  hoursThisWeek: number;
  riskJobs: number;
  utilization: number;
  avatar?: string;
  skills?: string[];
  available?: boolean;
}

export function AtlasPracticeOS({ userRole = 'partner', onNavigate }: AtlasPracticeOSProps) {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [jobSearchQuery, setJobSearchQuery] = useState('');
  const [documentSearchQuery, setDocumentSearchQuery] = useState('');
  const [aiQuery, setAiQuery] = useState('');
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [jobViewMode, setJobViewMode] = useState<'table' | 'kanban' | 'calendar'>('kanban');
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [selectedClients, setSelectedClients] = useState<number[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [aiMessages, setAiMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [notifications, setNotifications] = useState<Array<{ id: number; title: string; message: string; type: string; time: string }>>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
      if (e.key === 'Escape') {
        setShowCommandPalette(false);
        setShowAIPanel(false);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Mock data
  const dashboardMetrics = {
    openJobs: 847,
    dueThisWeek: 124,
    waitingOnClient: 312,
    riskAlerts: 23,
    revenueForecast: 1847250,
    staffUtilization: 78,
    aiTimeSaved: 1240,
    completedThisMonth: 456,
    clientSatisfaction: 94,
    avgResponseTime: 2.3,
    revenueThisMonth: 456789,
    revenueGrowth: 12.5
  };

  const clients: Client[] = [
    { id: 1, name: 'Acme Pty Ltd', type: 'Company', entities: 3, activeJobs: 5, riskScore: 85, lastContact: '2 days ago', outstandingDocs: 2, annualFee: 25000, status: 'Active', manager: 'Sarah Chen', email: 'contact@acme.com.au', phone: '02 9876 5432', nextReview: '2026-04-15', compliance: 'Current', tags: ['Manufacturing', 'ASX Listed'] },
    { id: 2, name: 'Smith Family Trust', type: 'Trust', entities: 2, activeJobs: 3, riskScore: 92, lastContact: '1 week ago', outstandingDocs: 0, annualFee: 18500, status: 'Active', manager: 'John Davis', email: 'smith@trust.com.au', phone: '02 8765 4321', nextReview: '2026-05-20', compliance: 'Current', tags: ['Property', 'High Net Worth'] },
    { id: 3, name: 'Jones Super Fund', type: 'SMSF', entities: 1, activeJobs: 2, riskScore: 45, lastContact: '3 weeks ago', outstandingDocs: 5, annualFee: 3500, status: 'At Risk', manager: 'Emma Wilson', email: 'jones@smsf.com.au', phone: '03 7654 3210', nextReview: '2026-03-01', compliance: 'Overdue', tags: ['SMSF', 'Retail'] },
    { id: 4, name: 'Tech Innovations Ltd', type: 'Company', entities: 5, activeJobs: 8, riskScore: 78, lastContact: '5 days ago', outstandingDocs: 1, annualFee: 45000, status: 'Active', manager: 'Sarah Chen', email: 'info@techinnovations.com.au', phone: '02 6543 2109', nextReview: '2026-04-30', compliance: 'Current', tags: ['Technology', 'Startup'] },
    { id: 5, name: 'Green Property Trust', type: 'Trust', entities: 3, activeJobs: 4, riskScore: 88, lastContact: '1 day ago', outstandingDocs: 0, annualFee: 32000, status: 'Active', manager: 'John Davis', email: 'green@property.com.au', phone: '07 5432 1098', nextReview: '2026-06-15', compliance: 'Current', tags: ['Property', 'Development'] },
    { id: 6, name: 'Melbourne Retail Group', type: 'Company', entities: 7, activeJobs: 12, riskScore: 72, lastContact: '4 days ago', outstandingDocs: 3, annualFee: 52000, status: 'Active', manager: 'Lisa Anderson', email: 'retail@melbourne.com.au', phone: '03 4321 0987', nextReview: '2026-05-05', compliance: 'Current', tags: ['Retail', 'Multi-Entity'] },
    { id: 7, name: 'Coastal Developments', type: 'Trust', entities: 4, activeJobs: 6, riskScore: 65, lastContact: '1 week ago', outstandingDocs: 1, annualFee: 38000, status: 'Active', manager: 'James Lee', email: 'coastal@dev.com.au', phone: '07 3210 9876', nextReview: '2026-07-01', compliance: 'Current', tags: ['Property', 'Construction'] }
  ];

  const jobs: Job[] = [
    { id: 'J2026-001', client: 'Acme Pty Ltd', entity: 'Acme Pty Ltd', service: 'Company Tax Return', stage: 'AI Processing', assignedTo: 'AI Agent', dueDate: '2026-03-15', riskScore: 25, budget: 8, actual: 2.5, status: 'in-progress', priority: 'medium', estimatedCompletion: 65, dependencies: [] },
    { id: 'J2026-002', client: 'Smith Family Trust', entity: 'Smith Trust', service: 'Trust Tax Return', stage: 'Waiting on Client', assignedTo: 'System', dueDate: '2026-03-20', riskScore: 15, budget: 6, actual: 1, status: 'waiting', priority: 'low', estimatedCompletion: 20, dependencies: [] },
    { id: 'J2026-003', client: 'Jones Super Fund', entity: 'Jones SMSF', service: 'SMSF Annual Return', stage: 'Review Required', assignedTo: 'Emma Wilson', dueDate: '2026-02-28', riskScore: 75, budget: 12, actual: 15, status: 'review', priority: 'critical', estimatedCompletion: 85, dependencies: ['J2026-008'] },
    { id: 'J2026-004', client: 'Tech Innovations Ltd', entity: 'Tech Innovations', service: 'BAS Quarterly', stage: 'Ready for Processing', assignedTo: 'James Lee', dueDate: '2026-03-01', riskScore: 30, budget: 4, actual: 0, status: 'in-progress', priority: 'high', estimatedCompletion: 0, dependencies: [] },
    { id: 'J2026-005', client: 'Green Property Trust', entity: 'Green Trust', service: 'Financial Statements', stage: 'Client Approval', assignedTo: 'Sarah Chen', dueDate: '2026-03-10', riskScore: 20, budget: 16, actual: 14, status: 'waiting', priority: 'medium', estimatedCompletion: 90, dependencies: [] },
    { id: 'J2026-006', client: 'Melbourne Retail Group', entity: 'Melbourne Retail', service: 'Payroll Tax', stage: 'Data Collection', assignedTo: 'Lisa Anderson', dueDate: '2026-03-05', riskScore: 40, budget: 5, actual: 2, status: 'in-progress', priority: 'high', estimatedCompletion: 45, dependencies: [] },
    { id: 'J2026-007', client: 'Coastal Developments', entity: 'Coastal Trust', service: 'Company Tax Return', stage: 'Final Review', assignedTo: 'John Davis', dueDate: '2026-03-08', riskScore: 10, budget: 10, actual: 9.5, status: 'review', priority: 'medium', estimatedCompletion: 95, dependencies: [] },
    { id: 'J2026-008', client: 'Acme Pty Ltd', entity: 'Acme Holdings', service: 'Audit Prep', stage: 'In Progress', assignedTo: 'Sarah Chen', dueDate: '2026-02-25', riskScore: 55, budget: 20, actual: 12, status: 'in-progress', priority: 'critical', estimatedCompletion: 60, dependencies: [] },
    { id: 'J2026-009', client: 'Smith Family Trust', entity: 'Smith Investment', service: 'Capital Gains', stage: 'Blocked', assignedTo: 'Emma Wilson', dueDate: '2026-03-12', riskScore: 80, budget: 8, actual: 3, status: 'blocked', priority: 'high', estimatedCompletion: 40, dependencies: ['J2026-002'] },
    { id: 'J2026-010', client: 'Tech Innovations Ltd', entity: 'Tech Labs', service: 'R&D Tax Incentive', stage: 'Complete', assignedTo: 'James Lee', dueDate: '2026-02-20', riskScore: 5, budget: 15, actual: 14, status: 'complete', priority: 'low', estimatedCompletion: 100, dependencies: [] }
  ];

  const documents: Document[] = [
    { id: 1, name: 'Acme_Company_2026_TaxReturn_Draft.pdf', client: 'Acme Pty Ltd', entity: 'Acme Pty Ltd', year: 2026, category: 'Tax Return', uploadedBy: 'AI Agent', date: '2026-02-20', version: 3, classification: 'Auto', size: '2.4 MB', tags: ['Draft', 'Tax'] },
    { id: 2, name: 'Smith_Trust_2026_BankStatement_Jan.pdf', client: 'Smith Family Trust', entity: 'Smith Trust', year: 2026, category: 'Bank Statement', uploadedBy: 'Client', date: '2026-02-15', version: 1, classification: 'Auto', size: '856 KB', tags: ['Bank', 'Statement'] },
    { id: 3, name: 'Jones_SMSF_2025_FinancialStatements.pdf', client: 'Jones Super Fund', entity: 'Jones SMSF', year: 2025, category: 'Financial Statements', uploadedBy: 'Emma Wilson', date: '2026-02-10', version: 2, classification: 'Manual', size: '1.8 MB', tags: ['Financial', 'SMSF'] },
    { id: 4, name: 'TechInnovations_Company_2026_Dividend_Statement.pdf', client: 'Tech Innovations Ltd', entity: 'Tech Innovations', year: 2026, category: 'Dividend Statement', uploadedBy: 'AI Agent', date: '2026-02-18', version: 1, classification: 'Auto', size: '512 KB', tags: ['Dividend', 'Company'] },
    { id: 5, name: 'Green_Trust_2026_Property_Valuation.pdf', client: 'Green Property Trust', entity: 'Green Trust', year: 2026, category: 'Valuation', uploadedBy: 'John Davis', date: '2026-02-22', version: 1, classification: 'Manual', size: '3.2 MB', tags: ['Property', 'Valuation'] }
  ];

  const staff: StaffMember[] = [
    { id: 1, name: 'Sarah Chen', role: 'Senior Accountant', currentJobs: 12, capacity: 85, hoursThisWeek: 34, riskJobs: 2, utilization: 85, skills: ['Tax', 'Audit', 'Advisory'], available: true },
    { id: 2, name: 'John Davis', role: 'Accountant', currentJobs: 15, capacity: 94, hoursThisWeek: 37.5, riskJobs: 1, utilization: 94, skills: ['Tax', 'Compliance'], available: true },
    { id: 3, name: 'Emma Wilson', role: 'Tax Specialist', currentJobs: 8, capacity: 53, hoursThisWeek: 21, riskJobs: 3, utilization: 53, skills: ['SMSF', 'Tax Planning'], available: true },
    { id: 4, name: 'James Lee', role: 'Junior Accountant', currentJobs: 18, capacity: 100, hoursThisWeek: 40, riskJobs: 0, utilization: 100, skills: ['Bookkeeping', 'BAS'], available: false },
    { id: 5, name: 'Lisa Anderson', role: 'Bookkeeper', currentJobs: 22, capacity: 92, hoursThisWeek: 36.8, riskJobs: 1, utilization: 92, skills: ['Payroll', 'Bookkeeping'], available: true }
  ];

  // Status color helper
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      complete: 'bg-green-500/15 text-green-300 border-green-300',
      'in-progress': 'bg-blue-500/15 text-blue-300 border-blue-300',
      waiting: 'bg-amber-500/15 text-amber-300 border-amber-300',
      blocked: 'bg-red-500/15 text-red-300 border-red-300',
      review: 'bg-purple-500/15 text-purple-300 border-purple-300'
    };
    return colors[status] || 'bg-white/5 text-slate-100 border-white/10';
  };

  const getPriorityColor = (priority: Priority) => {
    const colors: Record<Priority, string> = {
      critical: 'bg-red-500/15 text-red-300 border-red-300',
      high: 'bg-orange-500/15 text-orange-300 border-orange-300',
      medium: 'bg-blue-500/15 text-blue-300 border-blue-300',
      low: 'bg-white/5 text-slate-100 border-white/10'
    };
    return colors[priority];
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-400 bg-red-500/15';
    if (score >= 40) return 'text-amber-400 bg-amber-500/15';
    return 'text-green-400 bg-green-500/15';
  };

  // Filtered and sorted data
  const filteredJobs = useMemo(() => {
    let filtered = jobs.filter(job => {
      const matchesSearch = job.client.toLowerCase().includes(jobSearchQuery.toLowerCase()) ||
                           job.service.toLowerCase().includes(jobSearchQuery.toLowerCase()) ||
                           job.id.toLowerCase().includes(jobSearchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || job.priority === filterPriority;
      return matchesSearch && matchesStatus && matchesPriority;
    });

    // Sort
    filtered.sort((a, b) => {
      let aVal: any = a[sortBy as keyof Job];
      let bVal: any = b[sortBy as keyof Job];
      
      if (sortBy === 'dueDate') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [jobs, jobSearchQuery, filterStatus, filterPriority, sortBy, sortOrder]);

  const filteredClients = useMemo(() => {
    return clients.filter(client =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.manager.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [clients, searchQuery]);

  // Bulk actions
  const handleBulkAssign = useCallback(() => {
    if (selectedJobs.length === 0) {
      toast.error('Please select jobs to assign');
      return;
    }
    toast.success(`${selectedJobs.length} jobs assigned successfully`);
    setSelectedJobs([]);
  }, [selectedJobs]);

  const handleBulkExport = useCallback((format: string) => {
    setIsLoading(true);
    setTimeout(() => {
      toast.success(`Exported ${selectedJobs.length || filteredJobs.length} jobs as ${format.toUpperCase()}`);
      setIsLoading(false);
      setShowExportDialog(false);
    }, 1500);
  }, [selectedJobs, filteredJobs]);

  // AI Assistant
  const handleAIQuery = useCallback(() => {
    if (!aiQuery.trim()) return;
    
    setAiMessages(prev => [...prev, { role: 'user', content: aiQuery }]);
    setAiQuery('');
    setIsAiTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        `Based on your current workload, I recommend prioritizing ${jobs.filter(j => j.priority === 'critical').length} critical jobs first.`,
        `I've analyzed the capacity data. James Lee is at 100% utilization - consider redistributing some of his workload.`,
        `Risk Alert: Jones Super Fund has 5 outstanding documents and a compliance deadline approaching on 2026-03-01.`,
        `Revenue forecast is tracking 12.5% above target. The team has completed 456 jobs this month.`,
        `AI Processing has saved 1,240 hours this month across document classification and data extraction tasks.`
      ];
      setAiMessages(prev => [...prev, { 
        role: 'assistant', 
        content: responses[Math.floor(Math.random() * responses.length)]
      }]);
      setIsAiTyping(false);
    }, 1500);
  }, [aiQuery, jobs]);

  // Navigation items based on role
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, roles: ['partner', 'reviewer', 'processor', 'admin'], badge: null },
    { id: 'clients', label: 'Clients', icon: Users, roles: ['partner', 'reviewer', 'processor', 'admin'], badge: clients.length },
    { id: 'jobs', label: 'Jobs', icon: Briefcase, roles: ['partner', 'reviewer', 'processor', 'admin'], badge: dashboardMetrics.openJobs },
    { id: 'documents', label: 'Documents', icon: FolderOpen, roles: ['partner', 'reviewer', 'processor', 'admin'], badge: null },
    { id: 'document-vault', label: 'Document Vault', icon: Shield, roles: ['partner', 'admin'], badge: null },
    { id: 'enterprise-hub', label: 'Enterprise Hub', icon: Network, roles: ['partner', 'admin'], badge: null },
    { id: 'workflow', label: 'Workflow', icon: Workflow, roles: ['partner', 'admin'], badge: null },
    { id: 'capacity', label: 'Capacity', icon: TrendingUp, roles: ['partner', 'reviewer', 'admin'], badge: null },
    { id: 'compliance', label: 'Compliance', icon: Shield, roles: ['partner', 'reviewer', 'admin'], badge: dashboardMetrics.riskAlerts },
    { id: 'billing', label: 'Billing', icon: DollarSign, roles: ['partner', 'admin'], badge: null },
    { id: 'automation', label: 'Automation', icon: Zap, roles: ['partner', 'admin'], badge: null },
    { id: 'reports', label: 'Reports', icon: BarChart3, roles: ['partner', 'reviewer', 'admin'], badge: null },
    { id: 'client-portal', label: 'Client Portal', icon: User, roles: ['client'], badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['partner', 'admin'], badge: null }
  ].filter(item => item.roles.includes(userRole));

  // Dashboard View with enhanced metrics
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, Partner</h1>
            <p className="text-blue-100">Your practice is running smoothly. Here's what's happening today.</p>
          </div>
          <Button variant="secondary" onClick={() => setShowOnboarding(true)}>
            <Rocket className="w-4 h-4 mr-2" />
            Quick Tour
          </Button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Open Jobs', value: dashboardMetrics.openJobs, icon: Briefcase, color: 'blue', change: '+12%' },
          { label: 'Due This Week', value: dashboardMetrics.dueThisWeek, icon: AlertTriangle, color: 'amber', change: '-5%' },
          { label: 'Risk Alerts', value: dashboardMetrics.riskAlerts, icon: Shield, color: 'red', change: '-8%' },
          { label: 'Staff Utilization', value: `${dashboardMetrics.staffUtilization}%`, icon: TrendingUp, color: 'green', change: '+3%' }
        ].map((metric, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-${metric.color}-100`}>
                    <metric.icon className={`w-6 h-6 text-${metric.color}-600`} />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {metric.change}
                  </Badge>
                </div>
                <p className="text-3xl font-bold text-slate-100">{metric.value}</p>
                <p className="text-sm text-slate-300 mt-1">{metric.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Revenue This Month', value: `$${(dashboardMetrics.revenueThisMonth / 1000).toFixed(0)}k`, icon: DollarSign, subtext: '+12.5% vs last month' },
          { label: 'AI Time Saved', value: `${dashboardMetrics.aiTimeSaved}h`, icon: Sparkles, subtext: 'Automated processing' },
          { label: 'Client Satisfaction', value: `${dashboardMetrics.clientSatisfaction}%`, icon: Star, subtext: 'Based on 142 responses' }
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + idx * 0.1 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <stat.icon className="w-5 h-5 text-blue-400" />
                  <div className="flex-1">
                    <p className="text-2xl font-bold text-slate-100">{stat.value}</p>
                    <p className="text-sm text-slate-300">{stat.label}</p>
                    <p className="text-xs text-slate-400 mt-1">{stat.subtext}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity & Priority Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Jobs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Priority Jobs</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setCurrentView('jobs')}>
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              <div className="space-y-3">
                {jobs
                  .filter(j => j.priority === 'critical' || j.priority === 'high')
                  .slice(0, 5)
                  .map((job, idx) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-3 border border-white/10 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
                      onClick={() => setSelectedJob(job)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={getPriorityColor(job.priority!)}>
                              {job.priority}
                            </Badge>
                            <span className="text-sm font-medium text-slate-100">{job.id}</span>
                          </div>
                          <p className="text-sm text-slate-300">{job.client} - {job.service}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Due: {job.dueDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {job.assignedTo}
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-300">Progress</span>
                          <span className="font-medium">{job.estimatedCompletion}%</span>
                        </div>
                        <Progress value={job.estimatedCompletion} className="h-1" />
                      </div>
                    </motion.div>
                  ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Team Capacity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Team Capacity</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setCurrentView('capacity')}>
                View Details
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              <div className="space-y-4">
                {staff.map((member, idx) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-3 border border-white/10 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                          member.utilization >= 90 ? 'bg-red-500' :
                          member.utilization >= 70 ? 'bg-amber-500' : 'bg-green-500'
                        }`}>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-slate-100">{member.name}</p>
                          <p className="text-xs text-slate-300">{member.role}</p>
                        </div>
                      </div>
                      {member.available ? (
                        <Badge variant="secondary" className="bg-green-500/15 text-green-300">
                          Available
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-white/5 text-slate-100">
                          Busy
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300">Utilization</span>
                        <span className="font-medium">{member.utilization}%</span>
                      </div>
                      <Progress value={member.utilization} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-slate-300">
                        <span>{member.currentJobs} jobs</span>
                        <span>{member.hoursThisWeek}h this week</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 mx-auto mb-2 opacity-20" />
                <p className="text-sm">Revenue chart visualization</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job Distribution</CardTitle>
            <CardDescription>By service type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <PieChart className="w-16 h-16 mx-auto mb-2 opacity-20" />
                <p className="text-sm">Distribution chart visualization</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Enhanced Clients View
  const renderClients = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Client Management</h2>
          <p className="text-sm text-slate-300 mt-1">Manage your {clients.length} clients and their entities</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => handleBulkExport('csv')}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Client
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search clients by name, type, or manager..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="company">Company</SelectItem>
                <SelectItem value="trust">Trust</SelectItem>
                <SelectItem value="smsf">SMSF</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="at-risk">At Risk</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client, idx) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="hover:shadow-lg transition-all cursor-pointer border-l-4" 
                  style={{ borderLeftColor: client.status === 'At Risk' ? '#ef4444' : '#10b981' }}
                  onClick={() => setSelectedClient(client)}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{client.name}</CardTitle>
                    <CardDescription className="mt-1">
                      <Badge variant="secondary" className="mr-2">{client.type}</Badge>
                      <Badge variant="outline">{client.entities} entities</Badge>
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Risk Score */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-300">Health Score</span>
                      <span className={`font-semibold ${
                        client.riskScore >= 80 ? 'text-green-400' :
                        client.riskScore >= 50 ? 'text-amber-400' : 'text-red-400'
                      }`}>{client.riskScore}/100</span>
                    </div>
                    <Progress value={client.riskScore} className="h-2" />
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                    <div>
                      <p className="text-xs text-slate-300">Active Jobs</p>
                      <p className="text-lg font-semibold text-slate-100">{client.activeJobs}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-300">Annual Fee</p>
                      <p className="text-lg font-semibold text-slate-100">${(client.annualFee / 1000).toFixed(0)}k</p>
                    </div>
                  </div>

                  {/* Manager & Contact */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <User className="w-4 h-4" />
                      <span>{client.manager}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {client.outstandingDocs > 0 && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge variant="destructive" className="text-xs">
                                {client.outstandingDocs} docs
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Outstanding documents</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  {client.tags && (
                    <div className="flex items-center gap-2 flex-wrap pt-2">
                      {client.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Enhanced Jobs View with Kanban Board
  const renderJobs = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Job Management</h2>
          <p className="text-sm text-slate-300 mt-1">{filteredJobs.length} jobs in progress</p>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => setJobViewMode('table')}>
                  <List className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Table View</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => setJobViewMode('kanban')}>
                  <Layout className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Kanban View</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button variant="outline" onClick={() => setShowExportDialog(true)}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Job
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search jobs..."
                className="pl-10"
                value={jobSearchQuery}
                onChange={(e) => setJobSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="waiting">Waiting</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
                <SelectItem value="complete">Complete</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="riskScore">Risk Score</SelectItem>
                <SelectItem value="client">Client</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedJobs.length > 0 && (
            <div className="mt-4 p-3 bg-blue-500/10 rounded-lg flex items-center justify-between">
              <span className="text-sm font-medium text-blue-300">
                {selectedJobs.length} jobs selected
              </span>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => setSelectedJobs([])}>
                  Clear
                </Button>
                <Button size="sm" onClick={handleBulkAssign}>
                  Bulk Assign
                </Button>
                <Button size="sm" variant="destructive">
                  Bulk Delete
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Kanban Board */}
      {jobViewMode === 'kanban' && (
        <DndProvider backend={HTML5Backend}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {['in-progress', 'waiting', 'review', 'blocked', 'complete'].map((status) => (
              <Card key={status} className="bg-white/5">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold capitalize">
                      {status.replace('-', ' ')}
                    </CardTitle>
                    <Badge variant="secondary">
                      {filteredJobs.filter(j => j.status === status).length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-2">
                      {filteredJobs
                        .filter(job => job.status === status)
                        .map((job, idx) => (
                          <KanbanCard key={job.id} job={job} onClick={() => setSelectedJob(job)} />
                        ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            ))}
          </div>
        </DndProvider>
      )}

      {/* Table View */}
      {jobViewMode === 'table' && (
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedJobs(filteredJobs.map(j => j.id));
                          } else {
                            setSelectedJobs([]);
                          }
                        }}
                        checked={selectedJobs.length === filteredJobs.length && filteredJobs.length > 0}
                      />
                    </th>
                    <th className="text-left p-3 text-sm font-semibold text-slate-300">Job ID</th>
                    <th className="text-left p-3 text-sm font-semibold text-slate-300">Client</th>
                    <th className="text-left p-3 text-sm font-semibold text-slate-300">Service</th>
                    <th className="text-left p-3 text-sm font-semibold text-slate-300">Status</th>
                    <th className="text-left p-3 text-sm font-semibold text-slate-300">Priority</th>
                    <th className="text-left p-3 text-sm font-semibold text-slate-300">Due Date</th>
                    <th className="text-left p-3 text-sm font-semibold text-slate-300">Assigned To</th>
                    <th className="text-left p-3 text-sm font-semibold text-slate-300">Progress</th>
                    <th className="text-left p-3 text-sm font-semibold text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job, idx) => (
                    <motion.tr
                      key={job.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.02 }}
                      className="border-b hover:bg-white/5"
                    >
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedJobs.includes(job.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedJobs([...selectedJobs, job.id]);
                            } else {
                              setSelectedJobs(selectedJobs.filter(id => id !== job.id));
                            }
                          }}
                        />
                      </td>
                      <td className="p-3">
                        <span className="font-medium text-blue-400">{job.id}</span>
                      </td>
                      <td className="p-3 text-sm text-slate-100">{job.client}</td>
                      <td className="p-3 text-sm text-slate-300">{job.service}</td>
                      <td className="p-3">
                        <Badge className={getStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge className={getPriorityColor(job.priority!)}>
                          {job.priority}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm text-slate-300">{job.dueDate}</td>
                      <td className="p-3 text-sm text-slate-300">{job.assignedTo}</td>
                      <td className="p-3">
                        <div className="w-24">
                          <Progress value={job.estimatedCompletion} className="h-2" />
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedJob(job)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Kanban Card Component
  const KanbanCard = ({ job, onClick }: { job: Job; onClick: () => void }) => {
    const [{ isDragging }, drag] = useDrag({
      type: 'JOB',
      item: { id: job.id },
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      })
    });

    return (
      <motion.div
        ref={drag}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className="bg-white p-3 rounded-lg border border-white/10 cursor-move hover:shadow-md transition-all"
        onClick={onClick}
      >
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs font-semibold text-blue-400">{job.id}</span>
          <Badge className={getPriorityColor(job.priority!)} variant="secondary">
            {job.priority}
          </Badge>
        </div>
        <h4 className="text-sm font-medium text-slate-100 mb-1">{job.service}</h4>
        <p className="text-xs text-slate-300 mb-3">{job.client}</p>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Progress</span>
            <span className="font-medium">{job.estimatedCompletion}%</span>
          </div>
          <Progress value={job.estimatedCompletion} className="h-1" />
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <div className="flex items-center gap-1 text-xs text-slate-300">
            <Calendar className="w-3 h-3" />
            <span>{job.dueDate}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-300">
            <User className="w-3 h-3" />
            <span className="truncate max-w-[80px]">{job.assignedTo}</span>
          </div>
        </div>

        {job.riskScore > 50 && (
          <div className="mt-2 flex items-center gap-1 text-xs text-amber-400">
            <AlertTriangle className="w-3 h-3" />
            <span>Risk: {job.riskScore}</span>
          </div>
        )}
      </motion.div>
    );
  };

  // Enhanced Documents View
  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Document Management</h2>
          <p className="text-sm text-slate-300 mt-1">AI-powered classification and organization</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Upload Documents
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search documents..."
                className="pl-10"
                value={documentSearchQuery}
                onChange={(e) => setDocumentSearchQuery(e.target.value)}
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="tax-return">Tax Return</SelectItem>
                <SelectItem value="bank-statement">Bank Statement</SelectItem>
                <SelectItem value="financial">Financial Statements</SelectItem>
                <SelectItem value="invoice">Invoice</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc, idx) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-500/15 rounded-lg">
                        <FileText className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-slate-100 truncate mb-1">
                          {doc.name}
                        </h4>
                        <p className="text-xs text-slate-300">{doc.client}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {doc.category}
                          </Badge>
                          {doc.classification === 'Auto' && (
                            <Badge className="text-xs bg-purple-500/15 text-purple-300">
                              <Sparkles className="w-3 h-3 mr-1" />
                              AI
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <span className="text-xs text-slate-400">{doc.size}</span>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Capacity Planning View
  const renderCapacity = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Capacity Planning</h2>
          <p className="text-sm text-slate-300 mt-1">Monitor team workload and optimize allocation</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Rebalance Workload
        </Button>
      </div>

      {/* Capacity Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Team Utilization', value: '78%', icon: Gauge, color: 'green' },
          { label: 'Overloaded Staff', value: '2', icon: AlertTriangle, color: 'red' },
          { label: 'Available Capacity', value: '156h', icon: Clock, color: 'blue' },
          { label: 'Avg Job Load', value: '15', icon: Briefcase, color: 'purple' }
        ].map((metric, idx) => (
          <Card key={idx}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg bg-${metric.color}-100`}>
                  <metric.icon className={`w-6 h-6 text-${metric.color}-600`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-100">{metric.value}</p>
                  <p className="text-sm text-slate-300">{metric.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Staff Workload Details */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Workload Analysis</CardTitle>
          <CardDescription>Detailed breakdown by team member</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {staff.map((member, idx) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 border border-white/10 rounded-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                      member.utilization >= 90 ? 'bg-gradient-to-br from-red-500 to-red-600' :
                      member.utilization >= 70 ? 'bg-gradient-to-br from-amber-500 to-amber-600' : 
                      'bg-gradient-to-br from-green-500 to-green-600'
                    }`}>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-100">{member.name}</h3>
                      <p className="text-sm text-slate-300">{member.role}</p>
                      {member.skills && (
                        <div className="flex items-center gap-1 mt-1">
                          {member.skills.map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-100">{member.utilization}%</p>
                    <p className="text-sm text-slate-300">Utilization</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <Progress value={member.utilization} className="h-3" />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-sm text-slate-300">Current Jobs</p>
                    <p className="text-xl font-bold text-slate-100">{member.currentJobs}</p>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-sm text-slate-300">Hours/Week</p>
                    <p className="text-xl font-bold text-slate-100">{member.hoursThisWeek}h</p>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-sm text-slate-300">Risk Jobs</p>
                    <p className="text-xl font-bold text-red-400">{member.riskJobs}</p>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-sm text-slate-300">Capacity</p>
                    <p className="text-xl font-bold text-slate-100">{member.capacity}%</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    View Jobs
                  </Button>
                  <Button size="sm" variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reassign
                  </Button>
                  {member.utilization >= 90 && (
                    <Badge variant="destructive" className="ml-auto">
                      Overloaded
                    </Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render main content based on current view
  const renderMainContent = () => {
    if (currentView === 'document-vault') {
      return <UltimateDocumentManager />;
    }
    
    if (currentView === 'enterprise-hub') {
      return <ClientManagementHub />;
    }

    switch (currentView) {
      case 'dashboard':
        return renderDashboard();
      case 'clients':
        return renderClients();
      case 'jobs':
        return renderJobs();
      case 'documents':
        return renderDocuments();
      case 'capacity':
        return renderCapacity();
      case 'workflow':
      case 'compliance':
      case 'billing':
      case 'automation':
      case 'reports':
      case 'settings':
        return (
          <Card>
            <CardContent className="pt-20 pb-20">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/15 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Rocket className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-100 mb-2">
                  {currentView.charAt(0).toUpperCase() + currentView.slice(1).replace('-', ' ')} Module
                </h3>
                <p className="text-slate-300 mb-4">
                  This enterprise feature is ready for your configuration
                </p>
                <Button>
                  <Settings className="w-4 h-4 mr-2" />
                  Configure Module
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-white/5">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          className="w-64 bg-white border-r border-white/10 flex flex-col"
        >
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-100">Atlas</h1>
                <p className="text-xs text-slate-300">Practice OS</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 py-4">
            <nav className="space-y-1 px-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentView(item.id as View)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-500/10 text-blue-300'
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </motion.button>
                );
              })}
            </nav>
          </ScrollArea>

          {/* User Profile */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                PA
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-100 truncate">Partner Account</p>
                <p className="text-xs text-slate-300 capitalize">{userRole}</p>
              </div>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <div className="bg-white border-b border-white/10 px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Search */}
              <div className="flex items-center gap-4 flex-1">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search anything... (⌘K)"
                    className="pl-10 bg-white/5"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowCommandPalette(true)}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {userRole !== 'client' && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowAIPanel(!showAIPanel)}
                          className="relative"
                        >
                          <Brain className="w-5 h-5" />
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        AI Assistant (Always Ready)
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="relative"
                        onClick={() => setShowNotifications(!showNotifications)}
                      >
                        <Bell className="w-5 h-5" />
                        {dashboardMetrics.riskAlerts > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                            {dashboardMetrics.riskAlerts}
                          </span>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Notifications
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <HelpCircle className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Help & Support
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <ScrollArea className="flex-1 p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderMainContent()}
              </motion.div>
            </AnimatePresence>
          </ScrollArea>
        </div>

        {/* AI Assistant Panel */}
        <AnimatePresence>
          {showAIPanel && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed bottom-0 right-0 w-96 h-[600px] bg-white rounded-tl-xl shadow-2xl border-l-2 border-t-2 border-blue-500/30 z-50 flex flex-col"
            >
              {/* AI Panel Header */}
              <div className="p-4 border-b border-white/10 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-100">AI Assistant</h3>
                      <p className="text-xs text-slate-300">Powered by Atlas AI</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowAIPanel(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* AI Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {/* Welcome Message */}
                  {aiMessages.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg"
                    >
                      <div className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-blue-400 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-slate-100 mb-2">
                            Hi! I'm your AI assistant.
                          </p>
                          <p className="text-sm text-slate-300 mb-3">
                            I can help you with:
                          </p>
                          <ul className="text-sm text-slate-300 space-y-1">
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                              Finding clients and jobs
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                              Analyzing capacity issues
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                              Reviewing risk alerts
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                              Generating insights
                            </li>
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Chat Messages */}
                  {aiMessages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-blue-500/15 ml-8'
                          : 'bg-white/5 mr-8'
                      }`}
                    >
                      <p className="text-sm text-slate-100">{msg.content}</p>
                    </motion.div>
                  ))}

                  {/* Typing Indicator */}
                  {isAiTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white/5 p-3 rounded-lg mr-8"
                    >
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                        <span className="text-sm text-slate-300">AI is thinking...</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>

              {/* AI Input */}
              <div className="p-4 border-t border-white/10 bg-white/5">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask me anything..."
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAIQuery()}
                    className="flex-1"
                  />
                  <Button onClick={handleAIQuery} disabled={!aiQuery.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Command Palette */}
        <AnimatePresence>
          {showCommandPalette && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-32"
              onClick={() => setShowCommandPalette(false)}
            >
              <motion.div
                initial={{ scale: 0.95, y: -20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: -20 }}
                className="bg-white rounded-lg shadow-2xl w-full max-w-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 border-b">
                  <Input
                    placeholder="Type a command or search..."
                    autoFocus
                    className="border-0 focus:ring-0"
                  />
                </div>
                <div className="p-2 max-h-96 overflow-y-auto">
                  <div className="space-y-1">
                    {navItems.map((item) => (
                      <button
                        key={item.id}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-white/5 text-left"
                        onClick={() => {
                          setCurrentView(item.id as View);
                          setShowCommandPalette(false);
                        }}
                      >
                        <item.icon className="w-5 h-5 text-slate-300" />
                        <span className="text-sm text-slate-100">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Export Dialog */}
        <AnimatePresence>
          {showExportDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
              onClick={() => setShowExportDialog(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Export Data</h3>
                <p className="text-sm text-slate-300 mb-6">
                  Choose a format to export {selectedJobs.length || filteredJobs.length} jobs
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { format: 'csv', icon: File, label: 'CSV' },
                    { format: 'pdf', icon: FileText, label: 'PDF' },
                    { format: 'json', icon: Code, label: 'JSON' },
                    { format: 'excel', icon: File, label: 'Excel' }
                  ].map(({ format, icon: Icon, label }) => (
                    <Button
                      key={format}
                      variant="outline"
                      className="h-20 flex-col gap-2"
                      onClick={() => handleBulkExport(format)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <>
                          <Icon className="w-6 h-6" />
                          <span>{label}</span>
                        </>
                      )}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  className="w-full mt-4"
                  onClick={() => setShowExportDialog(false)}
                >
                  Cancel
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
}

export default AtlasPracticeOS;

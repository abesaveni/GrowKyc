import React, { useState } from 'react';
import { Button } from '../ui/button';
import { TemplatesLibraryView } from './TemplatesLibraryView';
import { TrashDocumentsView } from './TrashDocumentsView';
import { SharedDocumentsView } from './SharedDocumentsView';
import { RecentDocumentsView } from './RecentDocumentsView';
import {
  Home,
  Upload,
  Search,
  FolderOpen,
  Users,
  FileText,
  Settings,
  Clock,
  CheckCircle,
  Shield,
  Lock,
  Unlock,
  Eye,
  Download,
  Share2,
  Trash2,
  Edit,
  Plus,
  Filter,
  MoreVertical,
  AlertCircle,
  Archive,
  File,
  FileCheck,
  Inbox,
  Bell,
  User,
  Building2,
  Calendar,
  Tag,
  Star,
  TrendingUp,
  Activity,
  Database,
  HardDrive,
  Zap,
  GitBranch,
  CheckSquare,
  XCircle,
  RefreshCw,
  ExternalLink,
  Link,
  ChevronRight,
  Folder,
  X,
  CloudUpload,
  Scan,
  ChevronDown
} from 'lucide-react';

interface UltimateDocumentManagerProps {
  onSwitchModule?: (module: string) => void;
  initialRole?: DocumentRole;
}

type DocumentRole = 'admin' | 'manager' | 'staff' | 'partner' | 'client';

type ViewMode =
  | 'dashboard'
  | 'inbox'
  | 'search'
  | 'my-documents'
  | 'client-workspace'
  | 'approvals'
  | 'client-portal'
  | 'admin'
  | 'upload'
  | 'recent'
  | 'shared'
  | 'locked'
  | 'templates'
  | 'trash';

export function UltimateDocumentManager({ onSwitchModule, initialRole = 'staff' }: UltimateDocumentManagerProps) {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [userRole, setUserRole] = useState<DocumentRole>(initialRole);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const mockUser = {
    name: 'Emma Wilson',
    email: 'emma.wilson@firm.com.au',
    role: userRole,
    firm: 'Premier Advisory Group'
  };

  // Navigation items based on role
  const getNavigationItems = () => {
    const allItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home, roles: ['all'] },
      { id: 'inbox', label: 'Inbox', icon: Inbox, badge: 12, roles: ['admin', 'manager', 'staff', 'partner'] },
      { id: 'search', label: 'Search', icon: Search, roles: ['all'] },
      { id: 'my-documents', label: 'My Documents', icon: FileText, roles: ['admin', 'manager', 'staff', 'partner'] },
      { id: 'recent', label: 'Recent', icon: Clock, roles: ['all'] },
      { id: 'shared', label: 'Shared', icon: Share2, roles: ['all'] },
      { id: 'client-workspace', label: 'Client Workspace', icon: Users, roles: ['admin', 'manager', 'staff', 'partner'] },
      { id: 'approvals', label: 'Approvals', icon: CheckSquare, badge: 4, roles: ['admin', 'manager', 'partner'] },
      { id: 'locked', label: 'Locked Documents', icon: Lock, roles: ['admin', 'manager', 'partner'] },
      { id: 'templates', label: 'Templates', icon: FileText, roles: ['admin', 'manager', 'staff', 'partner'] },
      { id: 'trash', label: 'Trash', icon: Trash2, roles: ['admin', 'manager', 'staff', 'partner'] },
      { id: 'client-portal', label: 'Client Portal', icon: ExternalLink, roles: ['client'] },
      { id: 'admin', label: 'Admin', icon: Settings, roles: ['admin'] }
    ];

    return allItems.filter(item =>
      item.roles.includes('all') || item.roles.includes(userRole)
    );
  };

  const navigationItems = getNavigationItems();

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView onNavigate={setCurrentView} role={userRole} />;
      case 'inbox':
        return <InboxView role={userRole} />;
      case 'search':
        return <SearchView role={userRole} />;
      case 'my-documents':
        return <MyDocumentsView role={userRole} />;
      case 'client-workspace':
        return <ClientWorkspaceView role={userRole} />;
      case 'approvals':
        return <ApprovalsView role={userRole} />;
      case 'recent':
        return <RecentDocumentsView />;
      case 'shared':
        return <SharedDocumentsView />;
      case 'locked':
        return <LockedDocumentsView role={userRole} />;
      case 'admin':
        return <AdminConsoleView role={userRole} />;
      case 'templates':
        return <TemplatesLibraryView />;
      case 'trash':
        return <TrashDocumentsView />;
      default:
        return <DashboardView onNavigate={setCurrentView} role={userRole} />;
    }
  };

  return (
    <div className="min-h-screen bg-white/5">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-white/10 fixed w-full top-0 z-50">
        <div className="px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-100">Ultimate Document Manager</h1>
                  <p className="text-xs text-slate-400">Enterprise Document Intelligence</p>
                </div>
              </div>
            </div>

            {/* Global Search */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search documents, clients, matters..."
                  className="w-full pl-12 pr-4 py-2.5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => setCurrentView('search')}
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-white/5 text-xs text-slate-300 rounded border border-white/10">
                  Ctrl+K
                </kbd>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Upload Button */}
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setShowUploadModal(true)}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>

              {/* Module Switcher */}
              {onSwitchModule && (
                <select
                  onChange={(e) => onSwitchModule(e.target.value)}
                  className="px-3 py-2 border border-white/10 rounded-lg text-sm font-medium text-slate-300 bg-white hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue="document-manager"
                >
                  <option value="Grow MIP">Switch to Grow MIP</option>
                  <option value="grow_accounting">Switch to Grow Accounting</option>
                  <option value="pfa">Switch to PFA</option>
                  <option value="imfo">Switch to IMFO</option>
                  <option value="receivership">Switch to Receivership OS</option>
                  <option value="onecore">Switch to OneCore CRM</option>
                  <option value="document-manager">Document Manager</option>
                  <option value="grow_hq">Switch to Grow HQ</option>
                </select>
              )}

              {/* Role Switcher */}
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as DocumentRole)}
                className="px-3 py-2 border border-blue-300 rounded-lg text-xs font-medium text-blue-300 bg-blue-500/10 hover:bg-blue-500/15 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="staff">Staff</option>
                <option value="partner">Partner</option>
                <option value="client">Client</option>
              </select>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
              </Button>

              {/* User Profile */}
              <div className="flex items-center gap-3 pl-3 border-l border-white/10">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-100">{mockUser.name}</p>
                  <p className="text-xs text-slate-400">{mockUser.firm}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {mockUser.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-white/10 overflow-y-auto">
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as ViewMode)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-500/10 text-blue-300'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Storage Usage */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-white/5">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Storage Used</span>
                <span className="font-semibold">156 GB / 500 GB</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: '31.2%' }} />
              </div>
              <Button variant="ghost" size="sm" className="w-full justify-start text-slate-300 hover:text-slate-100">
                <HardDrive className="w-4 h-4 mr-2" />
                Manage Storage
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex-1 min-h-[calc(100vh-4rem)]">
          {renderContent()}
        </main>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal onClose={() => setShowUploadModal(false)} />
      )}
    </div>
  );
}

// Dashboard View
function DashboardView({ onNavigate, role }: any) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Document Dashboard</h1>
        <p className="text-slate-300 mt-1">Enterprise document intelligence at your fingertips</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: 'Total Documents', value: '24,567', change: '+234', icon: FileText, color: 'blue', clickable: 'my-documents' },
          { label: 'Awaiting Filing', value: '12', change: 'Urgent', icon: Inbox, color: 'orange', clickable: 'inbox' },
          { label: 'Pending Approval', value: '4', change: '2 overdue', icon: CheckSquare, color: 'purple', clickable: 'approvals' },
          { label: 'Client Requests', value: '8', change: '3 new', icon: Users, color: 'green', clickable: 'client-workspace' },
          { label: 'Locked Documents', value: '1,247', change: 'Compliant', icon: Lock, color: 'gray', clickable: 'locked' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div 
              key={idx} 
              className="bg-white border border-white/10 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => stat.clickable && onNavigate(stat.clickable)}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-5 h-5 text-${stat.color}-600`} />
                <p className="text-sm text-slate-300">{stat.label}</p>
              </div>
              <p className="text-3xl font-bold text-slate-100">{stat.value}</p>
              <p className="text-xs text-slate-400 mt-1">{stat.change}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white border border-white/10 rounded-lg">
          <div className="p-4 border-b border-white/10">
            <h3 className="font-semibold text-slate-100">Recent Activity</h3>
          </div>
          <div className="p-4 space-y-3">
            {[
              { user: 'John Smith', action: 'uploaded Financial Statements.pdf', client: 'Acme Corp', time: '5 mins ago', type: 'upload' },
              { user: 'Sarah Chen', action: 'approved Tax Return 2024', client: 'Tech Solutions', time: '12 mins ago', type: 'approval' },
              { user: 'Michael Brown', action: 'locked Annual Report', client: 'Retail Pty Ltd', time: '1 hour ago', type: 'lock' },
              { user: 'Emma Wilson', action: 'shared Contract with client', client: 'Property Group', time: '2 hours ago', type: 'share' }
            ].map((activity, idx) => (
              <div key={idx} className="flex items-start gap-3 pb-3 border-b border-white/10 last:border-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'upload' ? 'bg-blue-500/15' :
                  activity.type === 'approval' ? 'bg-green-500/15' :
                  activity.type === 'lock' ? 'bg-white/5' :
                  'bg-purple-500/15'
                }`}>
                  {activity.type === 'upload' && <Upload className="w-4 h-4 text-blue-400" />}
                  {activity.type === 'approval' && <CheckCircle className="w-4 h-4 text-green-400" />}
                  {activity.type === 'lock' && <Lock className="w-4 h-4 text-slate-300" />}
                  {activity.type === 'share' && <Share2 className="w-4 h-4 text-purple-400" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-100">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-slate-400">{activity.client} â€¢ {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white border border-white/10 rounded-lg">
          <div className="p-4 border-b border-white/10">
            <h3 className="font-semibold text-slate-100">System Health</h3>
          </div>
          <div className="p-4 space-y-4">
            {[
              { metric: 'Upload Success Rate', value: '99.8%', status: 'excellent', icon: TrendingUp },
              { metric: 'Search Performance', value: '< 500ms', status: 'excellent', icon: Zap },
              { metric: 'OCR Processing', value: '156 pending', status: 'good', icon: Scan },
              { metric: 'Storage Health', value: '31% used', status: 'good', icon: Database }
            ].map((health, idx) => {
              const HealthIcon = health.icon;
              return (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <HealthIcon className={`w-5 h-5 ${health.status === 'excellent' ? 'text-green-400' : 'text-blue-400'}`} />
                    <p className="text-sm text-slate-300">{health.metric}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-100">{health.value}</span>
                    <div className={`w-2 h-2 rounded-full ${health.status === 'excellent' ? 'bg-green-500' : 'bg-blue-500'}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-500/30 rounded-lg p-6">
        <h3 className="font-semibold text-slate-100 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Upload Documents', icon: CloudUpload, action: 'upload' },
            { label: 'Search Archive', icon: Search, action: 'search' },
            { label: 'Client Request', icon: Users, action: 'client-workspace' },
            { label: 'Review Approvals', icon: CheckSquare, action: 'approvals' }
          ].map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={idx}
                onClick={() => onNavigate(action.action)}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
              >
                <Icon className="w-6 h-6 text-blue-400" />
                <span className="text-sm font-medium text-slate-100">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Inbox View - Documents awaiting filing
function InboxView({ role }: any) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Inbox</h1>
          <p className="text-slate-300 mt-1">Documents awaiting filing with AI-suggested metadata</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <CheckCircle className="w-4 h-4 mr-2" />
            Bulk File
          </Button>
        </div>
      </div>

      {/* Inbox Items */}
      <div className="space-y-3">
        {[
          { 
            file: 'Financial_Statements_2024.pdf', 
            uploaded: '5 mins ago', 
            client: 'Acme Corp', 
            suggested: 'Financial Statements',
            confidence: 98,
            status: 'processed'
          },
          { 
            file: 'Tax_Return_Draft.xlsx', 
            uploaded: '12 mins ago', 
            client: 'Tech Solutions', 
            suggested: 'Tax Returns',
            confidence: 95,
            status: 'processed'
          },
          { 
            file: 'Board_Minutes_Meeting_Jan.docx', 
            uploaded: '1 hour ago', 
            client: 'Retail Pty Ltd', 
            suggested: 'Minutes',
            confidence: 92,
            status: 'ocr-processing'
          },
          { 
            file: 'Contract_Amendment.pdf', 
            uploaded: '2 hours ago', 
            client: 'Property Group', 
            suggested: 'Contracts',
            confidence: 88,
            status: 'processed'
          }
        ].map((doc, idx) => (
          <div key={idx} className="bg-white border border-white/10 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              {/* Checkbox */}
              <input type="checkbox" className="mt-1" />
              
              {/* File Icon */}
              <div className="w-12 h-12 bg-blue-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>

              {/* File Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-slate-100">{doc.file}</p>
                    <p className="text-sm text-slate-300">{doc.client} â€¢ Uploaded {doc.uploaded}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {doc.status === 'ocr-processing' && (
                      <span className="px-3 py-1 bg-orange-500/15 text-orange-300 rounded-full text-xs font-medium flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        OCR Processing
                      </span>
                    )}
                    {doc.status === 'processed' && (
                      <span className="px-3 py-1 bg-green-500/15 text-green-300 rounded-full text-xs font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Ready
                      </span>
                    )}
                  </div>
                </div>

                {/* AI Suggestions */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-slate-300">AI Suggestion:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-purple-500/15 text-purple-300 rounded-lg text-sm font-medium">
                      {doc.suggested}
                    </span>
                    <span className="text-xs text-slate-400">{doc.confidence}% confidence</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Confirm & File
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit Metadata
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Search View
function SearchView({ role }: any) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Advanced Search</h1>
        <p className="text-slate-300 mt-1">Full-text search across all documents with instant results</p>
      </div>

      {/* Search Filters */}
      <div className="bg-white border border-white/10 rounded-lg p-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Client</label>
            <select className="w-full px-4 py-2 border border-white/10 rounded-lg">
              <option>All Clients</option>
              <option>Acme Corp</option>
              <option>Tech Solutions</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Document Type</label>
            <select className="w-full px-4 py-2 border border-white/10 rounded-lg">
              <option>All Types</option>
              <option>Financial Statements</option>
              <option>Tax Returns</option>
              <option>Contracts</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Date Range</label>
            <select className="w-full px-4 py-2 border border-white/10 rounded-lg">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>This Year</option>
              <option>All Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="space-y-3">
        {[
          { name: 'Financial_Statements_2024.pdf', client: 'Acme Corp', type: 'Financial Statements', date: '2024-01-15', size: '2.4 MB' },
          { name: 'Tax_Return_2024.xlsx', client: 'Tech Solutions', type: 'Tax Returns', date: '2024-01-12', size: '850 KB' },
          { name: 'Board_Minutes_Jan.docx', client: 'Retail Pty Ltd', type: 'Minutes', date: '2024-01-10', size: '156 KB' },
          { name: 'Annual_Report_2023.pdf', client: 'Property Group', type: 'Reports', date: '2024-01-05', size: '5.2 MB' }
        ].map((doc, idx) => (
          <div key={idx} className="bg-white border border-white/10 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <FileText className="w-10 h-10 text-gray-400" />
              <div className="flex-1">
                <p className="font-semibold text-slate-100">{doc.name}</p>
                <p className="text-sm text-slate-300">{doc.client} â€¢ {doc.type} â€¢ {doc.date}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">{doc.size}</span>
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Upload Modal
function UploadModal({ onClose }: { onClose: () => void }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      alert('Documents uploaded successfully! They are now in your inbox for filing.');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center">
              <CloudUpload className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-100">Upload Documents</h2>
              <p className="text-sm text-slate-300">Drag and drop or click to select files</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-slate-300">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Drop Zone */}
          <div className="border-2 border-dashed border-white/10 rounded-lg p-12 text-center hover:border-blue-500 hover:bg-blue-500/10 transition-colors cursor-pointer">
            <CloudUpload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-semibold text-slate-100 mb-2">Drag files here or click to browse</p>
            <p className="text-sm text-slate-300">Supports PDF, DOC, XLS, images up to 2GB</p>
          </div>

          {/* Client Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Client *</label>
            <select className="w-full px-4 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Select client...</option>
              <option>Acme Corp</option>
              <option>Tech Solutions</option>
              <option>Retail Pty Ltd</option>
              <option>Property Group</option>
            </select>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" defaultChecked />
              <span className="text-sm text-slate-300">Enable OCR text extraction</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" defaultChecked />
              <span className="text-sm text-slate-300">Auto-suggest metadata using AI</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm text-slate-300">Request client review after upload</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={uploading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {uploading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Documents
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Placeholder views for other sections
function MyDocumentsView({ role }: any) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-100 mb-4">My Documents</h1>
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-8 text-center">
        <FileText className="w-12 h-12 text-blue-400 mx-auto mb-4" />
        <p className="text-slate-300">Full document library with folders, tags, and filters</p>
      </div>
    </div>
  );
}

function ClientWorkspaceView({ role }: any) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-100 mb-4">Client Workspace</h1>
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-8 text-center">
        <Users className="w-12 h-12 text-green-400 mx-auto mb-4" />
        <p className="text-slate-300">Manage client document requests and shares</p>
      </div>
    </div>
  );
}

function ApprovalsView({ role }: any) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-100 mb-4">Approvals</h1>
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-8 text-center">
        <CheckSquare className="w-12 h-12 text-purple-400 mx-auto mb-4" />
        <p className="text-slate-300">Review queue with multi-stage approval workflows</p>
      </div>
    </div>
  );
}

function LockedDocumentsView({ role }: any) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-100 mb-4">Locked Documents</h1>
      <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center">
        <Lock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-300">Immutable locked documents with compliance tracking</p>
      </div>
    </div>
  );
}

function AdminConsoleView({ role }: any) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-100 mb-4">Admin Console</h1>
      <div className="grid grid-cols-3 gap-4">
        {[
          { title: 'Schema Builder', desc: 'Configure metadata fields', icon: Database },
          { title: 'Automation Rules', desc: 'Set up auto-filing rules', icon: Zap },
          { title: 'Retention Policies', desc: 'Manage document retention', icon: Archive },
          { title: 'Role Management', desc: 'Configure user permissions', icon: Shield },
          { title: 'Storage Dashboard', desc: 'Monitor usage and health', icon: HardDrive },
          { title: 'Integration Hub', desc: 'Connect external systems', icon: GitBranch }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white border border-white/10 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
              <Icon className="w-8 h-8 text-blue-400 mb-3" />
              <h3 className="font-semibold text-slate-100 mb-1">{item.title}</h3>
              <p className="text-sm text-slate-300">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

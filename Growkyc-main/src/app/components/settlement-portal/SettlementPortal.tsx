import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  FolderOpen,
  ListChecks,
  Building2,
  BarChart3,
  Settings,
  Search,
  Bell,
  User,
  ChevronDown,
  Menu,
  X,
  MapPin,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  Users,
  MessageSquare,
  Activity,
  Shield,
  Home
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { toast } from '../../lib/toast';
import {
  renderInternalDashboard,
  renderExternalDashboard,
  renderMatters,
  renderMatterDetail,
  renderDocuments,
  renderReports,
  renderAdmin
} from './pages-static';
import { renderConditions, renderPEXA, renderTasks } from './pages-interactive';

type UserRole = 
  | 'internal_staff' 
  | 'borrower' 
  | 'vendor' 
  | 'broker' 
  | 'lender' 
  | 'borrower_lawyer' 
  | 'vendor_lawyer' 
  | 'settlement_agent';

type NavigationItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  roles: UserRole[];
};

const navigation: NavigationItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['internal_staff', 'borrower', 'vendor', 'broker', 'lender', 'borrower_lawyer', 'vendor_lawyer', 'settlement_agent'] },
  { id: 'matters', label: 'Matters', icon: FolderOpen, roles: ['internal_staff', 'borrower_lawyer', 'vendor_lawyer', 'settlement_agent'] },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare, roles: ['internal_staff', 'borrower_lawyer', 'vendor_lawyer', 'settlement_agent'] },
  { id: 'documents', label: 'Documents', icon: FileText, roles: ['internal_staff', 'borrower', 'vendor', 'broker', 'lender', 'borrower_lawyer', 'vendor_lawyer', 'settlement_agent'] },
  { id: 'conditions', label: 'Conditions', icon: ListChecks, roles: ['internal_staff', 'borrower_lawyer', 'vendor_lawyer', 'settlement_agent', 'lender'] },
  { id: 'pexa', label: 'PEXA', icon: Building2, roles: ['internal_staff', 'borrower_lawyer', 'vendor_lawyer', 'settlement_agent'] },
  { id: 'reports', label: 'Reports', icon: BarChart3, roles: ['internal_staff', 'borrower_lawyer', 'vendor_lawyer', 'settlement_agent'] },
  { id: 'admin', label: 'Admin', icon: Settings, roles: ['internal_staff'] }
];

const firms = [
  { id: 'firm-1', name: 'Smith & Associates Legal' },
  { id: 'firm-2', name: 'Melbourne Property Law' },
  { id: 'firm-3', name: 'Sydney Conveyancing Partners' },
  { id: 'firm-4', name: 'Brisbane Settlement Services' }
];

const states = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'ACT', 'TAS', 'NT'];

interface SettlementPortalProps {
  onSwitchModule?: (module: string) => void;
}

export default function SettlementPortal({ onSwitchModule }: SettlementPortalProps = {}) {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedMatterId, setSelectedMatterId] = useState<string | null>(null);
  const [selectedFirm, setSelectedFirm] = useState(firms[0]);
  const [currentRole, setCurrentRole] = useState<UserRole>('internal_staff');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showActivityPanel, setShowActivityPanel] = useState(true);

  // Filter navigation based on role
  const visibleNavigation = navigation.filter(item => item.roles.includes(currentRole));

  const handleNavigation = (pageId: string) => {
    setCurrentPage(pageId);
    setSelectedMatterId(null);
  };

  const handleMatterClick = (matterId: string) => {
    setSelectedMatterId(matterId);
    setCurrentPage('matter-detail');
  };

  const renderContent = () => {
    if (currentPage === 'matter-detail' && selectedMatterId) {
      return renderMatterDetail(selectedMatterId, () => {
        setCurrentPage('matters');
        setSelectedMatterId(null);
      }, (page) => {
        // Navigate to conditions/documents/tasks from matter detail
        setCurrentPage(page);
      });
    }

    switch (currentPage) {
      case 'dashboard':
        return currentRole === 'internal_staff' 
          ? renderInternalDashboard(handleMatterClick)
          : renderExternalDashboard(handleMatterClick);
      case 'matters':
        return renderMatters(handleMatterClick);
      case 'tasks':
        return renderTasks();
      case 'documents':
        return renderDocuments();
      case 'conditions':
        return renderConditions();
      case 'pexa':
        return renderPEXA();
      case 'reports':
        return renderReports();
      case 'admin':
        return renderAdmin();
      default:
        return renderInternalDashboard(handleMatterClick);
    }
  };

  return (
    <div className="flex h-screen bg-white/5">
      {/* Left Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-gray-900 text-white transition-all duration-300 overflow-hidden flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Settlement Portal</h1>
              <p className="text-xs text-gray-400">National Platform</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {visibleNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  currentPage === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Role Indicator */}
        <div className="p-4 border-t border-gray-800">
          <div className="text-xs text-gray-400 mb-2">Current Role</div>
          <div className="px-3 py-2 bg-gray-800 rounded-lg">
            <p className="text-sm font-medium text-white">
              {currentRole.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="bg-white border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>

              {/* Firm Selector */}
              <div className="relative">
                <button className="flex items-center gap-2 px-3 py-2 border border-white/10 rounded-lg hover:bg-white/5">
                  <Building2 className="w-4 h-4 text-slate-300" />
                  <span className="font-medium text-slate-100">{selectedFirm.name}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Global Search */}
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search matters, properties, parties..."
                  className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Role Switcher (Demo) */}
              <select
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value as UserRole)}
                className="px-3 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="internal_staff">Internal Staff</option>
                <option value="borrower">Borrower</option>
                <option value="vendor">Vendor</option>
                <option value="broker">Broker</option>
                <option value="lender">Lender</option>
                <option value="borrower_lawyer">Borrower Lawyer</option>
                <option value="vendor_lawyer">Vendor Lawyer</option>
                <option value="settlement_agent">Settlement Agent</option>
              </select>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-white/5 rounded-lg">
                <Bell className="w-5 h-5 text-slate-300" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Profile */}
              <button className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">JD</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {/* Activity Panel Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowActivityPanel(!showActivityPanel)}
              >
                <Activity className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area with Activity Panel */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {renderContent()}
          </main>

          {/* Right Activity Panel */}
          {showActivityPanel && (
            <aside className="w-80 bg-white border-l border-white/10 overflow-y-auto">
              <div className="p-4 border-b border-white/10">
                <h3 className="font-semibold text-slate-100">Activity Timeline</h3>
              </div>
              <div className="p-4 space-y-4">
                {[
                  { time: '2 min ago', user: 'Sarah Chen', action: 'Updated condition', detail: 'Contract cleared', type: 'success' },
                  { time: '15 min ago', user: 'PEXA System', action: 'Workspace status changed', detail: 'Ready to settle', type: 'info' },
                  { time: '1 hour ago', user: 'Mike Johnson', action: 'Document uploaded', detail: 'Contract of Sale signed', type: 'info' },
                  { time: '2 hours ago', user: 'Lisa Wong', action: 'Condition escalated', detail: 'VOI overdue', type: 'warning' },
                  { time: '3 hours ago', user: 'John Smith', action: 'Created matter', detail: '123 Collins St, Melbourne', type: 'info' }
                ].map((activity, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div
                      className={`w-2 h-2 mt-2 rounded-full ${
                        activity.type === 'success'
                          ? 'bg-green-500'
                          : activity.type === 'warning'
                          ? 'bg-amber-500'
                          : 'bg-blue-500'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-100">{activity.action}</p>
                      <p className="text-xs text-slate-300">{activity.detail}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-400">{activity.user}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-slate-400">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  UserPlus,
  CheckSquare,
  Globe,
  Upload,
  Settings as SettingsIcon,
  Workflow,
  BarChart3,
  Activity,
  Shield,
  Menu,
  X,
  Search,
  Bell,
  ChevronDown,
  Building2,
  HelpCircle,
  Mail
} from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';

interface WorkpaperLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

const navigationSections = [
  {
    title: 'Main',
    items: [
      { id: 'apex-dashboard', label: 'Grow Dashboard', icon: LayoutDashboard },
      { id: 'jobs', label: 'Jobs', icon: Briefcase, badge: 12 },
      { id: 'workpapers', label: 'Workpapers', icon: FileText },
      { id: 'clients', label: 'Clients', icon: Users },
    ]
  },
  {
    title: 'Grow Modules',
    items: [
      { id: 'trial-balance', label: 'Trial Balance Core', icon: Activity },
      { id: 'ai-review', label: 'AI Review Engine', icon: Shield },
      { id: 'binder-generator', label: 'Smart Binder', icon: FileText },
      { id: 'risk-dashboard', label: 'Risk Dashboard', icon: Shield },
      { id: 'ledger-sync', label: 'Ledger Sync', icon: SettingsIcon },
    ]
  },
  {
    title: 'Communication',
    items: [
      { id: 'email', label: 'Email', icon: Mail, badge: 2 },
      { id: 'resources', label: 'Team Resources', icon: Users },
    ]
  },
  {
    title: 'Client Services',
    items: [
      { id: 'onboarding', label: 'Onboarding', icon: UserPlus },
      { id: 'checklists', label: 'Checklists', icon: CheckSquare },
      { id: 'portal', label: 'Client Portal', icon: Globe },
      { id: 'documents', label: 'Documents', icon: Upload },
    ]
  },
  {
    title: 'Automation',
    items: [
      { id: 'integrations', label: 'Integrations', icon: SettingsIcon, badge: 3 },
      { id: 'workflows', label: 'Workflow Builder', icon: Workflow },
    ]
  },
  {
    title: 'Insights',
    items: [
      { id: 'reports', label: 'Reports', icon: BarChart3 },
      { id: 'analytics', label: 'Analytics', icon: Activity },
      { id: 'audit', label: 'Audit Trail', icon: Shield },
    ]
  },
  {
    title: 'System',
    items: [
      { id: 'settings', label: 'Settings', icon: SettingsIcon },
      { id: 'admin', label: 'Admin', icon: Shield },
    ]
  }
];

export function WorkpaperLayout({ children, currentPage = 'dashboard', onNavigate }: WorkpaperLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-white/5">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 h-[72px] bg-white border-b border-white/10 z-50">
        <div className="h-full px-6 flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#2855a6] rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-100">Grow Accounting</h1>
                <p className="text-xs text-slate-400">Workpaper Automation</p>
              </div>
            </div>
          </div>

          {/* Center - Search */}
          <div className="flex-1 max-w-[320px] mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs, clients, documents..."
                className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2855a6] focus:border-transparent"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Module Switcher */}
            <select
              className="px-3 py-2 border border-white/10 rounded-lg text-sm font-medium text-slate-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2855a6] focus:border-transparent cursor-pointer bg-white"
              onChange={(e) => {
                const module = e.target.value;
                if (module && window.location.href.includes('?')) {
                  const url = new URL(window.location.href);
                  url.searchParams.set('module', module);
                  window.location.href = url.toString();
                } else if (module) {
                  window.location.href = `?module=${module}`;
                }
              }}
              defaultValue="grow_accounting"
            >
              <option value="grow_accounting">Grow Accounting</option>
              <option value="Grow MIP">Switch to Grow MIP</option>
              <option value="grow_trust">Switch to Grow Trust</option>
              <option value="grow_lending">Switch to Grow Lending</option>
              <option value="grow_investments">Switch to Grow Investments</option>
              <option value="grow_crm">Switch to Grow CRM</option>
              <option value="grow_documents">Switch to Grow Documents</option>
              <option value="grow_time">Switch to Grow Time & Revenue</option>
              <option value="grow_payments">Switch to Grow Payments</option>
              <option value="grow_settlement">Switch to Grow Settlement</option>
              <option value="grow_receivership">Switch to Grow Receivership</option>
              <option value="grow_kyc">Switch to Grow KYC</option>
              <option value="pfa">Switch to PFA</option>
              <option value="grow_hq">Switch to Grow HQ</option>
            </select>

            {/* Firm Switcher */}
            <button className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-lg transition-colors">
              <Building2 className="w-4 h-4 text-slate-300" />
              <span className="text-sm font-medium text-slate-300">Smith & Co</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {/* Help */}
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors relative">
              <HelpCircle className="w-5 h-5 text-slate-300" />
            </button>

            {/* Notifications */}
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5 text-slate-300" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Avatar */}
            <button className="flex items-center gap-3 pl-3 border-l border-white/10">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-100">Sarah Johnson</p>
                <p className="text-xs text-slate-400">Manager</p>
              </div>
              <Avatar className="w-9 h-9">
                <AvatarFallback className="bg-[#2855a6] text-white">SJ</AvatarFallback>
              </Avatar>
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-[72px] bottom-0 bg-white border-r border-white/10 transition-all duration-200 z-40 ${
          sidebarCollapsed ? 'w-[80px]' : 'w-[240px]'
        }`}
      >
        <div className="h-full overflow-y-auto py-6">
          {navigationSections.map((section, index) => (
            <div key={section.title} className={index > 0 ? 'mt-6' : ''}>
              {!sidebarCollapsed && (
                <div className="px-6 mb-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {section.title}
                  </p>
                </div>
              )}
              <nav className="space-y-1 px-3">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate?.(item.id)}
                      className={`w-full flex items-center gap-3 px-3 h-[44px] rounded-lg transition-colors relative ${
                        isActive
                          ? 'bg-blue-500/10 text-[#2855a6]'
                          : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#2855a6] rounded-r" />
                      )}
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {!sidebarCollapsed && (
                        <>
                          <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                          {item.badge && (
                            <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-semibold rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`pt-[72px] transition-all duration-200 ${
          sidebarCollapsed ? 'pl-[80px]' : 'pl-[240px]'
        }`}
      >
        <div className="p-8 max-w-[1200px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

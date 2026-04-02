import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import {
  Shield,
  Users,
  AlertTriangle,
  Clock,
  FileText,
  Lock,
  TrendingUp,
  Activity,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Bell,
  BarChart3,
  Eye,
  Network,
  Sparkles,
  Command,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Home,
  AlertCircle
} from 'lucide-react';
import { PartnerDashboard } from './PartnerDashboard';
import { AuditDashboard } from './AuditDashboard';
import { CaseManagement } from './CaseManagement';
import { CaseDetail } from './CaseDetail';
import { GlobalSearch } from './GlobalSearch';
import { ComplianceCopilot } from './ComplianceCopilot';
import { TransactionMonitoring } from './TransactionMonitoring';
import { IntegrationHub } from './IntegrationHub';
import { IndividualOnboarding } from './IndividualOnboarding';
import { ArchitectureViewer } from './ArchitectureViewer';
import { PersonalizedDashboard } from './PersonalizedDashboard';
import { ExecutiveOverview } from './ExecutiveOverview';
import { SystemSettings } from './SystemSettings';
import { ComprehensiveSettings } from './ComprehensiveSettings';
import { ClientDetail } from './ClientDetail';
import { ProfessionRequirements } from './ProfessionRequirements';
import { ClientKYCDashboard } from '../kyc/ClientKYCDashboard';
import { CaseControlCentre, CaseWorkbench } from '../cases';
import { KYCDashboardOverview } from './KYCDashboardOverview';
import { ActionItemsCenter } from './ActionItemsCenter';
import { ClientOnboarding } from '../kyc/ClientOnboarding';
import { HealthCheckDashboard } from './HealthCheckDashboard';
import { EnterpriseUpgradeHub } from './EnterpriseUpgradeHub';

type ViewRole = 'compliance_officer' | 'partner' | 'auditor' | 'analyst';
type View = 
  | 'role_selection'
  | 'architecture_viewer'
  | 'compliance_dashboard'
  | 'partner_dashboard'
  | 'audit_dashboard'
  | 'client_detail'
  | 'kyc_dashboard_overview'
  | 'client_kyc_dashboard'
  | 'action_items'
  | 'case_management'
  | 'case_detail'
  | 'case_control_centre'
  | 'case_workbench'
  | 'transaction_monitoring'
  | 'individual_onboarding'
  | 'client_onboarding'
  | 'system_settings'
  | 'integration_hub'
  | 'health_check'
  | 'profession_requirements'
  | 'enterprise_upgrade_hub';

interface GrowKYCProps {
  onBack?: () => void;
}

export function GrowKYC({ onBack }: GrowKYCProps) {
  const [currentView, setCurrentView] = useState<View>('role_selection');
  const [selectedRole, setSelectedRole] = useState<ViewRole | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('sarah_chen');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // User personas for switching
  const users = [
    { 
      id: 'sarah_chen', 
      name: 'Sarah Chen', 
      role: 'compliance_officer', 
      title: 'Head of Compliance',
      avatar: '👩‍💼',
      description: 'Full AML/CTF oversight and case management'
    },
    { 
      id: 'michael_roberts', 
      name: 'Michael Roberts', 
      role: 'partner', 
      title: 'Managing Partner',
      avatar: '👨‍💼',
      description: 'Executive oversight and approvals'
    },
    { 
      id: 'emma_williams', 
      name: 'Emma Williams', 
      role: 'analyst', 
      title: 'AML Analyst',
      avatar: '👩‍💻',
      description: 'Transaction monitoring and investigations'
    },
    { 
      id: 'david_thompson', 
      name: 'David Thompson', 
      role: 'auditor', 
      title: 'Internal Auditor',
      avatar: '🕵️',
      description: 'Audit trail review and compliance validation'
    },
    { 
      id: 'jessica_lee', 
      name: 'Jessica Lee', 
      role: 'compliance_officer', 
      title: 'Compliance Officer',
      avatar: '👩‍⚖️',
      description: 'KYC verification and EDD management'
    },
    { 
      id: 'robert_kim', 
      name: 'Robert Kim', 
      role: 'partner', 
      title: 'Risk Partner',
      avatar: '👨‍⚖️',
      description: 'Risk framework oversight'
    }
  ];

  const currentUser = users.find(u => u.id === selectedUser) || users[0];

  // Global keyboard shortcut for search (Cmd+K / Ctrl+K)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleRoleSelect = (role: ViewRole) => {
    setSelectedRole(role);
    // Auto-open Compliance Copilot on first login
    setIsCopilotOpen(true);
    switch (role) {
      case 'compliance_officer':
        setCurrentView('compliance_dashboard');
        break;
      case 'partner':
        setCurrentView('partner_dashboard');
        break;
      case 'auditor':
        setCurrentView('audit_dashboard');
        break;
      case 'analyst':
        setCurrentView('compliance_dashboard');
        break;
    }
  };

  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
    setCurrentView('client_detail');
  };

  const handleCaseSelect = (caseId: string) => {
    setSelectedCaseId(caseId);
    setCurrentView('case_detail');
  };

  const handleUserSwitch = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setSelectedUser(userId);
      setSelectedRole(user.role as ViewRole);
      setIsUserMenuOpen(false);
      
      // Navigate to appropriate dashboard
      switch (user.role) {
        case 'compliance_officer':
          setCurrentView('compliance_dashboard');
          break;
        case 'partner':
          setCurrentView('partner_dashboard');
          break;
        case 'auditor':
          setCurrentView('audit_dashboard');
          break;
        case 'analyst':
          setCurrentView('compliance_dashboard');
          break;
      }
    }
  };

  // Role Selection View
  if (currentView === 'role_selection') {
    return (
      <ExecutiveOverview 
        onSelectRole={handleRoleSelect}
        onViewArchitecture={() => setCurrentView('architecture_viewer')}
      />
    );
  }

  // Architecture Viewer
  if (currentView === 'architecture_viewer') {
    return (
      <ArchitectureViewer 
        onBack={() => setCurrentView('role_selection')}
      />
    );
  }

  // Render appropriate dashboard based on current view
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <div className="bg-gradient-to-r from-[#13B5EA] to-[#0E7C9E] border-b border-[#0E7C9E]/20 px-6 py-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Shield className="w-8 h-8 text-white" />
            <div>
              <h1 className="text-2xl font-bold text-white">Grow KYC</h1>
              <p className="text-xs text-white/90">
                {selectedRole === 'compliance_officer' && 'Compliance Officer Portal'}
                {selectedRole === 'partner' && 'Partner Portal'}
                {selectedRole === 'auditor' && 'Audit Portal'}
                {selectedRole === 'analyst' && 'AML Analyst Portal'}
              </p>
            </div>

            {/* User Switcher - Left Side */}
            <div className="relative ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 border-2 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/50"
              >
                <User className="w-4 h-4" />
                <span className="text-lg">{currentUser.avatar}</span>
                <div className="text-left">
                  <div className="text-xs font-semibold">{currentUser.name}</div>
                </div>
                <ChevronDown className={`w-3 h-3 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </Button>

              {isUserMenuOpen && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  
                  {/* Dropdown Menu */}
                  <Card className="absolute left-0 mt-2 w-80 z-50 shadow-2xl border-2 animate-in fade-in slide-in-from-top-2">
                    <CardHeader className="pb-3 bg-gradient-to-r from-[#13B5EA]/10 to-[#0E7C9E]/10">
                      <CardTitle className="text-sm font-semibold text-gray-900">
                        Switch User Persona
                      </CardTitle>
                      <p className="text-xs text-gray-600 mt-1">
                        Demo different user roles and access levels
                      </p>
                    </CardHeader>
                    <CardContent className="p-2">
                      {users.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => handleUserSwitch(user.id)}
                          className={`w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors ${
                            selectedUser === user.id ? 'bg-[#13B5EA]/10 border-2 border-[#13B5EA]' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{user.avatar}</span>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900">{user.name}</span>
                                {selectedUser === user.id && (
                                  <CheckCircle className="w-4 h-4 text-[#13B5EA]" />
                                )}
                              </div>
                              <div className="text-xs text-gray-600">{user.title}</div>
                              <div className="text-xs text-gray-500 mt-1">{user.description}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                      
                      <div className="border-t mt-2 pt-2">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            setCurrentView('role_selection');
                          }}
                          className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-3 text-gray-700"
                        >
                          <LogOut className="w-5 h-5" />
                          <div>
                            <div className="font-semibold">Back to Executive Overview</div>
                            <div className="text-xs text-gray-500">View architecture & select role</div>
                          </div>
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 text-white hover:bg-white/10"
            >
              <Search className="w-4 h-4" />
              Search
              <kbd className="px-2 py-0.5 text-xs bg-white/20 text-white rounded border border-white/30 ml-1">⌘K</kbd>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCopilotOpen(true)}
              className="flex items-center gap-2 text-white hover:bg-white/10"
            >
              <Sparkles className="w-4 h-4" />
              AI Copilot
            </Button>
            <div className="h-6 w-px bg-white/30" />
            
            {/* Home/Dashboard Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (selectedRole === 'compliance_officer') setCurrentView('compliance_dashboard');
                if (selectedRole === 'partner') setCurrentView('partner_dashboard');
                if (selectedRole === 'auditor') setCurrentView('audit_dashboard');
                if (selectedRole === 'analyst') setCurrentView('compliance_dashboard');
              }}
              className="font-semibold text-white hover:bg-white/10"
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedCaseId('temp-case-id');
                setCurrentView('case_control_centre');
              }}
              className="text-white hover:bg-white/10"
            >
              <Shield className="w-4 h-4 mr-2" />
              Case Control
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCurrentView('kyc_dashboard_overview');
              }}
              className="text-white hover:bg-white/10"
            >
              <Eye className="w-4 h-4 mr-2" />
              KYC Dashboard
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentView('action_items')}
              className="text-white hover:bg-white/10 relative"
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              Action Items
              <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                3
              </span>
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => setCurrentView('individual_onboarding')}
              className="bg-white text-[#13B5EA] hover:bg-white/90 font-semibold shadow-lg"
            >
              <Users className="w-4 h-4 mr-2" />
              Client Onboarding
            </Button>
            
            {/* Settings Button - Partner Only */}
            {selectedRole === 'partner' && (
              <>
                <div className="h-6 w-px bg-white/30" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentView('enterprise_upgrade_hub')}
                  className="flex items-center gap-2 text-white hover:bg-white/10"
                >
                  <TrendingUp className="w-4 h-4" />
                  Upgrades
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentView('system_settings')}
                  className="flex items-center gap-2 text-white hover:bg-white/10"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Global Search */}
      <GlobalSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(view, id) => {
          if (view === 'client_detail' && id) {
            handleClientSelect(id);
          } else if (view === 'case_detail' && id) {
            handleCaseSelect(id);
          }
          setIsSearchOpen(false);
        }}
      />

      {/* Compliance Copilot */}
      <ComplianceCopilot 
        isOpen={isCopilotOpen} 
        onClose={() => setIsCopilotOpen(false)}
        context={{
          page: currentView,
          clientId: selectedClientId || undefined,
          caseId: selectedCaseId || undefined
        }}
      />

      {/* Content Area */}
      <div className="bg-white min-h-screen">
        {currentView === 'compliance_dashboard' && (
          <PersonalizedDashboard 
            userName={currentUser.name}
            userRole={currentUser.role}
            userTitle={currentUser.title}
            userAvatar={currentUser.avatar}
            onNavigateToClients={() => setCurrentView('kyc_dashboard_overview')}
            onNavigateToCases={() => setCurrentView('case_management')}
            onNavigateToClient={(clientId) => {
              setSelectedClientId(clientId);
              setCurrentView('client_detail');
            }}
            onNavigateToRequirements={() => setCurrentView('profession_requirements')}
          />
        )}
        {currentView === 'partner_dashboard' && (
          <PersonalizedDashboard 
            userName={currentUser.name}
            userRole={currentUser.role}
            userTitle={currentUser.title}
            userAvatar={currentUser.avatar}
            onNavigateToClients={() => setCurrentView('kyc_dashboard_overview')}
            onNavigateToCases={() => setCurrentView('case_management')}
            onNavigateToClient={(clientId) => {
              setSelectedClientId(clientId);
              setCurrentView('client_detail');
            }}
            onNavigateToRequirements={() => setCurrentView('profession_requirements')}
          />
        )}
        {currentView === 'audit_dashboard' && (
          <PersonalizedDashboard 
            userName={currentUser.name}
            userRole={currentUser.role}
            userTitle={currentUser.title}
            userAvatar={currentUser.avatar}
            onNavigateToClients={() => setCurrentView('kyc_dashboard_overview')}
            onNavigateToCases={() => setCurrentView('case_management')}
            onNavigateToClient={(clientId) => {
              setSelectedClientId(clientId);
              setCurrentView('client_detail');
            }}
            onNavigateToRequirements={() => setCurrentView('profession_requirements')}
          />
        )}
        {currentView === 'client_detail' && selectedClientId && (
          <ClientDetail
            clientId={selectedClientId}
            onBack={() => {
              if (selectedRole === 'compliance_officer') setCurrentView('compliance_dashboard');
              if (selectedRole === 'partner') setCurrentView('partner_dashboard');
              if (selectedRole === 'auditor') setCurrentView('audit_dashboard');
              if (selectedRole === 'analyst') setCurrentView('compliance_dashboard');
            }}
          />
        )}
        {currentView === 'kyc_dashboard_overview' && (
          <KYCDashboardOverview 
            onViewClient={(clientId) => {
              setSelectedClientId(clientId);
              setCurrentView('client_kyc_dashboard');
            }}
          />
        )}
        {currentView === 'client_kyc_dashboard' && selectedClientId && (
          <ClientKYCDashboard 
            clientId={selectedClientId}
            onBack={() => setCurrentView('kyc_dashboard_overview')}
          />
        )}
        {currentView === 'action_items' && (
          <ActionItemsCenter 
            onViewClient={(clientId) => {
              setSelectedClientId(clientId);
              setCurrentView('client_kyc_dashboard');
            }}
          />
        )}
        {currentView === 'case_management' && (
          <CaseManagement
            onViewCase={handleCaseSelect}
            onBack={() => {
              if (selectedRole === 'compliance_officer') setCurrentView('compliance_dashboard');
              if (selectedRole === 'partner') setCurrentView('partner_dashboard');
              if (selectedRole === 'auditor') setCurrentView('audit_dashboard');
              if (selectedRole === 'analyst') setCurrentView('compliance_dashboard');
            }}
          />
        )}
        {currentView === 'case_detail' && selectedCaseId && (
          <CaseDetail
            caseId={selectedCaseId}
            onBack={() => setCurrentView('case_management')}
          />
        )}
        {currentView === 'case_control_centre' && selectedCaseId && (
          <CaseControlCentre />
        )}
        {currentView === 'case_workbench' && selectedCaseId && (
          <CaseWorkbench />
        )}
        {currentView === 'transaction_monitoring' && (
          <TransactionMonitoring
            onBack={() => {
              if (selectedRole === 'compliance_officer') setCurrentView('compliance_dashboard');
              if (selectedRole === 'partner') setCurrentView('partner_dashboard');
              if (selectedRole === 'auditor') setCurrentView('audit_dashboard');
              if (selectedRole === 'analyst') setCurrentView('compliance_dashboard');
            }}
          />
        )}
        {currentView === 'individual_onboarding' && (
          <IndividualOnboarding
            onBack={() => {
              if (selectedRole === 'compliance_officer') setCurrentView('compliance_dashboard');
              if (selectedRole === 'partner') setCurrentView('partner_dashboard');
              if (selectedRole === 'auditor') setCurrentView('audit_dashboard');
              if (selectedRole === 'analyst') setCurrentView('compliance_dashboard');
            }}
          />
        )}
        {currentView === 'client_onboarding' && (
          <ClientOnboarding
            onBack={() => {
              if (selectedRole === 'compliance_officer') setCurrentView('compliance_dashboard');
              if (selectedRole === 'partner') setCurrentView('partner_dashboard');
              if (selectedRole === 'auditor') setCurrentView('audit_dashboard');
              if (selectedRole === 'analyst') setCurrentView('compliance_dashboard');
            }}
          />
        )}
        {currentView === 'system_settings' && (
          <ComprehensiveSettings
            onBack={() => {
              if (selectedRole === 'compliance_officer') setCurrentView('compliance_dashboard');
              if (selectedRole === 'partner') setCurrentView('partner_dashboard');
              if (selectedRole === 'auditor') setCurrentView('audit_dashboard');
              if (selectedRole === 'analyst') setCurrentView('compliance_dashboard');
            }}
          />
        )}
        {currentView === 'integration_hub' && (
          <IntegrationHub
            onBack={() => {
              if (selectedRole === 'compliance_officer') setCurrentView('compliance_dashboard');
              if (selectedRole === 'partner') setCurrentView('partner_dashboard');
              if (selectedRole === 'auditor') setCurrentView('audit_dashboard');
              if (selectedRole === 'analyst') setCurrentView('compliance_dashboard');
            }}
          />
        )}
        {currentView === 'profession_requirements' && selectedRole && (
          <ProfessionRequirements
            profession={selectedRole}
            onBack={() => {
              if (selectedRole === 'compliance_officer') setCurrentView('compliance_dashboard');
              if (selectedRole === 'partner') setCurrentView('partner_dashboard');
              if (selectedRole === 'auditor') setCurrentView('audit_dashboard');
              if (selectedRole === 'analyst') setCurrentView('compliance_dashboard');
            }}
          />
        )}
        {currentView === 'health_check' && (
          <HealthCheckDashboard
            onBack={() => {
              if (selectedRole === 'compliance_officer') setCurrentView('compliance_dashboard');
              if (selectedRole === 'partner') setCurrentView('partner_dashboard');
              if (selectedRole === 'auditor') setCurrentView('audit_dashboard');
              if (selectedRole === 'analyst') setCurrentView('compliance_dashboard');
            }}
          />
        )}
        {currentView === 'enterprise_upgrade_hub' && (
          <EnterpriseUpgradeHub
            onBack={() => {
              if (selectedRole === 'compliance_officer') setCurrentView('compliance_dashboard');
              if (selectedRole === 'partner') setCurrentView('partner_dashboard');
              if (selectedRole === 'auditor') setCurrentView('audit_dashboard');
              if (selectedRole === 'analyst') setCurrentView('compliance_dashboard');
            }}
          />
        )}
      </div>
    </div>
  );
}
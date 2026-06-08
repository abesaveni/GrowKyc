import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Routes, Route, Navigate, useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Briefcase,
  Gavel,
  FileText,
  Settings,
  Bell,
  Shield,
  LogOut,
  Menu,
  X,
  Building2,
  User,
  BarChart3,
  FolderOpen,
  Activity,
  HelpCircle,
  MessageSquare,
  Search,
  Brain,
  Mail,
  MoreHorizontal,
  CheckSquare,
  FileSignature,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import { Button } from './components/ui/button';
import { AUSTRACControlCentre } from './components/austrac';
import { Avatar, AvatarFallback } from './components/ui/avatar';
import { Toaster, toast } from 'sonner';
import { BorrowerDashboard } from './components/dashboards/BorrowerDashboard';
import { LenderDashboard } from './components/dashboards/LenderDashboard';
import { InvestorDashboard } from './components/dashboards/InvestorDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { EnterpriseLenderDashboard } from './components/dashboards/EnterpriseLenderDashboard';
import { EnterpriseInvestorDashboard } from './components/dashboards/EnterpriseInvestorDashboard';
import { EnterpriseBorrowerDashboard } from './components/dashboards/EnterpriseBorrowerDashboard';
import { CaseWorkspace } from './components/case/CaseWorkspace';
import { CaseCreationForm } from './components/case/CaseCreationForm';
import { AuctionRoom } from './components/auction/AuctionRoom';
import { AuctionsList } from './components/auctions/AuctionsList';
import { SignInPage } from './components/auth/SignInPage';
import { OnboardingWizard } from './components/auth/OnboardingWizard';
import { IdentityVerification } from './components/kyc/IdentityVerification';
import { SimulatedAUSTRACAudit } from './components/kyc/SimulatedAUSTRACAudit';
import { TestIdVerification } from './components/kyc/TestIdVerification';
import { AMLCTFEnhancedChecksPricing } from './components/kyc/AMLCTFEnhancedChecksPricing';
import { ContractSigning } from './components/contracts/ContractSigning';
import { ContractsList } from './components/contracts/ContractsList';
import { EscrowRelease } from './components/escrow/EscrowRelease';
import { DealList } from './components/deals/DealList';
import { AdminKYCReview } from './components/admin/AdminKYCReview';
import { KYCReviewDetail } from './components/admin/KYCReviewDetail';
import { NotificationsInbox } from './components/notifications/NotificationsInbox';
import { CaseManagement } from './components/admin/CaseManagement';

import { UserProfile } from './components/profile/UserProfile';
import { BuyNowRoom } from './components/buynow/BuyNowRoom';
import { PaymentPage } from './components/payment/PaymentPage';
import { ReportsDashboard } from './components/reports/ReportsDashboard';
import { DocumentLibrary } from './components/documents/DocumentLibrary';
import { ActivityFeed } from './components/activity/ActivityFeed';
import { HelpCenter as OldHelpCenter } from './components/help/HelpCenter';
import { SupportTickets } from './components/support/SupportTickets';
import { UniversalSearch } from './components/grow/UniversalSearch';
import { CRMSales } from './components/grow/CRMSales';
import { ClientManagementHub } from './components/onboarding/ClientManagementHub';
import { GrowSignIn } from './components/grow/GrowSignIn';
import { GrowDashboard } from './components/grow/GrowDashboard';
import { PublicSite } from './public-site/PublicSite'; // Add this import
import { FirmDashboard } from './components/grow-accounting/FirmDashboard';
import { JobsKanban } from './components/grow-accounting/JobsKanban';
import { ClientsList } from './components/grow-accounting/ClientsList';
import { Workpapers } from './components/grow-accounting/Workpapers';
import { WorkpaperEditor } from './components/grow-accounting/WorkpaperEditor';
import { JobDetail } from './components/grow-accounting/JobDetail';
import { DocumentUpload } from './components/grow-accounting/DocumentUpload';
import { DocumentManagement } from './components/grow-accounting/DocumentManagement';
import { ClientDetail } from './components/grow-accounting/ClientDetail';
import { Analytics } from './components/grow-accounting/Analytics';
import { Checklists } from './components/grow-accounting/Checklists';
import { Integrations } from './components/grow-accounting/Integrations';
import { ClientPortal } from './components/grow-accounting/ClientPortal';
import { TimeTracking } from './components/grow-accounting/TimeTracking';
import { CalendarView } from './components/grow-accounting/CalendarView';
import { RecurringJobs } from './components/grow-accounting/RecurringJobs';
import { EmailIntegration } from './components/grow-accounting/EmailIntegration';
import { ResourceManagement } from './components/grow-accounting/ResourceManagement';
import { WorkflowBuilder } from './components/grow-accounting/WorkflowBuilder';
import { ClientOnboarding } from './components/onboarding/ClientOnboarding';
import { EnterpriseOnboarding } from './components/kyc/EnterpriseOnboarding';
import { ClientOnboardingPortal } from './components/kyc/ClientOnboardingPortal';
import { EnhancedClientPortal } from './components/onboarding/EnhancedClientPortal';
import { IntegrationsDashboard } from './components/onboarding/IntegrationManager';
import { WorkpaperBuilder } from './components/grow-accounting/WorkpaperBuilder';
import { GlobalSearch } from './components/grow-kyc/GlobalSearch';
import { EnhancedWorkpaperEditor } from './components/grow-accounting/EnhancedWorkpaperEditor';
import { ReviewQueue } from './components/grow-accounting/ReviewQueue';
import { ReviewMode } from './components/grow-accounting/ReviewMode';
import { SignoffSummary } from './components/grow-accounting/SignoffSummary';
import { ExcelWorkpaperBuilder } from './components/grow-accounting/ExcelWorkpaperBuilder';
import { ExcelWorkpaperEditor } from './components/grow-accounting/ExcelWorkpaperEditor';
import { ExcelReviewMode } from './components/grow-accounting/ExcelReviewMode';
import { ExcelSignoffSummary } from './components/grow-accounting/ExcelSignoffSummary';
import { XeroIntegration } from './components/grow-accounting/XeroIntegration';
import { XeroMapping } from './components/grow-accounting/XeroMapping';
import { ApexDashboard } from './components/grow-accounting/ApexDashboard';
import { TrialBalanceCore } from './components/grow-accounting/TrialBalanceCore';
import { AIReviewEngine } from './components/grow-accounting/AIReviewEngine';
import { BinderGenerator } from './components/grow-accounting/BinderGenerator';
import { RiskDashboard } from './components/grow-accounting/RiskDashboard';
import { WorkpaperManager } from './components/grow-accounting/WorkpaperManager';
import { LeadScheduleEditor } from './components/grow-accounting/LeadScheduleEditor';
import { Division7AForm } from './components/grow-accounting/Division7AForm';
import { ChecklistWorkpaper } from './components/grow-accounting/ChecklistWorkpaper';
import { TaxReconciliation } from './components/grow-accounting/TaxReconciliation';
import { CashReconciliation } from './components/grow-accounting/CashReconciliation';
import { ReceivablesSchedule } from './components/grow-accounting/ReceivablesSchedule';
import { InventorySchedule } from './components/grow-accounting/InventorySchedule';
import { FixedAssetsSchedule } from './components/grow-accounting/FixedAssetsSchedule';
import { PayablesSchedule } from './components/grow-accounting/PayablesSchedule';
import { GSTBASWorkpaper } from './components/grow-accounting/GSTBASWorkpaper';
import { PayrollSuperWorkpaper } from './components/grow-accounting/PayrollSuperWorkpaper';
import { EquitySchedule } from './components/grow-accounting/EquitySchedule';
import { XeroSyncManager } from './components/grow-accounting/XeroSyncManager';
import { JournalPushControl } from './components/grow-accounting/JournalPushControl';
import { GrowHQDashboard } from './components/grow-hq/GrowHQDashboard';
import { UserManagement } from './components/grow-hq/UserManagement';
import { AccessControl } from './components/grow-hq/AccessControl';
import { ModuleSettings } from './components/grow-hq/ModuleSettings';
import { IntegrationArchitecture } from './components/grow-hq/IntegrationArchitecture';
import { TaskCenter } from './components/TaskCenter';
import { IntegrationsHub } from './components/grow-hq/IntegrationsHub';
import { IntegrationsHub as NewIntegrationsHub } from './components/integrations/IntegrationsHub';
import { IntegrationsDemo } from './components/demo/IntegrationsDemo';
import { IntegrationsLanding } from './components/integrations/IntegrationsLanding';
import { ClientList } from './components/kyc/ClientList';
import { HelpCenter } from './components/grow-hq/HelpCenter';
import { MultiFirmManagement } from './components/grow-hq/MultiFirmManagement';
import { EnquiriesManagement } from './components/pfa/EnquiriesManagement';
import { BrokerDashboard } from './components/pfa/BrokerDashboard';
import { NewApplication } from './components/pfa/NewApplication';
import { CreditQueue } from './components/pfa/CreditQueue';
import { LoanLedger } from './components/pfa/LoanLedger';
import { ArrearsManagement } from './components/pfa/ArrearsManagement';
import { Pipeline } from './components/pfa/Pipeline';
import { DealView } from './components/pfa/DealView';
import { BorrowerPortal } from './components/pfa/BorrowerPortal';
import { Commission } from './components/pfa/Commission';
import { Reports } from './components/pfa/Reports';
import { Clients } from './components/pfa/Clients';
import { IMFOModule } from './components/imfo/IMFOModule';
import { IMFOPlatformModule } from './components/imfo/IMFOPlatformModule';
import { OneCoreCRM } from './components/onecore/OneCoreCRM';
import { UltimateDocumentManager } from './components/document-manager/UltimateDocumentManager';
import { NowWorkOS } from './components/nowwork/NowWorkOS';
import { PaymentGateway } from './components/payment-gateway/PaymentGateway';
import { SettlementChecklistManagerWrapper } from './components/settlement/SettlementChecklistManagerWrapper';
import { ModuleSwitcher } from './components/common/ModuleSwitcher';
import { FileUploadManager } from './components/storage/FileUploadManager';
import { AIAdminDashboard } from './components/admin/AIAdminDashboard';
import { EmailNotificationCenter } from './components/email-system/EmailNotificationCenter';
import { ClientCommunications } from './components/communications/ClientCommunications';
import { ESignatureSystem } from './components/esignature/ESignatureSystem';
import { GrowESign } from './components/grow-esign/GrowESign';
import { GrowESignPlatform } from './components/govsign/GovSign';
import { mockCurrentUser, mockCases } from './data/mockData';
import logo from '../assets/60b7d162929b5cb780f781445f70fa18c2c16326.png';
import { SettingsPage } from './components/settings/SettingsPage';
import { PEXADashboard } from './components/pexa/PEXADashboard';
import { TestButton } from './components/TestButton';
import { NotificationSettings } from './components/settings/NotificationSettings';
import { OrganizationSettings } from './components/settings/OrganizationSettings';
import { ProfileSettings } from './components/settings/ProfileSettings';
import { SecuritySettings } from './components/settings/SecuritySettings';
import { logger } from '../lib/logger';

const AtlasPracticeOS = lazy(() => import('./components/grow-accounting/AtlasPracticeOS'));
const PFAModule = lazy(() => import('./components/pfa/PFAModule').then((m) => ({ default: m.PFAModule })));
const ReceivershipOS = lazy(() => import('./components/imfo/ReceivershipOS').then((m) => ({ default: m.ReceivershipOS })));
const SettlementPortal = lazy(() => import('./components/settlement-portal/SettlementPortal'));
const ApexTrust = lazy(() => import('./components/apex-trust/ApexTrust'));
const GrowKYCApp = lazy(() => import('./components/GrowKYCApp').then((m) => ({ default: m.GrowKYCApp })));
const UltimateOS = lazy(() => import('./components/ultimate-os/UltimateOS').then((m) => ({ default: m.UltimateOS })));
const QLDAssociation = lazy(() => import('./components/qld-association/QLDAssociation').then((m) => ({ default: m.QLDAssociation })));

function getRuntimeEnv(): Record<string, string | boolean | undefined> {
  const viteEnv = (typeof import.meta !== 'undefined' ? (import.meta as any).env : {}) || {};
  const processEnv = ((globalThis as any)?.process?.env || {}) as Record<string, string>;
  return { ...processEnv, ...viteEnv };
}

function isFlagEnabled(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const normalized = value.trim().toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes' || normalized === 'on';
}

function getBlockedLegacyPath(pathname: string): string | null {
  const normalizedPath = pathname.toLowerCase();
  const blockedPrefixes = ['/Grow MIP', '/demo', '/test', '/admin'];

  for (const prefix of blockedPrefixes) {
    if (normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`)) {
      return prefix;
    }
  }

  return null;
}

function getRequestedModule(): Module | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const requestedModule = new URLSearchParams(window.location.search).get('module');
  if (!requestedModule) {
    return null;
  }

  const allowedModules: Module[] = ['grow_kyc', 'public_site', 'grow_accounting'];
  return allowedModules.includes(requestedModule as Module) ? (requestedModule as Module) : null;
}

type Page =
  | 'signin'
  | 'onboarding'
  | 'dashboard'
  | 'apex-dashboard'
  | 'jobs'
  | 'job-detail'
  | 'workpapers'
  | 'workpaper-new'
  | 'workpaper-detail'
  | 'workpaper-builder'
  | 'review-queue'
  | 'review-mode'
  | 'signoff'
  | 'clients'
  | 'client-detail'
  | 'checklists'
  | 'portal'
  | 'integrations'
  | 'xero-integration'
  | 'xero-mapping'
  | 'workflows'
  | 'analytics'
  | 'audit'
  | 'trial-balance'
  | 'ai-review'
  | 'binder-generator'
  | 'risk-dashboard'
  | 'workpaper-manager'
  | 'lead-schedule-editor'
  | 'division-7a-form'
  | 'checklist-workpaper'
  | 'tax-reconciliation'
  | 'cash-reconciliation'
  | 'receivables-schedule'
  | 'inventory-schedule'
  | 'fixed-assets-schedule'
  | 'payables-schedule'
  | 'gst-bas-workpaper'
  | 'payroll-super-workpaper'
  | 'equity-schedule'
  | 'evidence-checklist'
  | 'xero-sync-manager'
  | 'journal-push-control'
  | 'ledger-sync'
  | 'deals'
  | 'cases'
  | 'case'
  | 'case_detail'
  | 'auctions'
  | 'auction_room'
  | 'buy_now_room'
  | 'payment'
  | 'kyc'
  | 'aml_checks_pricing'
  | 'test_id_verification'
  | 'contracts'
  | 'contract_sign'
  | 'escrow'
  | 'admin_kyc'
  | 'admin_kyc_detail'
  | 'admin'
  | 'ai_admin'
  | 'Grow MIP_approvals'
  | 'email_center'
  | 'client_communications'
  | 'esignature'
  | 'tasks'
  | 'notifications'
  | 'reports'
  | 'documents'
  | 'activity'
  | 'help'
  | 'support'
  | 'search'
  | 'crm'
  | 'user_profile'
  | 'settings'
  | 'settings_profile'
  | 'settings_organization'
  | 'settings_security'
  | 'settings_notifications'
  | 'user_management'
  | 'access_control'
  | 'module_settings'
  | 'integration_architecture'
  | 'integrations_hub'
  | 'integrations_hub_new'
  | 'integrations_demo'
  | 'integrations_landing'
  | 'client_list'
  | 'multi_firm_management'
  | 'client_portal'
  | 'settlement'
  | 'pexa'
  | 'pexa_workspace'
  | 'pfa-enquiries'
  | 'pfa-pipeline'
  | 'pfa-settlements'
  | 'pfa-loan-book'
  | 'pfa-calculator'
  | 'pfa-documents'
  | 'pfa-reports'
  | 'pfa-clients'
  | 'broker-calculator'
  | 'broker-documents'
  | 'lender-credit-queue'
  | 'broker-new-application'
  | 'broker-pipeline'
  | 'broker-commission'
  | 'broker-reports'
  | 'broker-clients'
  | 'broker-dashboard'
  | 'lender-deal-view'
  | 'lender-loan-ledger'
  | 'lender-arrears'
  | 'user_management'
  | 'access_control'
  | 'module_settings'
  | 'Grow MIP_approvals'
  | 'borrower-portal';

type UserRole = 'borrower' | 'lender' | 'investor' | 'admin' | 'lawyer' | 'receiver' | 'credit' | 'super_admin' | 'ai_admin' | 'Grow MIP_approvals';

type Module = 'Grow MIP' | 'grow_accounting' | 'grow_lending' | 'grow_investments' | 'grow_receivership' | 'grow_kyc' | 'grow_crm' | 'grow_time' | 'grow_hq' | 'grow_payments' | 'grow_settlement' | 'grow_trust' | 'grow_esign' | 'ultimate_os' | 'qld_association' | 'atlas_practice' | 'public_site' | 'pfa' | 'test_storage';

export default function App() {
  const runtimeEnv = getRuntimeEnv();
  const isProductionRuntime =
    Boolean((import.meta as any)?.env?.PROD) ||
    runtimeEnv.NODE_ENV === 'production' ||
    runtimeEnv.VITE_APP_ENV === 'production';
  const allowLegacyModulesInProduction = isFlagEnabled(runtimeEnv.VITE_ENABLE_LEGACY_MODULES);
  const allowDemoInProduction = isFlagEnabled(runtimeEnv.VITE_ENABLE_INTEGRATIONS_DEMO);
  const blockLegacyModulesInProduction = isProductionRuntime && !allowLegacyModulesInProduction;
  const blockedLegacyPath =
    typeof window !== 'undefined' ? getBlockedLegacyPath(window.location.pathname) : null;
  const requestedModule = getRequestedModule();

  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('investor'); // Now switchable via dropdown
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Changed back to true - access via dropdown now
  const [showPublicSite, setShowPublicSite] = useState(false); // No longer needed as primary flow
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentModule, setCurrentModule] = useState<Module>(requestedModule ?? 'grow_kyc');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [navigationHistory, setNavigationHistory] = useState<Page[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<{
    page: Page;
    label: string;
    timestamp: Date;
  }[]>([]);

  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const location = useLocation();
  const routerNavigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);


  // Track recently viewed items
  const trackView = (page: Page, label: string) => {
    setRecentlyViewed(prev => [
      { page, label, timestamp: new Date() },
      ...prev.filter(v => v.label !== label)
    ].slice(0, 5)); // Keep only last 5
  };

  // Navigation helper with history tracking
  const navigateTo = (page: Page, caseId?: string, label?: string) => {
    if (currentPage !== page) {
      setNavigationHistory([...navigationHistory, currentPage]);
      setCurrentPage(page);
      if (caseId) {
        setSelectedCaseId(caseId);
      }
      // Track view if label provided
      if (label) {
        trackView(page, label);
      }
    }
  };

  // Context-aware back navigation
  const goBack = () => {
    if (navigationHistory.length > 0) {
      const previousPage = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(navigationHistory.slice(0, -1));
      setCurrentPage(previousPage);
    } else {
      // Default fallback
      setCurrentPage('dashboard');
    }
  };

  // Navigation helper to view case details
  const navigateToCaseDetail = (caseId: string) => {
    // Track the view with case number
    const caseData = mockCases.find(c => c.id === caseId);
    navigateTo('case_detail', caseId, caseData?.caseNumber || 'Case');
  };

  // Handle module switching
  const handleModuleChange = (module: Module) => {
    // Hard production guard for legacy modules
    if (blockLegacyModulesInProduction && module !== 'grow_kyc') {
      toast.error('Blocked in production: legacy modules are disabled');
      setCurrentModule('grow_kyc');
      setCurrentPage('dashboard');
      return;
    }

    // Current runtime only allows Grow KYC module
    if (module !== 'grow_kyc' && module !== 'public_site') {
      toast.error('Access Denied: Only Grow KYC and the public site preview are available');
      return;
    }
    setCurrentModule(module);
    setCurrentPage('dashboard'); // Reset to dashboard on module switch
  };

  // Handle navigation from public site
  const handlePublicSiteNavigation = (destination: string) => {
    if (destination === 'login') {
      setShowPublicSite(false);
      setCurrentPage('signin');
    } else if (destination === 'signup') {
      setShowPublicSite(false);
      setCurrentPage('onboarding');
    }
  };

  // Finance / IMFO dashboard (React Router: /finance/*)
  if (location.pathname.startsWith('/finance')) {
    return (
      <div>
        <Toaster position="top-right" richColors />
        <ModuleSwitcher
          currentModule="grow_investments"
          onSwitchModule={(module) => {
            handleModuleChange(module as Module);
            if (module !== 'grow_investments') {
              routerNavigate(module === 'grow_kyc' ? '/compliance/dashboard' : '/');
            }
          }}
        />
        <IMFOModule
          onSwitchModule={(module) => {
            if (module === 'grow_kyc') {
              handleModuleChange('grow_kyc');
              routerNavigate('/compliance/dashboard');
            } else {
              handleModuleChange(module as Module);
            }
          }}
        />
      </div>
    );
  }

  if (isProductionRuntime && blockedLegacyPath) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-3xl mx-auto bg-white border-2 border-red-300 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-red-700 mb-2">Blocked in Production</h2>
          <p className="text-gray-700">This legacy route is disabled in production runtime.</p>
          <p className="text-sm text-gray-600 mt-2">Blocked path prefix: {blockedLegacyPath}</p>
        </div>
      </div>
    );
  }

  // Show public marketing site
  if (showPublicSite && !isAuthenticated) {
    return (
      <>
        <Toaster position="top-right" richColors />
        <PublicSite onNavigate={handlePublicSiteNavigation} />
      </>
    );
  }

  // Show auth pages if not authenticated
  if (!isAuthenticated) {
    if (currentPage === 'onboarding') {
      return (
        <>
          <Toaster position="top-right" richColors />
          <OnboardingWizard />
        </>
      );
    }
    return (
      <>
        <Toaster position="top-right" richColors />
        <SignInPage />
      </>
    );
  }

  // COMPLETELY SEPARATE MODULE: Grow Accounting
  // Different clients, different users, separate navigation
  if (currentModule === 'grow_accounting') {
    return (
      <div>
        <Toaster position="top-right" richColors />
        <ModuleSwitcher
          currentModule={currentModule}
          onSwitchModule={(module) => handleModuleChange(module as Module)}
        />
        <FirmDashboard onNavigate={(page) => setCurrentPage(page as Page)} />
      </div>
    );
  }

  // Atlas Practice OS - Full 5,000 client accounting system
  if (currentModule === 'atlas_practice') {
    return (
      <div>
        <Toaster position="top-right" richColors />
        <ModuleSwitcher
          currentModule={currentModule}
          onSwitchModule={(module) => handleModuleChange(module as Module)}
        />
        <Suspense fallback={<div className="p-8 text-gray-600">Loading Atlas Practice OS...</div>}>
          <AtlasPracticeOS userRole="partner" onNavigate={(page) => setCurrentPage(page as Page)} />
        </Suspense>
      </div>
    );
  }

  // Test File Storage
  if (currentModule === 'test_storage') {
    if (blockLegacyModulesInProduction) {
      return (
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="max-w-3xl mx-auto bg-white border-2 border-red-300 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-red-700 mb-2">Blocked in Production</h2>
            <p className="text-gray-700">Legacy test storage module is disabled in production runtime.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">File Storage Demo</h1>
              <p className="text-sm text-gray-600">Test file upload, download, and management</p>
            </div>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium"
              onChange={(e) => setCurrentModule(e.target.value as any)}
              value={currentModule}
            >
              <option value="test_storage">File Storage Demo</option>
              <option value="Grow MIP">Switch to Grow MIP</option>
              <option value="grow_accounting">Switch to Grow Accounting</option>
              <option value="grow_hq">Switch to Grow HQ</option>
            </select>
          </div>
        </div>
        <div className="p-6 max-w-6xl mx-auto">
          <FileUploadManager
            module="grow_accounting"
            folder="workpapers"
          />
        </div>
      </div>
    );
  }

  // PFA MODULE: Loan Management System
  if (currentModule === 'grow_lending') {
    return (
      <div>
        <Toaster position="top-right" richColors />
        <ModuleSwitcher
          currentModule={currentModule}
          onSwitchModule={(module) => handleModuleChange(module as Module)}
        />
        <Suspense fallback={<div className="p-8 text-gray-600">Loading Grow Lending...</div>}>
          <PFAModule onSwitchModule={(module) => handleModuleChange(module as Module)} />
        </Suspense>
      </div>
    );
  }

  // IMFO MODULE: Investment Management & Fund Operations (finance dashboard)
  if (currentModule === 'grow_investments') {
    return <Navigate to="/finance/dashboard" replace />;
  }

  // RECEIVERSHIP OS MODULE: MIP & Restructuring
  if (currentModule === 'grow_receivership') {
    return (
      <div>
        <Toaster position="top-right" richColors />
        <ModuleSwitcher
          currentModule={currentModule}
          onSwitchModule={(module) => handleModuleChange(module as Module)}
        />
        <Suspense fallback={<div className="p-8 text-gray-600">Loading Receivership OS...</div>}>
          <ReceivershipOS onSwitchModule={(module) => handleModuleChange(module as Module)} />
        </Suspense>
      </div>
    );
  }

  // ONECORE CRM MODULE: Unified CRM Platform
  if (currentModule === 'grow_crm') {
    return (
      <div>
        <Toaster position="top-right" richColors />
        <ModuleSwitcher
          currentModule={currentModule}
          onSwitchModule={(module) => handleModuleChange(module as Module)}
        />
        <OneCoreCRM onSwitchModule={(module) => handleModuleChange(module as Module)} />
      </div>
    );
  }

  // NOWWORK OS MODULE: Time & Revenue
  if (currentModule === 'grow_time') {
    return (
      <div>
        <Toaster position="top-right" richColors />
        <ModuleSwitcher
          currentModule={currentModule}
          onSwitchModule={(module) => handleModuleChange(module as Module)}
        />
        <NowWorkOS onSwitchModule={(module) => handleModuleChange(module as Module)} />
      </div>
    );
  }

  // PAYMENT GATEWAY MODULE: Payment Processing
  if (currentModule === 'grow_payments') {
    return (
      <div>
        <Toaster position="top-right" richColors />
        <ModuleSwitcher
          currentModule={currentModule}
          onSwitchModule={(module) => handleModuleChange(module as Module)}
        />
        <PaymentGateway onSwitchModule={(module) => handleModuleChange(module as Module)} />
      </div>
    );
  }

  // SETTLEMENT PORTAL MODULE: Settlement Management
  if (currentModule === 'grow_settlement') {
    return (
      <div>
        <Toaster position="top-right" richColors />
        <ModuleSwitcher
          currentModule={currentModule}
          onSwitchModule={(module) => handleModuleChange(module as Module)}
        />
        <Suspense fallback={<div className="p-8 text-gray-600">Loading Settlement Portal...</div>}>
          <SettlementPortal onSwitchModule={(module) => handleModuleChange(module as Module)} />
        </Suspense>
      </div>
    );
  }

  // GROW TRUST MODULE: Trust Management
  if (currentModule === 'grow_trust') {
    return (
      <div>
        <Toaster position="top-right" richColors />
        <ModuleSwitcher
          currentModule={currentModule}
          onSwitchModule={(module) => handleModuleChange(module as Module)}
        />
        <Suspense fallback={<div className="p-8 text-gray-600">Loading Apex Trust...</div>}>
          <ApexTrust onSwitchModule={(module) => handleModuleChange(module as Module)} />
        </Suspense>
      </div>
    );
  }

  // GROW E-SIGN MODULE: Enterprise E-Signature Platform
  if (currentModule === 'grow_esign') {
    return (
      <div>
        <Toaster position="top-right" richColors />
        <ModuleSwitcher
          currentModule={currentModule}
          onSwitchModule={(module) => handleModuleChange(module as Module)}
        />
        <GrowESign onSwitchModule={(module) => handleModuleChange(module as Module)} />
      </div>
    );
  }

  // ULTIMATE OS MODULE: Universal Business Operating System
  if (currentModule === 'ultimate_os') {
    return (
      <div>
        <Toaster position="top-right" richColors />
        <Suspense fallback={<div className="p-8 text-gray-600">Loading Ultimate OS...</div>}>
          <UltimateOS />
        </Suspense>
      </div>
    );
  }

  // QLD ASSOCIATION MODULE: Community Association Operating System
  if (currentModule === 'qld_association') {
    return (
      <div>
        <Toaster position="top-right" richColors />
        <ModuleSwitcher
          currentModule={currentModule}
          onSwitchModule={(module) => handleModuleChange(module as Module)}
        />
        <Suspense fallback={<div className="p-8 text-gray-600">Loading QLD Association...</div>}>
          <QLDAssociation onSwitchModule={(module) => handleModuleChange(module as Module)} />
        </Suspense>
      </div>
    );  
  }

  // GROW KYC MODULE: Regulatory Compliance & KYC Operating System
  if (currentModule === 'grow_kyc') {
    return (
      <div>
        <Toaster position="top-right" richColors />
        <Suspense fallback={<div className="p-8 text-gray-600">Loading Grow KYC...</div>}>
          <Routes>
            <Route
              path="/au/*"
              element={
                <AUSTRACControlCentre
                  navigateTo={navigateTo}
                  goBack={goBack}
                  defaultSelectedCaseId={selectedCaseId}
                />
              }
            />
            <Route path="/settings" element={<SettingsPage />}>
              <Route index element={<Navigate to="profile" replace />} />
              <Route path="profile" element={<ProfileSettings onBack={() => {}} />} />
              <Route path="organisation" element={<OrganizationSettings onBack={() => {}} />} />
              <Route path="security" element={<SecuritySettings onBack={() => {}} />} />
              <Route path="notifications" element={<NotificationSettings onBack={() => {}} />} />
            </Route>

            <Route path="/settings" element={<SettingsPage />} />

            <Route
              path="/compliance"
              element={<Navigate to="/compliance/dashboard" replace />}
            />

            {/* Catch-all to let GrowKYCApp handle routing at root level */}
            <Route
              path="/partner"
              element={<Navigate to="/partner/dashboard" replace />}
            />

            <Route
              path="/auditor"
              element={<Navigate to="/auditor/dashboard" replace />}
            />

            <Route
              path="/aml-analyst"
              element={<Navigate to="/aml-analyst/dashboard" replace />}
            />

            <Route
              path="/testing/audit"
              element={<SimulatedAUSTRACAudit />}
            />
            <Route path="/*" element={<GrowKYCApp />} />
          </Routes>
        </Suspense>
      </div>
    );
  }

  // Explicit runtime hard block for any legacy module in production.
  if (blockLegacyModulesInProduction) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-3xl mx-auto bg-white border-2 border-red-300 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-red-700 mb-2">Blocked in Production</h2>
          <p className="text-gray-700">Legacy modules are disabled in production runtime.</p>
          <p className="text-sm text-gray-600 mt-2">Blocked module: {currentModule}</p>
        </div>
      </div>
    );
  }

  // PUBLIC SITE MODULE: Preview the public marketing website
  if (currentModule === 'public_site') {
    if (blockLegacyModulesInProduction) {
      return (
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="max-w-3xl mx-auto bg-white border-2 border-red-300 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-red-700 mb-2">Blocked in Production</h2>
            <p className="text-gray-700">Public site preview module is disabled in production runtime.</p>
          </div>
        </div>
      );
    }

    return (
      <>
        <Toaster position="top-right" richColors />
        <PublicSite onNavigate={(destination) => {
          // When navigating from public site preview, just switch back to a module
          if (destination === 'login' || destination === 'signup') {
            toast.info('This is a preview. In production, this would navigate to authentication.');
            setCurrentModule('grow_kyc');
          }
        }} />
      </>
    );
  }

  // Role-based navigation configuration
  const getNavigationItems = () => {
    // Grow HQ has its own special navigation - admin only
    if (currentModule === 'grow_hq') {
      return [
        { id: 'dashboard', label: 'Overview', icon: Home },
        { id: 'user_management', label: 'User Management', icon: User },
        { id: 'access_control', label: 'Access Control', icon: Shield },
        { id: 'module_settings', label: 'Module Settings', icon: Settings },
        { id: 'help', label: 'Help Center', icon: HelpCircle }
      ];
    }

    // Standard navigation for other modules
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home, roles: ['borrower', 'lender', 'investor', 'admin'] },
      { id: 'tasks', label: 'Task Center', icon: CheckSquare, roles: ['borrower', 'lender', 'investor', 'admin', 'lawyer', 'receiver', 'credit', 'super_admin'] },
      { id: 'notifications', label: 'Notifications', icon: Bell, roles: ['borrower', 'lender', 'investor', 'admin', 'lawyer', 'receiver'] },
      { id: 'settings', label: 'Settings', icon: Settings, roles: ['borrower', 'lender', 'investor', 'admin'] }
    ];

    // Add Borrower Portal only in PFA module
    if (currentModule === 'pfa') {
      baseItems.splice(1, 0, { id: 'borrower-portal', label: 'Borrower Portal', icon: User, roles: ['borrower', 'lender', 'investor', 'admin', 'credit'] });
    }

    const roleSpecificItems = {
      borrower: [
        { id: 'cases', label: 'My Case', icon: Briefcase, roles: ['borrower'] },
        { id: 'esignature', label: 'E-Signatures', icon: FileSignature, roles: ['borrower'] },
        { id: 'contracts', label: 'Contracts', icon: FileText, roles: ['borrower'] },
        { id: 'kyc', label: 'Identity Verification', icon: Shield, roles: ['borrower'] }
      ],
      lender: [
        { id: 'cases', label: 'My Cases', icon: Briefcase, roles: ['lender'] },
        { id: 'deals', label: 'Available Deals', icon: Briefcase, roles: ['lender'] },
        { id: 'auctions', label: 'Active Auctions', icon: Gavel, roles: ['lender'] },
        { id: 'client_communications', label: 'Client Communications', icon: Mail, roles: ['lender'] },
        { id: 'esignature', label: 'E-Signatures', icon: FileSignature, roles: ['lender'] },
        { id: 'contracts', label: 'My Contracts', icon: FileText, roles: ['lender'] }
      ],
      investor: [
        { id: 'deals', label: 'All Deals', icon: Briefcase, roles: ['investor'] },
        { id: 'auctions', label: 'Auctions', icon: Gavel, roles: ['investor'] },
        { id: 'contracts', label: 'Contracts', icon: FileText, roles: ['investor'] },
        { id: 'escrow', label: 'Escrow', icon: Shield, roles: ['investor'] }
      ],
      admin: [
        { id: 'cases', label: 'Case Management', icon: Briefcase, roles: ['admin'] },
        { id: 'deals', label: 'All Deals', icon: Briefcase, roles: ['admin'] },
        { id: 'auctions', label: 'Auction Control', icon: Gavel, roles: ['admin'] },
        { id: 'admin_kyc', label: 'KYC Review Queue', icon: Shield, roles: ['admin'] },
        { id: 'ai_admin', label: 'AI Admin Assistant', icon: Brain, roles: ['admin'] },
        { id: 'email_center', label: 'Email Notifications', icon: MessageSquare, roles: ['admin'] },
        { id: 'client_communications', label: 'Client Communications', icon: Mail, roles: ['admin'] },
        { id: 'esignature', label: 'E-Signatures', icon: FileSignature, roles: ['admin'] },
        { id: 'contracts', label: 'Contracts', icon: FileText, roles: ['admin'] },
        { id: 'escrow', label: 'Escrow Management', icon: Shield, roles: ['admin'] },
        { id: 'documents', label: 'Document Library', icon: FolderOpen, roles: ['admin'] },
        { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, roles: ['admin'] },
        { id: 'admin', label: 'Admin Console', icon: Shield, roles: ['admin'] }
      ],
      lawyer: [
        { id: 'cases', label: 'Assigned Cases', icon: Briefcase, roles: ['lawyer'] },
        { id: 'deals', label: 'Deal Pipeline', icon: TrendingUp, roles: ['lawyer'] },
        { id: 'auctions', label: 'Auction Management', icon: Gavel, roles: ['lawyer'] },
        { id: 'esignature', label: 'E-Signatures', icon: FileSignature, roles: ['lawyer'] },
        { id: 'contracts', label: 'Contract Review', icon: FileText, roles: ['lawyer'] },
        { id: 'documents', label: 'Document Library', icon: FolderOpen, roles: ['lawyer'] },
        { id: 'settlement', label: 'Settlements', icon: CheckCircle, roles: ['lawyer'] }
      ],
      receiver: [
        { id: 'cases', label: 'Assigned Cases', icon: Briefcase, roles: ['receiver'] },
        { id: 'contracts', label: 'Contract Review', icon: FileText, roles: ['receiver'] }
      ],
      credit: [
        { id: 'lender-credit-queue', label: 'Credit Queue', icon: Briefcase, roles: ['credit'] },
        { id: 'pfa-pipeline', label: 'Pipeline', icon: Activity, roles: ['credit'] },
        { id: 'pfa-settlements', label: 'Settlements', icon: FileText, roles: ['credit'] },
        { id: 'documents', label: 'Documents', icon: FolderOpen, roles: ['credit'] },
        { id: 'reports', label: 'Reports', icon: BarChart3, roles: ['credit'] }
      ],
      super_admin: [
        { id: 'cases', label: 'Case Management', icon: Briefcase, roles: ['super_admin'] },
        { id: 'deals', label: 'All Deals', icon: Briefcase, roles: ['super_admin'] },
        { id: 'auctions', label: 'Auction Control', icon: Gavel, roles: ['super_admin'] },
        { id: 'admin_kyc', label: 'KYC Review Queue', icon: Shield, roles: ['super_admin'] },
        { id: 'email_center', label: 'Email Notifications', icon: MessageSquare, roles: ['super_admin'] },
        { id: 'client_communications', label: 'Client Communications', icon: Mail, roles: ['super_admin'] },
        { id: 'esignature', label: 'E-Signatures', icon: FileSignature, roles: ['super_admin'] },
        { id: 'contracts', label: 'Contracts', icon: FileText, roles: ['super_admin'] },
        { id: 'escrow', label: 'Escrow Management', icon: Shield, roles: ['super_admin'] },
        { id: 'documents', label: 'Document Library', icon: FolderOpen, roles: ['super_admin'] },
        { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, roles: ['super_admin'] },
        { id: 'admin', label: 'Admin Console', icon: Shield, roles: ['super_admin'] }
      ]
    };

    return [
      baseItems[0], // Dashboard first
      ...(roleSpecificItems[userRole as keyof typeof roleSpecificItems] || []),
      ...baseItems.slice(1) // Notifications and Settings last
    ];
  };

  const navigationItems = getNavigationItems();

  const renderPageContent = () => {
    // If in Grow HQ module, show Grow HQ Dashboard
    if (currentModule === 'grow_hq' && currentPage === 'dashboard') {
      return <GrowHQDashboard onNavigate={(page) => setCurrentPage(page as Page)} />;
    }

    // If in Grow HQ module, show Help Center
    if (currentModule === 'grow_hq' && currentPage === 'help') {
      return <HelpCenter onBack={() => setCurrentPage('dashboard')} />;
    }

    // If in Grow HQ module, show Integration Architecture
    if (currentModule === 'grow_hq' && currentPage === 'integration_architecture') {
      return <IntegrationArchitecture onBack={() => setCurrentPage('dashboard')} />;
    }

    // If in Grow HQ module, show Integrations Hub
    if (currentModule === 'grow_hq' && currentPage === 'integrations_hub') {
      return <IntegrationsHub onBack={() => setCurrentPage('dashboard')} />;
    }

    // If in Grow HQ module, show Multi-Firm Management
    if (currentModule === 'grow_hq' && currentPage === 'multi_firm_management') {
      return <MultiFirmManagement onBack={() => setCurrentPage('dashboard')} />;
    }

    // If in Grow Accounting module, show Firm Dashboard
    if ((currentModule as any) === 'grow_accounting' && currentPage === 'dashboard') {
      return <FirmDashboard onNavigate={(page) => setCurrentPage(page as Page)} />;
    }

    switch (currentPage) {
      case 'dashboard':
        switch (userRole) {
          case 'borrower':
            return <EnterpriseBorrowerDashboard onNavigate={(page) => setCurrentPage(page as Page)} />;
          case 'lender':
            return <EnterpriseLenderDashboard onNavigate={(page) => setCurrentPage(page as Page)} />;
          case 'investor':
            return <EnterpriseInvestorDashboard onNavigate={(page, caseId) => {
              if (page === 'case_detail' && caseId) {
                navigateToCaseDetail(caseId);
              } else {
                setCurrentPage(page as Page);
              }
            }} />;
          case 'admin':
          case 'super_admin':
          case 'lawyer':
          case 'receiver':
            return <AdminDashboard onNavigate={(page) => setCurrentPage(page as Page)} />;
          case 'ai_admin':
          case 'Grow MIP_approvals':
            return <AIAdminDashboard onNavigate={(page) => setCurrentPage(page as Page)} />;
          case 'credit':
            return <CreditQueue onNavigate={(page) => setCurrentPage(page as Page)} />;
          default:
            return <EnterpriseInvestorDashboard onNavigate={(page, caseId) => {
              if (page === 'case_detail' && caseId) {
                navigateToCaseDetail(caseId);
              } else {
                setCurrentPage(page as Page);
              }
            }} />;
        }
      case 'deals':
        return <DealList onNavigate={(page, id) => {
          if (page === 'auction_room') {
            setCurrentPage('auction_room');
          } else if (page === 'buy_now_room') {
            setCurrentPage('buy_now_room');
          }
        }} />;
      case 'cases':
        // All roles can now see case management with role-appropriate views
        return userRole === 'borrower' ? <CaseWorkspace /> : <CaseManagement
          onViewCase={navigateToCaseDetail}
        />;
      case 'case':
        // Create/Submit new case - opens CaseCreationForm
        return <CaseCreationForm
          onBack={goBack}
          onComplete={(caseId) => {
            // Navigate back to cases after successful creation
            setCurrentPage('cases');
          }}
        />;
      case 'case_detail':
        return <CaseWorkspace caseId={selectedCaseId} onBack={goBack} />;
      case 'auctions':
        return <AuctionsList onNavigate={(page, id) => {
          if (page === 'auction-details' || page === 'auction_room') {
            setCurrentPage('auction_room');
          } else if (page === 'buy_now_room') {
            setCurrentPage('buy_now_room');
          }
        }} />;
      case 'auction_room':
        return <AuctionRoom onBack={goBack} />;
      case 'buy_now_room':
        return <BuyNowRoom
          onBack={goBack}
          onNavigate={(page) => {
            if (page === 'payment') {
              navigateTo('payment');
            }
          }}
        />;
      case 'payment':
        return <PaymentPage onBack={goBack} />;
      case 'kyc':
        return <IdentityVerification onBack={goBack} />;
      case 'aml_checks_pricing':
        return <AMLCTFEnhancedChecksPricing />;
      case 'test_id_verification':
        return <TestIdVerification />;
      case 'contracts':
        return <ContractsList onNavigate={(page, id) => {
          if (page === 'contract_sign') {
            setCurrentPage('contract_sign');
          }
        }} />;
      case 'contract_sign':
        return <ContractSigning onBack={goBack} />;
      case 'escrow':
        return <EscrowRelease />;
      case 'admin':
        return <AdminDashboard onNavigate={(page) => setCurrentPage(page as Page)} />;
      case 'admin_kyc':
        return <AdminKYCReview onNavigate={(page, id) => {
          if (id) setSelectedCaseId(id);
          setCurrentPage(page as Page);
        }} />;
      case 'admin_kyc_detail':
        return <KYCReviewDetail userId={selectedCaseId ?? undefined} onBack={goBack} />;
      case 'ai_admin':
        return <AIAdminDashboard onNavigate={(page) => setCurrentPage(page as Page)} />;
      case 'email_center':
        return <EmailNotificationCenter onNavigate={(page) => setCurrentPage(page as Page)} />;
      case 'client_communications':
        return <ClientCommunications onBack={goBack} />;
      case 'esignature':
        return <GrowESignPlatform onBack={goBack} />;
      case 'tasks':
        return <TaskCenter userRole={userRole} onNavigate={(page, id) => {
          if (page === 'case' && id) {
            setSelectedCaseId(id);
            setCurrentPage('case_detail');
          } else {
            setCurrentPage(page as Page);
          }
        }} />;
      case 'notifications':
        return <NotificationsInbox onNavigate={(page) => setCurrentPage(page as Page)} />;
      case 'settlement':
        return <SettlementChecklistManagerWrapper caseData={selectedCaseId ? mockCases.find(c => c.caseNumber === selectedCaseId) || mockCases[0] : mockCases[0]} />;
      case 'reports':
        return <ReportsDashboard />;
      case 'documents':
        return <DocumentLibrary />;
      case 'activity':
        return <ActivityFeed />;
      case 'help':
        return <OldHelpCenter />;
      case 'support':
        return <SupportTickets />;
      case 'search':
        return <UniversalSearch />;
      case 'crm':
        return <CRMSales />;
      case 'user_profile':
        return <UserProfile />;
      case 'settings':
        return <PlaceholderPage title="Settings" description="System configuration and general preference panel." />;
      case 'settings_profile':
        return <PlaceholderPage title="Profile Settings" description="Update your personal details, email address, and notification preferences." />;
      case 'settings_organization':
        return <PlaceholderPage title="Organization Settings" description="Manage your firm details, team members, and subscription tier." />;
      case 'settings_security':
        return <PlaceholderPage title="Security Settings" description="Configure two-factor authentication, change passwords, and manage API tokens." />;
      case 'settings_notifications':
        return <PlaceholderPage title="Notification Settings" description="Customize alerts for key system occurrences and transactions." />;
      case 'user_management':
        return <UserManagement />;
      case 'access_control':
        return <AccessControl />;
      case 'module_settings':
        return <ModuleSettings />;
      case 'integration_architecture':
        return <IntegrationArchitecture onBack={goBack} />;
      case 'integrations_hub':
        return <IntegrationsDashboard />;
      case 'integrations_hub_new':
        return <NewIntegrationsHub />;
      case 'integrations_demo':
        if (isProductionRuntime && !allowDemoInProduction) {
          return (
            <div className="p-8 bg-red-50 border-2 border-red-300 rounded-lg">
              <h2 className="text-2xl font-bold text-red-900 mb-2">Blocked in Production</h2>
              <p className="text-red-800">Integrations demo route is disabled in production runtime.</p>
            </div>
          );
        }
        return <IntegrationsDemo />;
      case 'integrations_landing':
        return <IntegrationsLanding onNavigate={(page) => setCurrentPage(page as Page)} />;
      case 'client_list':
        return <ClientList />;
      case 'pfa-enquiries':
        return <EnquiriesManagement onNavigate={(page) => setCurrentPage(page as Page)} />;
      case 'pfa-pipeline':
        return <Pipeline onNavigate={(page) => setCurrentPage(page as Page)} onBack={() => setCurrentPage('dashboard')} />;
      // Note: The following PFA cases should never be reached when currentModule === 'grow_lending'
      // because PFAModule handles all navigation internally. These are kept for compatibility
      // if PFA pages are accessed from other modules, but ideally should be removed.
      case 'pfa-settlements':
      case 'pfa-loan-book':
      case 'pfa-calculator':
      case 'pfa-documents':
      case 'pfa-reports':
      case 'pfa-clients':
      case 'broker-calculator':
      case 'broker-documents':
        // These pages are handled by PFAModule when in grow_lending module
        // If you're seeing this, there may be a routing issue
        console.warn(`Page ${currentPage} should be handled by PFAModule, not App.tsx`);
        return (
          <div className="p-8 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
            <h2 className="text-2xl font-bold text-yellow-900 mb-2">Navigation Notice</h2>
            <p className="text-yellow-800 mb-4">
              This page should be accessed through the Grow Lending module.
            </p>
            <button
              onClick={() => handleModuleChange('grow_lending')}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-semibold"
            >
              Go to Grow Lending Module
            </button>
          </div>
        );
      case 'broker-dashboard':
        return <BrokerDashboard onNavigate={(page) => setCurrentPage(page as Page)} />;
      case 'broker-new-application':
        return <NewApplication onNavigate={(page) => setCurrentPage(page as Page)} />;
      case 'broker-pipeline':
        return <Pipeline onNavigate={(page) => setCurrentPage(page as Page)} onBack={() => setCurrentPage('broker-dashboard')} />;
      case 'broker-commission':
        return <Commission onNavigate={(page) => setCurrentPage(page as Page)} onBack={() => setCurrentPage('broker-dashboard')} />;
      case 'broker-reports':
        return <Reports onNavigate={(page) => setCurrentPage(page as Page)} onBack={() => setCurrentPage('broker-dashboard')} />;
      case 'broker-clients':
        return <Clients onNavigate={(page) => setCurrentPage(page as Page)} onBack={() => setCurrentPage('broker-dashboard')} />;
      case 'lender-credit-queue':
        return <CreditQueue onNavigate={(page) => setCurrentPage(page as Page)} />;
      case 'lender-deal-view':
        return <DealView onNavigate={(page) => setCurrentPage(page as Page)} onBack={() => setCurrentPage('lender-credit-queue')} />;
      case 'borrower-portal':
        return <BorrowerPortal />;
      case 'lender-loan-ledger':
        return <LoanLedger onNavigate={(page) => setCurrentPage(page as Page)} />;
      case 'lender-arrears':
        return <ArrearsManagement onNavigate={(page) => setCurrentPage(page as Page)} />;
      case 'multi_firm_management':
        return <MultiFirmManagement onBack={() => setCurrentPage('dashboard')} />;
      case 'client_portal':
        return <EnhancedClientPortal />;
      case 'pexa':
      case 'pexa_workspace':
        return <PEXADashboard onNavigate={(page) => setCurrentPage(page as Page)} caseNumber={selectedCaseId || undefined} />;
      default:
        return <EnterpriseInvestorDashboard onNavigate={(page, caseId) => {
          if (page === 'case_detail' && caseId) {
            navigateToCaseDetail(caseId);
          } else {
            setCurrentPage(page as Page);
          }
        }} />;
    }
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard':
        return 'Dashboard';
      case 'deals':
        return 'All Deals';
      case 'cases':
        if (userRole === 'borrower') return 'My Case';
        if (userRole === 'lender') return 'My MIP Cases';
        if (userRole === 'lawyer' || userRole === 'receiver') return 'Assigned Cases';
        if (userRole === 'admin' || userRole === 'super_admin') return 'Case Management';
        return 'Cases';
      case 'case':
        return 'Submit New Case';
      case 'case_detail':
        return 'Case Details';
      case 'auctions':
        return 'Auctions';
      case 'auction_room':
        return 'Auction Room';
      case 'buy_now_room':
        return 'Buy Now Room';
      case 'payment':
        return 'Payment';
      case 'kyc':
        return 'Identity Verification';
      case 'contracts':
        return 'Contracts';
      case 'contract_sign':
        return 'Contract Signing';
      case 'escrow':
        return 'Escrow Release';
      case 'notifications':
        return 'Notifications';
      case 'admin_kyc':
        return 'KYC Review';
      case 'admin_kyc_detail':
        return 'KYC Review Detail';
      case 'admin':
        return 'Admin Console';
      case 'reports':
        return 'Reports';
      case 'documents':
        return 'Documents';
      case 'activity':
        return 'Activity';
      case 'help':
        return 'Help Center';
      case 'support':
        return 'Support Tickets';
      case 'search':
        return 'Search';
      case 'crm':
        return 'CRM';
      case 'user_profile':
        return 'User Profile';
      case 'settings':
        return 'Settings';
      case 'settings_profile':
        return 'Profile Settings';
      case 'settings_organization':
        return 'Organization Settings';
      case 'settings_security':
        return 'Security Settings';
      case 'settings_notifications':
        return 'Notification Settings';
      case 'user_management':
        return 'User Management';
      case 'access_control':
        return 'Access Control';
      case 'module_settings':
        return 'Module Settings';
      case 'integration_architecture':
        return 'Integration Architecture';
      case 'integrations_hub':
        return 'Integrations Hub';
      case 'integrations_hub_new':
        return 'Integrations Hub (New)';
      case 'integrations_demo':
        return 'Integrations Demo - API Architecture';
      case 'integrations_landing':
        return 'Integrations - Overview';
      case 'client_list':
        return 'Client List';
      case 'settlement':
        return 'Settlement Management';
      case 'pfa-enquiries':
        return 'Enquiries';
      case 'pfa-pipeline':
        return 'Pipeline';
      case 'pfa-settlements':
        return 'Settlements';
      case 'pfa-loan-book':
        return 'Loan Book';
      case 'pfa-calculator':
        return 'Calculator';
      case 'pfa-documents':
        return 'Documents';
      case 'pfa-reports':
        return 'Reports';
      case 'pfa-clients':
        return 'Clients';
      case 'broker-dashboard':
        return 'Broker Dashboard';
      case 'broker-new-application':
        return 'New Application';
      case 'broker-pipeline':
        return 'Pipeline';
      case 'broker-commission':
        return 'Commissions';
      case 'broker-calculator':
        return 'Calculator';
      case 'broker-documents':
        return 'Documents';
      case 'broker-reports':
        return 'Reports';
      case 'broker-clients':
        return 'Clients';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 fixed w-full top-0 z-50 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section: Logo & Navigation */}
            <div className="flex items-center gap-8">
              {/* Logo */}
              <div className="flex items-center gap-3 pr-6 border-r border-gray-200">
                <img src={logo} alt="Grow MIP" className="h-9" />
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Grow MIP</h1>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide">MIP Platform</p>
                </div>
              </div>

              {/* Main Navigation - Desktop */}
              <div className="hidden xl:flex items-center gap-2">
                {navigationItems.slice(0, 6).map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentPage(item.id as Page)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${isActive
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}

                {/* More Menu for Additional Items */}
                {navigationItems.length > 6 && (
                  <div className="relative group">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all">
                      <MoreHorizontal className="w-4 h-4" />
                      <span>More</span>
                    </button>
                    {/* Dropdown */}
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      <div className="py-2">
                        {navigationItems.slice(6).map((item) => {
                          const Icon = item.icon;
                          const isActive = currentPage === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => setCurrentPage(item.id as Page)}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${isActive
                                  ? 'bg-indigo-50 text-indigo-700 font-medium'
                                  : 'text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                              <Icon className="w-4 h-4" />
                              <span>{item.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Section: Actions */}
            <div className="flex items-center gap-3">
              {/* Mobile Menu Toggle */}
              <button
                className="xl:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-600" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {/* Module Switcher - Improved */}
              <div className="hidden md:block">
                <select
                  value={currentModule}
                  onChange={(e) => handleModuleChange(e.target.value as Module)}
                  className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer"
                >
                  <option value="Grow MIP">Grow MIP</option>
                  <option value="grow_kyc">Grow KYC</option>
                  <option value="grow_esign">ðŸ”  Grow E-Sign</option>
                </select>
              </div>

              {/* Global Search Button */}
              <div className="hidden md:block relative">
                <button
                  onClick={() => setIsGlobalSearchOpen(true)}
                  className="flex items-center gap-2 pl-3 pr-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                >
                  <Search className="w-4 h-4 text-gray-400" />
                  <span>Search...</span>
                  <div className="flex items-center gap-1 ml-4 opacity-70">
                    <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border text-xs font-mono">⌘</kbd>
                    <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border text-xs font-mono">K</kbd>
                  </div>
                </button>
              </div>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                className="relative hover:bg-gray-100 transition-colors"
                onClick={() => setCurrentPage('notifications')}
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </Button>

              {/* User Profile */}
              <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                <div className="text-right hidden lg:block">
                  <p className="text-sm font-semibold text-gray-900">{mockCurrentUser.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{mockCurrentUser.role}</p>
                </div>
                <button
                  onClick={() => setCurrentPage('settings')}
                  className="hover:opacity-80 transition-opacity"
                >
                  <Avatar className="cursor-pointer ring-2 ring-gray-200 hover:ring-indigo-400 transition-all">
                    <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white font-semibold">
                      {mockCurrentUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-gray-200 bg-white shadow-lg">
            <nav className="px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto">
              {/* Mobile Selectors */}
              <div className="space-y-2 pb-3 mb-3 border-b border-gray-200">
                <select
                  value={currentModule}
                  onChange={(e) => handleModuleChange(e.target.value as Module)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Grow MIP">Grow MIP</option>
                  <option value="grow_kyc">Grow KYC</option>
                  <option value="grow_esign">ðŸ”  Grow E-Sign</option>
                </select>
                <div className="space-y-2">
                  <select
                    value={userRole}
                    onChange={(e) => {
                      setUserRole(e.target.value as UserRole);
                      setCurrentPage('dashboard');
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="borrower">Borrower</option>
                    <option value="lender">Lender</option>
                    <option value="investor">Investor</option>
                    <option value="admin">Admin</option>
                  </select>

                  <button
                    onClick={() => {
                      setIsGlobalSearchOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Open Global Search
                  </button>
                </div>

              {/* Navigation Items */}
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id as Page);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}

              {/* Recently Viewed Section */}
              {recentlyViewed.length > 0 && (
                <div className="pt-3 mt-3 border-t border-gray-200">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">
                    Recently Viewed
                  </div>
                  {recentlyViewed.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentPage(item.page);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Activity className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Sign Out */}
              <div className="pt-3 mt-3 border-t border-gray-200">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Sign Out
                </Button>
              </div>
                </div>
            </nav>
          </div>
        )}
      <main className="mt-16 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">{getPageTitle()}</h2>
            <p className="text-gray-600 text-sm mt-1">
              {userRole === 'borrower' && 'Manage your mortgage resolution case'}
              {userRole === 'lender' && 'Manage defaulted loans and auctions'}
              {userRole === 'investor' && 'Browse available deals and manage your bids'}
              {userRole === 'admin' && 'Platform administration and compliance management'}
            </p>
          </div>

          {/* Page Content */}
          {renderPageContent()}
        </div>
      </main>
{/* Mobile Menu Overlay */}
{mobileMenuOpen && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 z-30 xl:hidden"
    onClick={() => setMobileMenuOpen(false)}
  />
)}

{/* Test Button for ID Verification System */}
{currentPage !== 'test_id_verification' && (
  <TestButton onClick={() => setCurrentPage('test_id_verification')} />
)}

<GlobalSearch
  isOpen={isGlobalSearchOpen}
  onClose={() => setIsGlobalSearchOpen(false)}
  onNavigate={(view, id) => {
    if (view === 'client_detail' && id) {
      setCurrentPage('dashboard');
    } else if (view === 'case_detail' && id) {
      navigateToCaseDetail(id);
    }
  }}
/>

</nav>
</div>
);
}


// Placeholder page for future features
function PlaceholderPage({ title, description }: { title: string, description: string }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-600 mt-2">{description}</p>
    </div>
  );
}
  
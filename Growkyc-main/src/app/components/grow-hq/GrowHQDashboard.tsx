import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  Settings,
  Building2,
  ChevronRight,
  Globe,
  Database,
  Layers,
  Palette,
  Key,
  Users,
  FileText,
  Shield,
  Zap,
  TrendingUp,
  CheckCircle,
  X,
  Plus,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Calendar,
  Clock,
  DollarSign,
  BarChart3,
  Activity,
  Bell,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Award,
  Target,
  LayoutGrid,
  Package,
  XCircle,
  Lock,
  Code,
  Cloud
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

// Simple UI Components
const Button = ({ children, onClick, variant = 'default', size = 'default', className = '', disabled = false }: any) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const variantClasses = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border-2 border-white/10 bg-white text-slate-300 hover:bg-white/5',
    ghost: 'text-slate-300 hover:bg-white/5'
  };
  const sizeClasses = {
    default: 'px-4 py-2 text-sm',
    sm: 'px-3 py-1.5 text-xs',
    lg: 'px-6 py-3 text-base'
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = '' }: any) => (
  <div className={`bg-white border-2 border-white/10 rounded-lg ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }: any) => (
  <div className="p-6 border-b border-white/10">
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }: any) => (
  <h3 className={`text-lg font-bold text-slate-100 ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className = '' }: any) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

interface GrowHQDashboardProps {
  onNavigate?: (page: string) => void;
}

// Mock data for enabled modules
const enabledModules = [
  { id: 'Grow MIP', name: 'Grow MIP', subtitle: 'Virtual MIP Platform', enabled: true, users: 24, plan: 'Enterprise' },
  { id: 'grow_accounting', name: 'Grow Accounting', subtitle: 'Practice Management', enabled: true, users: 12, plan: 'Professional' },
  { id: 'grow_lending', name: 'Grow Lending', subtitle: 'Business Lending', enabled: false, users: 0, plan: 'Not Activated' },
  { id: 'grow_trust', name: 'Grow Trust', subtitle: 'Trust Management', enabled: true, users: 8, plan: 'Enterprise' },
  { id: 'grow_crm', name: 'Grow CRM', subtitle: 'Customer Relations', enabled: false, users: 0, plan: 'Not Activated' },
  { id: 'grow_documents', name: 'Grow Documents', subtitle: 'Document Management', enabled: true, users: 18, plan: 'Professional' },
  { id: 'grow_settlement', name: 'Grow Settlement', subtitle: 'Property Settlement', enabled: false, users: 0, plan: 'Not Activated' },
  { id: 'grow_payments', name: 'Grow Payments', subtitle: 'Payment Gateway', enabled: true, users: 15, plan: 'Professional' },
  { id: 'grow_time', name: 'Grow Time', subtitle: 'Time & Revenue', enabled: false, users: 0, plan: 'Not Activated' },
  { id: 'grow_investments', name: 'Grow Investments', subtitle: 'Fund Management', enabled: false, users: 0, plan: 'Not Activated' },
  { id: 'grow_receivership', name: 'Grow Receivership', subtitle: 'Restructuring', enabled: false, users: 0, plan: 'Not Activated' }
];

export function GrowHQDashboard({ onNavigate }: GrowHQDashboardProps) {
  const [organizationName, setOrganizationName] = useState('Acme Financial Services');
  const [primaryColor, setPrimaryColor] = useState('#2855a6');
  const [customDomain, setCustomDomain] = useState('acmefs.grow.cloud');
  const [showBrandingEditor, setShowBrandingEditor] = useState(false);
  const [selectedModule, setSelectedModule] = useState<typeof enabledModules[0] | null>(null);
  const [showClientOnboarding, setShowClientOnboarding] = useState(false);
  const [selectedClientType, setSelectedClientType] = useState<string>('');
  const { user } = useAuth();
  const isPartner = user?.role === 'partner';

  const activeModules = enabledModules.filter(m => m.enabled);
  const totalUsers = activeModules.reduce((sum, m) => sum + m.users, 0);
  const availableModules = enabledModules.filter(m => !m.enabled);

  const handleSaveBranding = (branding: any) => {
    setOrganizationName(branding.organizationName);
    setPrimaryColor(branding.primaryColor);
    setCustomDomain(branding.customDomain);
  };

  const handleSaveModuleConfig = (config: any) => {
  };

  const handleDeactivateModule = () => {
  };

  const handleStartOnboarding = (clientType: string) => {
    setSelectedClientType(clientType);
    setShowClientOnboarding(true);
  };

  return (
    <div className="space-y-6">
      {showBrandingEditor && (
        <BrandingEditor
          onClose={() => setShowBrandingEditor(false)}
          currentBranding={{
            organizationName,
            primaryColor,
            customDomain
          }}
          onSave={handleSaveBranding}
        />
      )}

      {selectedModule && (
        <ModuleConfig
          module={selectedModule}
          onClose={() => setSelectedModule(null)}
          onSave={handleSaveModuleConfig}
          onDeactivate={handleDeactivateModule}
        />
      )}

      {showClientOnboarding && (
        <ClientOnboarding
          onClose={() => setShowClientOnboarding(false)}
          clientType={selectedClientType}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Grow HQ</h1>
          <p className="text-slate-300 mt-1">SaaS Management Console â€¢ {organizationName}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm text-slate-300">Your Instance</p>
            <p className="text-sm font-mono font-semibold text-blue-400">{customDomain}</p>
          </div>
          <Button onClick={() => onNavigate?.('settings')}>
            <Settings className="w-4 h-4 mr-2" />
            Platform Settings
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-blue-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-300">Active Modules</span>
              <LayoutGrid className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-slate-100">{activeModules.length}</p>
            <p className="text-xs text-slate-400 mt-1">of {enabledModules.length} available</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-green-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-300">Total Users</span>
              <Users className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-slate-100">{totalUsers}</p>
            <p className="text-xs text-slate-400 mt-1">Across all modules</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-purple-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-300">Active Firms</span>
              <Building2 className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-slate-100">3</p>
            <p className="text-xs text-slate-400 mt-1">Multi-firm enabled</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-amber-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-300">Uptime</span>
              <Activity className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-3xl font-bold text-slate-100">99.9%</p>
            <p className="text-xs text-slate-400 mt-1">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Enterprise Management - Featured Section */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-2xl">Multi-Firm Management</CardTitle>
              <p className="text-blue-100 mt-2">Central hub for managing multiple firms with white-label branding and isolated databases</p>
            </div>
            <Button 
              size="lg" 
              className="bg-white text-blue-400 hover:bg-blue-500/10"
              onClick={() => onNavigate?.('multi_firm_management')}
            >
              <Building2 className="w-5 h-5 mr-2" />
              Manage Firms
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <Globe className="w-8 h-8 mb-2" />
              <p className="font-semibold mb-1">White Label</p>
              <p className="text-sm text-blue-100">Custom branding, domains & templates per firm</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <Database className="w-8 h-8 mb-2" />
              <p className="font-semibold mb-1">Isolated Data</p>
              <p className="text-sm text-blue-100">Secure separate databases for each firm</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <Layers className="w-8 h-8 mb-2" />
              <p className="font-semibold mb-1">Modular Add-Ons</p>
              <p className="text-sm text-blue-100">Activate modules per firm type</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* White-Label Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>White-Label Configuration</CardTitle>
              <p className="text-sm text-slate-300 mt-1">Customize your platform branding and domain</p>
            </div>
            <Button variant="outline" onClick={() => setShowBrandingEditor(true)}>
              <Palette className="w-4 h-4 mr-2" />
              Edit Branding
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-500/15 rounded-lg">
                  <Building2 className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-100">Organization Name</p>
                  <p className="text-sm text-slate-300">{organizationName}</p>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                Change Name
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-500/15 rounded-lg">
                  <Palette className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-100">Brand Color</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: primaryColor }}></div>
                    <p className="text-sm text-slate-300 font-mono">{primaryColor}</p>
                  </div>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="w-full">
                <Palette className="w-4 h-4 mr-2" />
                Change Color
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-500/15 rounded-lg">
                  <Globe className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-100">Custom Domain</p>
                  <p className="text-sm text-slate-300 font-mono">{customDomain}</p>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="w-full">
                <Globe className="w-4 h-4 mr-2" />
                Configure Domain
              </Button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-500/10 border-2 border-blue-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-blue-400 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-blue-300">Logo Upload Available</p>
                <p className="text-sm text-blue-300 mt-1">Upload your logo to replace the Grow branding across all modules. Supports PNG, SVG, 512x512px recommended.</p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" onClick={() => toast.success('Opening logo uploader...')}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Logo
                  </Button>
                  <Button size="sm" variant="outline">
                    View Preview
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Modules */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Active Modules</CardTitle>
              <p className="text-sm text-slate-300 mt-1">Modules currently enabled for your organization</p>
            </div>
            <Button onClick={() => toast.info('Opening module marketplace...')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Modules
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeModules.map((module) => (
              <div key={module.id} className="p-4 border-2 border-green-500/30 bg-green-500/10 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-600 rounded-lg">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-100">{module.name}</p>
                      <p className="text-xs text-slate-300">{module.subtitle}</p>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-slate-300">{module.users} users</span>
                  <span className="px-2 py-1 bg-green-600 text-white text-xs font-semibold rounded">{module.plan}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => setSelectedModule(module)}>
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => toast.info(`Viewing ${module.name} analytics...`)}>
                    <BarChart3 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Client Onboarding by Module Type */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Client Onboarding</CardTitle>
              <p className="text-sm text-slate-300 mt-1">Start onboarding new clients based on your active modules</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { 
                type: 'accounting', 
                label: 'Accounting', 
                icon: 'ðŸ“Š', 
                color: 'blue',
                description: 'Tax, BAS, Bookkeeping',
                active: true
              },
              { 
                type: 'legal', 
                label: 'Legal', 
                icon: 'âš–ï¸', 
                color: 'purple',
                description: 'Litigation, Conveyancing',
                active: false
              },
              { 
                type: 'lending', 
                label: 'Lending', 
                icon: 'ðŸ’°', 
                color: 'green',
                description: 'Business & Property Loans',
                active: false
              },
              { 
                type: 'broker', 
                label: 'Broker', 
                icon: 'ðŸ˜ï¸', 
                color: 'orange',
                description: 'Mortgage & Finance',
                active: false
              },
              { 
                type: 'fund-management', 
                label: 'Fund Mgmt', 
                icon: 'ðŸ“ˆ', 
                color: 'indigo',
                description: 'Investment Funds',
                active: false
              }
            ].map((clientType) => (
              <div 
                key={clientType.type} 
                className={`p-4 rounded-lg border-2 ${
                  clientType.active 
                    ? 'border-blue-300 bg-blue-500/10' 
                    : 'border-white/10 bg-white/5 opacity-60'
                }`}
              >
                <div className="text-center mb-3">
                  <div className="text-4xl mb-2">{clientType.icon}</div>
                  <p className="font-bold text-slate-100 mb-1">{clientType.label}</p>
                  <p className="text-xs text-slate-300">{clientType.description}</p>
                </div>
                
                {clientType.active ? (
                  <Button 
                    size="sm" 
                    className={`w-full bg-blue-600 hover:bg-blue-700 ${isPartner ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => !isPartner && handleStartOnboarding(clientType.type)}
                    disabled={isPartner}
                    title={isPartner ? "Managing Partners cannot onboard clients." : undefined}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Onboard Client
                  </Button>
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    disabled
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Module Required
                  </Button>
                )}
                
                {clientType.active && (
                  <div className="mt-2 text-center">
                    <span className="text-xs text-green-400 font-semibold">âœ“ Active</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-500/10 border-2 border-blue-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-blue-400 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-blue-300">Module-Based Onboarding</p>
                <p className="text-sm text-blue-300 mt-1">
                  Each module has specialized onboarding workflows tailored to that industry's compliance requirements. 
                  Activate additional modules to unlock more client types.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Add-Ons */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Available Add-Ons</CardTitle>
              <p className="text-sm text-slate-300 mt-1">Enable additional modules to expand your platform</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableModules.map((module) => (
              <div key={module.id} className="p-4 border-2 border-white/10 rounded-lg hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-lg">
                      <Package className="w-5 h-5 text-slate-300" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-100">{module.name}</p>
                      <p className="text-xs text-slate-300">{module.subtitle}</p>
                    </div>
                  </div>
                  <XCircle className="w-5 h-5 text-gray-400" />
                </div>
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-slate-300" />
                    <span className="text-sm font-semibold text-slate-100">$199/month</span>
                  </div>
                  <p className="text-xs text-slate-300">Professional plan â€¢ Unlimited users</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => toast.success(`Activating ${module.name}...`)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Activate
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toast.info(`Viewing ${module.name} details...`)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Integrations Hub</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-300 mb-4">
              Manage all third-party integrations and API connections
            </p>
            <Button className="w-full" onClick={() => onNavigate?.('integrations_hub')}>
              <Zap className="w-4 h-4 mr-2" />
              Manage Integrations
              <ChevronRight className="w-4 h-4 ml-auto" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Platform Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-300 mb-4">
              API keys, webhooks, security, and advanced configuration
            </p>
            <Button className="w-full" onClick={() => onNavigate?.('platform_settings')}>
              <Key className="w-4 h-4 mr-2" />
              Platform Settings
              <ChevronRight className="w-4 h-4 ml-auto" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Integration Architecture</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-300 mb-4">
              View how core add-on modules integrate with specialized modules
            </p>
            <Button className="w-full" onClick={() => onNavigate?.('integration_architecture')}>
              <LayoutGrid className="w-4 h-4 mr-2" />
              View Architecture
              <ChevronRight className="w-4 h-4 ml-auto" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-300 mb-4">
              Manage user accounts, roles, and permissions across all modules
            </p>
            <Button className="w-full" onClick={() => onNavigate?.('user_management')}>
              <Users className="w-4 h-4 mr-2" />
              Manage Users
              <ChevronRight className="w-4 h-4 ml-auto" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Enterprise Architecture */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Enterprise Architecture</CardTitle>
              <p className="text-sm text-slate-300 mt-1">Governance, control, and multi-tenant capabilities</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Governance & Control Layer */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-indigo-500/15 rounded-lg">
                  <Shield className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Governance & Control Layer</h3>
                  <p className="text-sm text-slate-300">Complete audit trail and API-first architecture</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-slate-300" />
                    <p className="font-semibold text-slate-100">Full Audit Trail</p>
                  </div>
                  <p className="text-sm text-slate-300">Every click logged</p>
                </div>
                
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="w-5 h-5 text-slate-300" />
                    <p className="font-semibold text-slate-100">API First</p>
                  </div>
                  <p className="text-sm text-slate-300">REST + Webhooks</p>
                </div>
              </div>
            </div>

            {/* Multi-Firm Support */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-500/15 rounded-lg">
                  <Building2 className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Multi-Firm Support</h3>
                  <p className="text-sm text-slate-300">Enterprise multi-tenancy with data isolation</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-slate-100">â€¢ Isolated databases per firm</p>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                </div>
                
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-slate-100">â€¢ Role segregation</p>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                </div>
                
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-slate-100">â€¢ Revenue reporting</p>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* White Label */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-500/15 rounded-lg">
                  <Palette className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">White Label</h3>
                  <p className="text-sm text-slate-300">Complete branding customization per firm</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-slate-100">â€¢ Custom branding</p>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                </div>
                
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-slate-100">â€¢ Custom domain</p>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                </div>
                
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-slate-100">â€¢ Firm templates</p>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Modular Add-Ons */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-500/15 rounded-lg">
                  <Layers className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Modular Add-Ons</h3>
                  <p className="text-sm text-slate-300">Industry-specific module activation</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white/5 rounded-lg text-center">
                  <p className="text-sm font-semibold text-slate-100">Accounting</p>
                </div>
                
                <div className="p-3 bg-white/5 rounded-lg text-center">
                  <p className="text-sm font-semibold text-slate-100">Legal</p>
                </div>
                
                <div className="p-3 bg-white/5 rounded-lg text-center">
                  <p className="text-sm font-semibold text-slate-100">Lending</p>
                </div>
                
                <div className="p-3 bg-white/5 rounded-lg text-center">
                  <p className="text-sm font-semibold text-slate-100">Broker</p>
                </div>
                
                <div className="p-3 bg-white/5 rounded-lg text-center col-span-2">
                  <p className="text-sm font-semibold text-slate-100">Fund Management</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-500/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="w-6 h-6 text-indigo-400" />
                <div>
                  <p className="font-semibold text-indigo-300">Enterprise-Ready Platform</p>
                  <p className="text-sm text-indigo-300 mt-1">Configure multi-firm architecture and white-label settings</p>
                </div>
              </div>
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700"
                onClick={() => onNavigate?.('multi_firm_management')}
              >
                Configure Now
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { name: 'API Response', value: '124ms', status: 'healthy', icon: Zap },
              { name: 'Database', value: '98.7%', status: 'healthy', icon: Database },
              { name: 'Cloud Storage', value: '2.4 TB', status: 'healthy', icon: Cloud },
              { name: 'Uptime', value: '99.9%', status: 'healthy', icon: Activity }
            ].map((metric, idx) => (
              <div key={idx} className="p-4 bg-green-500/10 border-2 border-green-500/30 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <metric.icon className="w-5 h-5 text-green-400" />
                  <p className="text-sm font-semibold text-slate-300">{metric.name}</p>
                </div>
                <p className="text-2xl font-bold text-slate-100">{metric.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-green-400 font-semibold">HEALTHY</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper component placeholder
function BrandingEditor({ onClose, currentBranding, onSave }: { onClose: () => void, currentBranding: { organizationName: string, primaryColor: string, customDomain: string }, onSave: (branding: any) => void }) {
  const [organizationName, setOrganizationName] = useState(currentBranding.organizationName);
  const [primaryColor, setPrimaryColor] = useState(currentBranding.primaryColor);
  const [customDomain, setCustomDomain] = useState(currentBranding.customDomain);

  const handleSave = () => {
    onSave({ organizationName, primaryColor, customDomain });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Branding</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300">Organization Name</label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-white/10 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Brand Color</label>
            <input
              type="color"
              className="mt-1 block w-full px-3 py-2 border border-white/10 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Custom Domain</label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-white/10 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="ml-3" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

// Helper component placeholder
function ModuleConfig({ module, onClose, onSave, onDeactivate }: { module: typeof enabledModules[0], onClose: () => void, onSave: (config: any) => void, onDeactivate: () => void }) {
  const [config, setConfig] = useState({});

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Configure {module.name}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300">Module Settings</label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-white/10 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={config['setting1'] || ''}
              onChange={(e) => setConfig({ ...config, setting1: e.target.value })}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="ml-3" onClick={handleSave}>
            Save
          </Button>
          <Button className="ml-3" variant="outline" onClick={onDeactivate}>
            Deactivate
          </Button>
        </div>
      </div>
    </div>
  );
}

// Helper component placeholder
function ClientOnboarding({ onClose, clientType }: { onClose: () => void, clientType: string }) {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');

  const handleSave = () => {
    toast.success(`Starting ${clientType} client onboarding for ${clientName}...`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Onboard New Client</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300">Client Name</label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-white/10 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Client Email</label>
            <input
              type="email"
              className="mt-1 block w-full px-3 py-2 border border-white/10 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="ml-3" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

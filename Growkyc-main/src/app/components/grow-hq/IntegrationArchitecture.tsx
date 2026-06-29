import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import {
  Users,
  FileText,
  Clock,
  Settings,
  Building2,
  ArrowRight,
  CheckCircle,
  Plus,
  Zap,
  Link as LinkIcon,
  Database,
  Share2,
  Layout,
  ChevronDown,
  ChevronRight,
  Info,
  DollarSign,
  Shield,
  Package,
  Target,
  AlertTriangle
} from 'lucide-react';

interface IntegrationArchitectureProps {
  onBack?: () => void;
}

const coreModules = [
  {
    id: 'grow_crm',
    name: 'Grow CRM',
    icon: Users,
    color: 'blue',
    description: 'Universal contact & relationship management',
    benefits: [
      'Centralized contact database across all modules',
      'Unified communication history',
      'Cross-module relationship tracking',
      'Smart lead routing & assignment'
    ]
  },
  {
    id: 'grow_documents',
    name: 'Grow Documents',
    icon: FileText,
    color: 'purple',
    description: 'Enterprise document management system',
    benefits: [
      'Single document repository for all modules',
      'Version control & audit trails',
      'OCR & intelligent document processing',
      'Smart document templates & e-signatures'
    ]
  },
  {
    id: 'grow_time',
    name: 'Grow Time & Revenue',
    icon: Clock,
    color: 'green',
    description: 'Time tracking & revenue management',
    benefits: [
      'Cross-module time tracking',
      'Automated billing & invoicing',
      'Revenue recognition & forecasting',
      'Resource utilization analytics'
    ]
  },
  {
    id: 'grow_hq',
    name: 'Grow HQ',
    icon: Settings,
    color: 'orange',
    description: 'Central SaaS management console',
    benefits: [
      'Module activation/deactivation',
      'User management across all modules',
      'White-label branding controls',
      'Subscription & billing management'
    ]
  }
];

const specializedModules = [
  {
    id: 'Grow MIP',
    name: 'Grow MIP',
    subtitle: 'Virtual MIP Platform',
    integrations: {
      grow_crm: ['Borrower/lender contact management', 'Lead tracking for new deals', 'Communication history'],
      grow_documents: ['Loan documentation storage', 'Case file management', 'Contract templates'],
      grow_time: ['Case time tracking', 'Lawyer billing', 'Admin activity logging'],
      grow_hq: ['User provisioning', 'Role-based access', 'Operator branding']
    }
  },
  {
    id: 'grow_accounting',
    name: 'Grow Accounting',
    subtitle: 'Practice Management',
    integrations: {
      grow_crm: ['Client contact database', 'Engagement tracking', 'Referral management'],
      grow_documents: ['Workpaper storage', 'Client file management', 'Engagement letters'],
      grow_time: ['Job time tracking', 'Staff billing rates', 'WIP management', 'Automated invoicing'],
      grow_hq: ['Multi-firm management', 'Staff provisioning', 'Practice branding']
    }
  },
  {
    id: 'grow_lending',
    name: 'Grow Lending',
    subtitle: 'Business Lending',
    integrations: {
      grow_crm: ['Broker CRM', 'Borrower pipeline', 'Credit assessment workflows'],
      grow_documents: ['Loan application docs', 'Credit memos', 'Security documents'],
      grow_time: ['Credit assessment time', 'Relationship manager tracking', 'Settlement billing'],
      grow_hq: ['Lender user roles', 'Broker portal access', 'Custom branding']
    }
  },
  {
    id: 'grow_trust',
    name: 'Grow Trust',
    subtitle: 'Trust Account Management',
    integrations: {
      grow_crm: ['Matter contact management', 'Client relationship tracking'],
      grow_documents: ['Trust deed storage', 'Transaction documentation', 'Compliance certificates'],
      grow_time: ['Trust accounting time', 'Matter billing', 'Reconciliation tracking'],
      grow_hq: ['Trust operator roles', 'Fund administrator access', 'Compliance controls']
    }
  },
  {
    id: 'grow_investments',
    name: 'Grow Investments',
    subtitle: 'Fund Management',
    integrations: {
      grow_crm: ['Investor registry', 'Fund manager CRM', 'Syndicate relationships'],
      grow_documents: ['PDS & fund documents', 'Investor agreements', 'Compliance reporting'],
      grow_time: ['Fund admin time', 'Deal sourcing tracking', 'Investor relations billing'],
      grow_hq: ['Fund operator roles', 'Investor portal access', 'Multi-fund structure']
    }
  },
  {
    id: 'grow_receivership',
    name: 'Grow Receivership',
    subtitle: 'Restructuring & MIP',
    integrations: {
      grow_crm: ['Creditor management', 'Stakeholder tracking', 'Court liaison contacts'],
      grow_documents: ['Appointment docs', 'Asset registers', 'Court filing repository'],
      grow_time: ['Receiver time tracking', 'Asset realization billing', 'Court appearance logging'],
      grow_hq: ['Receiver role management', 'Multi-appointment structure', 'Compliance branding']
    }
  },
  {
    id: 'grow_settlement',
    name: 'Grow Settlement',
    subtitle: 'Property Settlement',
    integrations: {
      grow_crm: ['Vendor/purchaser contacts', 'Agent relationships', 'Conveyancer network'],
      grow_documents: ['Contract of sale', 'Vendor/purchaser statements', 'Title documents'],
      grow_time: ['Settlement preparation time', 'Conveyancing billing', 'Settlement attendance'],
      grow_hq: ['Conveyancer user roles', 'Practice branding', 'Settlement team access']
    }
  },
  {
    id: 'grow_payments',
    name: 'Grow Payments',
    subtitle: 'Payment Gateway',
    integrations: {
      grow_crm: ['Payment contact linking', 'Customer payment profiles'],
      grow_documents: ['Receipt generation', 'Payment confirmations', 'Invoice storage'],
      grow_time: ['Payment processing time', 'Transaction fee tracking', 'Reconciliation billing'],
      grow_hq: ['Payment operator roles', 'Merchant configuration', 'Gateway branding']
    }
  }
];

export function IntegrationArchitecture({ onBack }: IntegrationArchitectureProps) {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [expandedCore, setExpandedCore] = useState<string | null>(null);

  const selectedModuleData = specializedModules.find(m => m.id === selectedModule);

  return (
    <div className="min-h-screen bg-white/5 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Back to Grow HQ
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-100">Integration Architecture</h1>
              <p className="text-slate-300 mt-2">
                How core add-on modules integrate with specialized modules
              </p>
            </div>
            <div className="px-4 py-2 bg-blue-500/10 border-2 border-blue-300 rounded-lg">
              <p className="text-sm font-semibold text-blue-300">
                8 Specialized Modules + 4 Core Add-Ons = Unified Platform
              </p>
            </div>
          </div>
        </div>

        {/* Architecture Overview */}
        <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layout className="w-6 h-6 text-blue-400" />
              Platform Architecture Model
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border-2 border-blue-500/30">
                <h3 className="font-bold text-slate-100 mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  Integration Philosophy
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-blue-500/10 rounded">
                    <p className="font-semibold text-blue-300 mb-1">Shared Services</p>
                    <p className="text-sm text-blue-300">Core modules provide shared functionality that all specialized modules can leverage</p>
                  </div>
                  <div className="p-3 bg-purple-500/10 rounded">
                    <p className="font-semibold text-purple-300 mb-1">Opt-In Model</p>
                    <p className="text-sm text-purple-300">Operators only pay for what they need. Add-ons enhance capabilities without forcing adoption</p>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded">
                    <p className="font-semibold text-green-300 mb-1">Data Unification</p>
                    <p className="text-sm text-green-300">When enabled, core modules unify data across specialized modules for enterprise insights</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg">
                  <h4 className="font-semibold text-slate-100 mb-2">Without Core Add-Ons</h4>
                  <ul className="space-y-1 text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400">â€¢</span>
                      <span>Each module has isolated contacts, documents, and time tracking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400">â€¢</span>
                      <span>Module-specific data silos with basic functionality</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400">â€¢</span>
                      <span>Manual cross-module workflows and data entry</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border-2 border-green-300">
                  <h4 className="font-semibold text-green-300 mb-2">With Core Add-Ons Enabled</h4>
                  <ul className="space-y-1 text-sm text-green-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Unified contact database accessible from every module</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Enterprise document repository with smart search</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Organization-wide time tracking and automated billing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Centralized management console for all modules</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Core Add-On Modules */}
        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">Core Add-On Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {coreModules.map((module) => {
              const Icon = module.icon;
              const isExpanded = expandedCore === module.id;
              const colorMap = {
                blue: 'bg-blue-500/10 border-blue-300 text-blue-400',
                purple: 'bg-purple-500/10 border-purple-300 text-purple-400',
                green: 'bg-green-500/10 border-green-300 text-green-400',
                orange: 'bg-orange-500/10 border-orange-300 text-orange-400'
              };
              return (
                <Card 
                  key={module.id}
                  className={`border-2 cursor-pointer transition-all hover:shadow-lg ${
                    isExpanded ? colorMap[module.color] : 'border-white/10'
                  }`}
                  onClick={() => setExpandedCore(isExpanded ? null : module.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-3 rounded-lg ${colorMap[module.color]}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-slate-300" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <h3 className="font-bold text-slate-100 mb-1">{module.name}</h3>
                    <p className="text-xs text-slate-300">{module.description}</p>
                    
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t space-y-2">
                        {module.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-slate-300">{benefit}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Specialized Modules */}
        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">Specialized Modules</h2>
          <p className="text-slate-300 mb-4">
            Click any module to see how core add-ons integrate and enhance functionality
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {specializedModules.map((module) => (
              <Card
                key={module.id}
                className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
                  selectedModule === module.id ? 'border-blue-500 bg-blue-500/10' : 'border-white/10'
                }`}
                onClick={() => setSelectedModule(selectedModule === module.id ? null : module.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-white/5 rounded-lg">
                      <Package className="w-5 h-5 text-slate-300" />
                    </div>
                    {selectedModule === module.id && (
                      <CheckCircle className="w-5 h-5 text-blue-400" />
                    )}
                  </div>
                  <h3 className="font-bold text-slate-100 mb-1">{module.name}</h3>
                  <p className="text-xs text-slate-300">{module.subtitle}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Integration Details */}
        {selectedModuleData && (
          <Card className="border-2 border-blue-400 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardTitle className="flex items-center justify-between">
                <span className="text-xl">
                  Integration Map: {selectedModuleData.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedModule(null)}
                  className="text-white hover:bg-white/20"
                >
                  Close
                </Button>
              </CardTitle>
              <p className="text-sm text-blue-100 mt-1">{selectedModuleData.subtitle}</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Grow CRM Integration */}
                <div className="p-4 border-2 border-blue-500/30 bg-blue-500/10 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100">Grow CRM</h3>
                      <p className="text-xs text-slate-300">Contact & Relationship Management</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {selectedModuleData.integrations.grow_crm.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <ArrowRight className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-100">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grow Documents Integration */}
                <div className="p-4 border-2 border-purple-500/30 bg-purple-500/10 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-600 rounded-lg">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100">Grow Documents</h3>
                      <p className="text-xs text-slate-300">Document Management System</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {selectedModuleData.integrations.grow_documents.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <ArrowRight className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-100">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grow Time Integration */}
                <div className="p-4 border-2 border-green-500/30 bg-green-500/10 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-600 rounded-lg">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100">Grow Time & Revenue</h3>
                      <p className="text-xs text-slate-300">Time Tracking & Billing</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {selectedModuleData.integrations.grow_time.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <ArrowRight className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-100">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grow HQ Integration */}
                <div className="p-4 border-2 border-orange-500/30 bg-orange-500/10 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-orange-600 rounded-lg">
                      <Settings className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100">Grow HQ</h3>
                      <p className="text-xs text-slate-300">SaaS Management Console</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {selectedModuleData.integrations.grow_hq.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <ArrowRight className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-100">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pricing & Licensing Model */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-green-400" />
              Pricing & Licensing Model
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-slate-100 mb-3">Specialized Modules</h3>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-slate-100">Base Price</span>
                      <span className="text-2xl font-bold text-blue-400">$199</span>
                    </div>
                    <p className="text-xs text-slate-300">Per module, per month</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded text-sm text-slate-300">
                    <p className="font-medium mb-1">Includes:</p>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        Module-specific functionality
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        Basic contacts & documents (module-isolated)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        Simple time tracking
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        Unlimited users
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-100 mb-3">Core Add-On Modules</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Grow CRM', price: '$99', features: ['Unified contacts', 'Pipeline management', 'Email sync'] },
                    { name: 'Grow Documents', price: '$149', features: ['Enterprise DMS', 'Version control', 'OCR & AI extraction'] },
                    { name: 'Grow Time & Revenue', price: '$129', features: ['Cross-module time tracking', 'Automated billing', 'Revenue recognition'] },
                    { name: 'Grow HQ', price: 'FREE', features: ['Always included', 'SaaS management', 'Multi-module admin'] }
                  ].map((addon, idx) => (
                    <div key={idx} className="p-3 border-2 border-blue-500/30 bg-blue-500/10 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-slate-100">{addon.name}</span>
                        <span className="text-lg font-bold text-blue-400">{addon.price}</span>
                      </div>
                      <div className="space-y-1">
                        {addon.features.map((feature, fidx) => (
                          <p key={fidx} className="text-xs text-slate-300 flex items-center gap-1">
                            <span className="text-blue-400">â€¢</span>
                            {feature}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-lg">
              <div className="flex items-start gap-3">
                <Zap className="w-6 h-6 text-green-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-green-300 mb-2">Example Bundle Pricing</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-semibold text-slate-100">Small Practice</p>
                      <p className="text-xs text-slate-300 mb-1">Grow Accounting + Grow CRM</p>
                      <p className="text-lg font-bold text-blue-400">$298/month</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-100">Mid-Size Firm</p>
                      <p className="text-xs text-slate-300 mb-1">3 modules + all add-ons</p>
                      <p className="text-lg font-bold text-blue-400">$974/month</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-100">Enterprise</p>
                      <p className="text-xs text-slate-300 mb-1">All 11 modules + add-ons</p>
                      <p className="text-lg font-bold text-blue-400">$2,566/month</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Implementation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-6 h-6 text-purple-400" />
              Technical Implementation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Data Architecture */}
              <div>
                <h3 className="font-semibold text-slate-100 mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-400" />
                  Data Architecture
                </h3>
                <div className="space-y-3">
                  <div className="p-4 bg-white/5 rounded-lg border">
                    <p className="font-semibold text-slate-100 mb-2">Shared Database Layer</p>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                        <span><strong>contacts_universal</strong> - Single source of truth for all contacts</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                        <span><strong>documents_enterprise</strong> - Centralized document storage</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                        <span><strong>time_entries_global</strong> - Cross-module time tracking</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                        <span><strong>organization_config</strong> - Branding & settings</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 bg-blue-500/10 rounded-lg border-2 border-blue-300">
                    <p className="font-semibold text-blue-300 mb-2">Module-Specific Tables</p>
                    <p className="text-sm text-blue-300">
                      Each specialized module maintains its own tables (loans, jobs, matters, etc.) 
                      but links to shared core tables via foreign keys
                    </p>
                  </div>
                </div>
              </div>

              {/* API Integration */}
              <div>
                <h3 className="font-semibold text-slate-100 mb-4 flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-purple-400" />
                  API & Service Integration
                </h3>
                <div className="space-y-3">
                  <div className="p-4 bg-white/5 rounded-lg border">
                    <p className="font-semibold text-slate-100 mb-2">Microservices Architecture</p>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-start gap-2">
                        <LinkIcon className="w-4 h-4 text-purple-400 mt-0.5" />
                        <span><strong>CRM Service API</strong> - /api/crm/* endpoints</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <LinkIcon className="w-4 h-4 text-purple-400 mt-0.5" />
                        <span><strong>Documents Service API</strong> - /api/docs/* endpoints</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <LinkIcon className="w-4 h-4 text-purple-400 mt-0.5" />
                        <span><strong>Time Service API</strong> - /api/time/* endpoints</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <LinkIcon className="w-4 h-4 text-purple-400 mt-0.5" />
                        <span><strong>Admin Service API</strong> - /api/admin/* endpoints</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 bg-purple-500/10 rounded-lg border-2 border-purple-300">
                    <p className="font-semibold text-purple-300 mb-2">Feature Flag System</p>
                    <p className="text-sm text-purple-300 mb-3">
                      Core modules are feature-flagged per organization. UI components detect 
                      enabled modules and render accordingly.
                    </p>
                    <div className="bg-white p-3 rounded border font-mono text-xs text-slate-300">
                      {`if (org.hasModule('grow_crm')) {`}
                      <br />
                      {'  '}// Show CRM integration buttons
                      <br />
                      {`}`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Use Case Example */}
        <Card className="border-2 border-green-300">
          <CardHeader className="bg-green-500/10">
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-green-400" />
              Real-World Integration Example
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-500/30">
                <h3 className="font-bold text-slate-100 mb-3">
                  Scenario: Law Firm Using Grow Trust + Grow Settlement + All Add-Ons
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      step: 1,
                      module: 'Grow CRM',
                      action: 'New property settlement client "John Smith" added to CRM',
                      result: 'Contact automatically available in both Grow Trust and Grow Settlement'
                    },
                    {
                      step: 2,
                      module: 'Grow Settlement',
                      action: 'Settlement matter created for property purchase',
                      result: 'Links to John Smith contact from CRM'
                    },
                    {
                      step: 3,
                      module: 'Grow Trust',
                      action: 'Trust receipt of $850,000 deposit recorded',
                      result: 'Automatically linked to settlement matter and John Smith contact'
                    },
                    {
                      step: 4,
                      module: 'Grow Documents',
                      action: 'Contract of Sale, Section 32, and bank cheques uploaded',
                      result: 'Documents tagged to matter, accessible in both modules'
                    },
                    {
                      step: 5,
                      module: 'Grow Time & Revenue',
                      action: 'Lawyer logs 2.5 hours of settlement preparation work',
                      result: 'Time tracked to matter, ready for automated billing'
                    },
                    {
                      step: 6,
                      module: 'Grow Documents',
                      action: 'Settlement statement generated using template',
                      result: 'Auto-populated with trust transactions and time costs'
                    },
                    {
                      step: 7,
                      module: 'Grow Time & Revenue',
                      action: 'Invoice generated for settlement services',
                      result: 'Includes time costs, disbursements, and trust charges'
                    },
                    {
                      step: 8,
                      module: 'Grow CRM',
                      action: 'Settlement completed, relationship status updated',
                      result: 'Contact flagged for follow-up in 12 months for investment opportunities'
                    }
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4 p-3 bg-white rounded-lg border">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {item.step}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 bg-blue-500/15 text-blue-300 text-xs font-semibold rounded">
                            {item.module}
                          </span>
                          <span className="text-sm font-semibold text-slate-100">{item.action}</span>
                        </div>
                        <p className="text-sm text-green-300">
                          <strong>Result:</strong> {item.result}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-green-500/10 border-2 border-green-300 rounded-lg">
                  <h3 className="font-bold text-green-300 mb-3">Benefits Realized</h3>
                  <ul className="space-y-2 text-sm text-green-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                      <span><strong>Zero Data Re-Entry:</strong> Contact entered once, available everywhere</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                      <span><strong>Complete Audit Trail:</strong> All documents, time, and transactions linked</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                      <span><strong>Automated Billing:</strong> Invoice generated from time & trust data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                      <span><strong>Cross-Sell Opportunity:</strong> CRM identifies future opportunities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                      <span><strong>Unified Search:</strong> Find any record across all modules instantly</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-blue-500/10 border-2 border-blue-300 rounded-lg">
                  <h3 className="font-bold text-blue-300 mb-3">Without Add-Ons</h3>
                  <ul className="space-y-2 text-sm text-blue-300">
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5" />
                      <span>Contact must be entered separately in Trust and Settlement</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5" />
                      <span>Documents stored in each module separately</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5" />
                      <span>Time tracked per module, manual consolidation needed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5" />
                      <span>No cross-module insights or relationship tracking</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-yellow-500/10 border-2 border-yellow-300 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-yellow-300 mb-1">Cost vs. Efficiency</p>
                      <p className="text-sm text-yellow-300">
                        Total add-on cost: <strong>$377/month</strong><br />
                        Time saved per month: <strong>~40 hours</strong><br />
                        ROI at $100/hour billing: <strong>$4,000 saved = 10.6x return</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Implementation Roadmap */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-6 h-6 text-indigo-400" />
              Activation & Implementation Roadmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  phase: 'Phase 1: Core Setup',
                  duration: 'Day 1',
                  steps: [
                    'Operator activates specialized modules (e.g., Grow Trust, Grow Settlement)',
                    'Grow HQ automatically provisioned (always included)',
                    'Configure organization branding and custom domain',
                    'Set up initial user accounts and roles'
                  ]
                },
                {
                  phase: 'Phase 2: Optional Add-Ons',
                  duration: 'Day 1-2',
                  steps: [
                    'Enable Grow CRM â†’ Imports existing contacts from specialized modules',
                    'Enable Grow Documents â†’ Consolidates documents into enterprise DMS',
                    'Enable Grow Time & Revenue â†’ Links existing activities to billing system',
                    'All modules now share unified data layer'
                  ]
                },
                {
                  phase: 'Phase 3: Integration',
                  duration: 'Day 2-3',
                  steps: [
                    'Cross-module workflows automatically activated',
                    'UI components in specialized modules now show CRM/Docs/Time features',
                    'Data migration from isolated module tables to shared tables',
                    'Staff training on unified platform capabilities'
                  ]
                },
                {
                  phase: 'Phase 4: Optimization',
                  duration: 'Ongoing',
                  steps: [
                    'Configure custom workflows between modules',
                    'Set up automated billing rules',
                    'Customize document templates',
                    'Build cross-module reporting dashboards'
                  ]
                }
              ].map((phase, idx) => (
                <div key={idx} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded">
                      {phase.duration}
                    </span>
                    <h4 className="font-bold text-slate-100">{phase.phase}</h4>
                  </div>
                  <ul className="space-y-1 ml-2">
                    {phase.steps.map((step, sidx) => (
                      <li key={sidx} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="text-blue-400 mt-1">â€¢</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Module Compatibility Matrix */}
        <Card>
          <CardHeader>
            <CardTitle>Module Compatibility Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/5">
                    <th className="px-4 py-3 text-left font-semibold text-slate-300 border">Specialized Module</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-300 border">Grow CRM</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-300 border">Grow Documents</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-300 border">Grow Time</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-300 border">Grow HQ</th>
                  </tr>
                </thead>
                <tbody>
                  {specializedModules.map((module) => (
                    <tr key={module.id} className="hover:bg-white/5">
                      <td className="px-4 py-3 font-medium text-slate-100 border">
                        {module.name}
                        <p className="text-xs text-slate-300">{module.subtitle}</p>
                      </td>
                      <td className="px-4 py-3 text-center border">
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-green-500/15 rounded-full">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center border">
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-green-500/15 rounded-full">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center border">
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-green-500/15 rounded-full">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center border">
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-500/15 rounded-full">
                          <Shield className="w-4 h-4 text-blue-400" />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 flex items-center gap-6 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Full Integration Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span>Always Included (Free)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Recommendations */}
        <Card className="border-2 border-indigo-300 bg-gradient-to-br from-indigo-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-6 h-6 text-indigo-400" />
              Operator Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg border-2 border-green-300">
                <h3 className="font-bold text-green-300 mb-2">High Priority</h3>
                <p className="text-sm text-green-300 mb-3">
                  Operators using <strong>2+ specialized modules</strong>
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Enable Grow CRM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Enable Grow Documents</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-2">
                    Eliminates data silos and saves 15-20 hours/month
                  </p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border-2 border-blue-300">
                <h3 className="font-bold text-blue-300 mb-2">Medium Priority</h3>
                <p className="text-sm text-blue-300 mb-3">
                  Operators with <strong>billable services</strong>
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                    <span>Enable Grow Time & Revenue</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-2">
                    Captures 95%+ of billable time vs. 60-70% manual tracking
                  </p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border-2 border-orange-300">
                <h3 className="font-bold text-orange-300 mb-2">Always Included</h3>
                <p className="text-sm text-orange-300 mb-3">
                  <strong>Every operator</strong> gets Grow HQ
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-orange-400" />
                    <span>Module management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-orange-400" />
                    <span>User administration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-orange-400" />
                    <span>White-label control</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

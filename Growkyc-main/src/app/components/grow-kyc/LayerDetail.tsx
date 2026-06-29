import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  ArrowLeft,
  Users,
  TrendingUp,
  Shield,
  FileText,
  Network,
  CheckCircle,
  Zap,
  Target,
  Clock,
  DollarSign,
  AlertCircle,
  Database,
  Activity,
  Lock,
  Eye,
  Globe,
  Sparkles,
  BarChart3
} from 'lucide-react';

interface LayerDetailProps {
  layerId: string;
  onBack: () => void;
}

const layerData = {
  'client-entity': {
    name: 'Client & Entity Layer',
    icon: Users,
    color: 'blue',
    gradient: 'from-blue-500 to-blue-600',
    tagline: 'Complete Client Lifecycle Management',
    description: 'Manage the entire client journey from onboarding through ongoing relationship management with automated verification and compliance checks.',
    keyFeatures: [
      {
        title: 'Smart Client Onboarding',
        description: 'Self-service portals with drag-and-drop document upload, auto-OCR data extraction, and real-time verification.',
        icon: Users,
        benefits: ['80% faster onboarding', 'Zero data entry errors', '99.7% automation']
      },
      {
        title: 'Entity Registry',
        description: 'Centralized repository of all client entities with automatic updates from ASIC, ABR, and other registries.',
        icon: Database,
        benefits: ['Single source of truth', 'Auto-refresh from registries', 'Instant search']
      },
      {
        title: 'Beneficial Ownership Mapping',
        description: 'Visual graph of ownership structures, automatically mapping UBOs, controllers, and significant stakeholders.',
        icon: Network,
        benefits: ['25% ownership visualization', 'Automatic UBO identification', 'Compliance with AUSTRAC Tranche 2']
      },
      {
        title: 'Document Management',
        description: 'Secure vault with version control, expiry tracking, and automatic renewal reminders.',
        icon: Lock,
        benefits: ['SHA-256 encryption', '7-year retention', 'Audit trail']
      }
    ],
    modules: [
      'Individual Onboarding',
      'Company Onboarding',
      'Trust Onboarding',
      'Partnership Onboarding',
      'SMSF Onboarding',
      'Client Registry',
      'Ownership Mapper',
      'Document Vault'
    ],
    integrations: [
      'ASIC Business Names',
      'ABR (Australian Business Register)',
      'InfoTrack ID Verification',
      'Equifax Credit Bureau',
      'Veda Credit Score',
      'PEXA Property Data'
    ],
    compliance: [
      'AUSTRAC AML/CTF Program',
      'ASIC RG78 (Financial Services)',
      'NCCP (National Credit Code)',
      'Privacy Act 1988',
      'KYC Best Practice'
    ],
    useCases: [
      {
        scenario: 'Accountant onboards new SME client',
        before: '2-3 days manual processing, 15+ emails, multiple calls',
        after: '4.2 minutes automated, client self-serves, auto-verification'
      },
      {
        scenario: 'Credit provider verifies borrower',
        before: '48 hours for ID checks, manual document review',
        after: '3.7 minutes with InfoTrack integration, instant decision'
      },
      {
        scenario: 'AFSL holder onboards fund',
        before: '5-7 days for UBO mapping, manual org chart',
        after: '12 minutes with visual ownership graph, auto ASIC lookup'
      }
    ]
  },
  'risk-intelligence': {
    name: 'Risk & Intelligence Layer',
    icon: TrendingUp,
    color: 'purple',
    gradient: 'from-purple-500 to-purple-600',
    tagline: 'AI-Powered Risk Assessment & Intelligence',
    description: 'Advanced risk scoring, graph intelligence, and real-time monitoring to identify and manage compliance risks before they become problems.',
    keyFeatures: [
      {
        title: 'AI Risk Scoring Engine',
        description: 'Machine learning model scores clients 0-100 based on 50+ risk factors with explainable AI showing why.',
        icon: Sparkles,
        benefits: ['0-100 risk score', 'Explainable AI', 'Auto-classification']
      },
      {
        title: 'Graph Intelligence',
        description: 'Network analysis reveals hidden connections between entities, identifying related party risks.',
        icon: Network,
        benefits: ['Relationship mapping', 'Hidden connection discovery', 'Risk propagation']
      },
      {
        title: 'Transaction Monitoring',
        description: 'Real-time monitoring of transactions with pattern detection, threshold alerts, and suspicious activity flagging.',
        icon: Activity,
        benefits: ['Real-time alerts', 'Pattern detection', 'AML compliance']
      },
      {
        title: 'Sanctions & PEP Screening',
        description: 'Automated screening against global sanctions lists, PEP databases, and adverse media with daily updates.',
        icon: Shield,
        benefits: ['Daily screening', 'Global coverage', 'Adverse media']
      }
    ],
    modules: [
      'AI Risk Scoring',
      'Graph Intelligence',
      'Transaction Monitoring',
      'Sanctions Screening',
      'PEP Screening',
      'Adverse Media',
      'Risk Dashboard',
      'Alert Management'
    ],
    integrations: [
      'World-Check (Refinitiv)',
      'Dow Jones Risk & Compliance',
      'ComplyAdvantage',
      'LexisNexis WorldCompliance',
      'DFAT Sanctions List',
      'UN Sanctions List'
    ],
    compliance: [
      'AUSTRAC AML/CTF Rules',
      'FATF Recommendations',
      'UN Sanctions Compliance',
      'ASIC RG271 (Internal Dispute Resolution)',
      'Enhanced Due Diligence Requirements'
    ],
    useCases: [
      {
        scenario: 'Credit provider assesses loan risk',
        before: 'Manual credit score + gut feel, 60% accuracy',
        after: 'AI model with 87% predictive accuracy, instant decision'
      },
      {
        scenario: 'Fund manager screens investor',
        before: '2-3 days for PEP/sanctions check, manual research',
        after: '2.4 seconds automated screening, instant alert if match'
      },
      {
        scenario: 'Bank detects suspicious transaction',
        before: 'Weekly batch review, 95% false positives',
        after: 'Real-time alerts, 40% false positive rate, AI prioritization'
      }
    ]
  },
  'compliance-workflow': {
    name: 'Compliance Workflow Layer',
    icon: Shield,
    color: 'green',
    gradient: 'from-green-500 to-green-600',
    tagline: 'Automated Compliance Workflows',
    description: 'End-to-end compliance workflows with hard gates, automated checks, and regulatory requirement enforcement.',
    keyFeatures: [
      {
        title: 'KYC Verification Workflows',
        description: '100-point ID checks, address verification, and identity validation with InfoTrack integration.',
        icon: CheckCircle,
        benefits: ['100-point ID system', 'InfoTrack integration', 'Auto-verification']
      },
      {
        title: 'Case Management',
        description: 'Manage KYC, EDD, and investigation cases with workflow automation, SLA tracking, and assignment rules.',
        icon: FileText,
        benefits: ['SLA tracking', 'Auto-assignment', 'Workflow automation']
      },
      {
        title: 'Hard Gates & Approvals',
        description: 'Prevent non-compliant actions with hard stops requiring approval before proceeding.',
        icon: Lock,
        benefits: ['Hard stops', 'Approval workflows', 'Audit trail']
      },
      {
        title: 'Periodic Review Automation',
        description: 'Automatic triggers for annual reviews, document renewals, and re-verification with smart scheduling.',
        icon: Clock,
        benefits: ['Auto-scheduling', 'Expiry tracking', 'Review reminders']
      }
    ],
    modules: [
      'KYC Verification',
      'Enhanced Due Diligence',
      'Case Management',
      'Workflow Builder',
      'Approval Engine',
      'Periodic Reviews',
      'Document Expiry',
      'Compliance Checklist'
    ],
    integrations: [
      'InfoTrack ID Verification',
      'ASIC Connect',
      'ABR Lookup',
      'Email Notifications',
      'SMS Alerts',
      'Slack Integration'
    ],
    compliance: [
      'AUSTRAC KYC Requirements',
      'ASIC Client Verification',
      'NCCP Responsible Lending',
      'AML/CTF Ongoing CDD',
      'Know Your Customer Best Practice'
    ],
    useCases: [
      {
        scenario: 'Accountant verifies new client',
        before: '3-5 days manual ID checks, phone calls, email back-and-forth',
        after: '5.2 minutes self-service upload, instant InfoTrack verification'
      },
      {
        scenario: 'Credit provider conducts annual review',
        before: 'Manual tracking in Excel, 40% missed deadlines',
        after: 'Auto-scheduled, 98% completion rate, email reminders'
      },
      {
        scenario: 'AFSL holder performs EDD',
        before: '7-10 days manual research, inconsistent documentation',
        after: '2.1 hours with guided workflow, standardized evidence'
      }
    ]
  },
  'governance-reporting': {
    name: 'Governance & Reporting Layer',
    icon: FileText,
    color: 'amber',
    gradient: 'from-amber-500 to-amber-600',
    tagline: 'Audit-Ready Governance & Reporting',
    description: 'Enterprise governance, breach management, and regulatory reporting with audit trails and compliance dashboards.',
    keyFeatures: [
      {
        title: 'Breach Management',
        description: 'Record, investigate, and report breaches with AUSTRAC/ASIC reporting workflows and root cause analysis.',
        icon: AlertCircle,
        benefits: ['Breach register', 'AUSTRAC reporting', 'Root cause analysis']
      },
      {
        title: 'Regulatory Reports',
        description: 'Pre-built reports for AUSTRAC TTR, SMR, ASIC, and other regulators with one-click generation.',
        icon: FileText,
        benefits: ['TTR automation', 'SMR filing', 'One-click exports']
      },
      {
        title: 'Audit Dashboard',
        description: 'Real-time compliance metrics, KPI tracking, and executive dashboards with drill-down capabilities.',
        icon: BarChart3,
        benefits: ['Live KPIs', 'Executive dashboards', 'Drill-down']
      },
      {
        title: 'Policy Management',
        description: 'Version-controlled policies, procedures, and training materials with attestation tracking.',
        icon: FileText,
        benefits: ['Version control', 'Attestation', 'Policy library']
      }
    ],
    modules: [
      'Breach Register',
      'Regulatory Reports',
      'Audit Dashboard',
      'Policy Management',
      'Training Management',
      'Attestation Tracking',
      'KPI Dashboard',
      'Executive Reports'
    ],
    integrations: [
      'AUSTRAC Online',
      'ASIC Regulatory Portal',
      'Power BI',
      'Tableau',
      'Excel Export',
      'PDF Generation'
    ],
    compliance: [
      'AUSTRAC Reporting Requirements',
      'ASIC Breach Reporting',
      'Privacy Breach Notification',
      'SOX Compliance (US)',
      'ISO 27001 Audit Requirements'
    ],
    useCases: [
      {
        scenario: 'Credit provider files TTR to AUSTRAC',
        before: '4-6 hours manual Excel compilation, errors common',
        after: '12 minutes one-click export, zero errors, auto-validation'
      },
      {
        scenario: 'Fund manager prepares for audit',
        before: '3-4 weeks gathering evidence, inconsistent records',
        after: '2 hours with audit pack export, complete audit trail'
      },
      {
        scenario: 'Legal firm reports data breach',
        before: '2-3 days determining scope, manual OAIC notification',
        after: '4.7 hours with breach workflow, auto OAIC submission'
      }
    ]
  },
  'infrastructure': {
    name: 'Infrastructure & Integration Layer',
    icon: Network,
    color: 'pink',
    gradient: 'from-pink-500 to-pink-600',
    tagline: 'Enterprise Infrastructure & APIs',
    description: 'Secure infrastructure, API platform, and integrations connecting compliance to your entire tech stack.',
    keyFeatures: [
      {
        title: 'API Platform',
        description: 'RESTful APIs for all compliance functions with webhook support, rate limiting, and comprehensive docs.',
        icon: Zap,
        benefits: ['REST APIs', 'Webhooks', 'Rate limiting']
      },
      {
        title: 'Evidence Vault',
        description: 'Encrypted storage with SHA-256 hashing, tamper detection, and 7-year retention with chain-of-custody.',
        icon: Lock,
        benefits: ['SHA-256 encryption', '7-year retention', 'Tamper detection']
      },
      {
        title: 'Zero Trust Security',
        description: 'Role-based access control, multi-factor authentication, and IP whitelisting with session management.',
        icon: Shield,
        benefits: ['RBAC', 'MFA', 'IP whitelist']
      },
      {
        title: 'Integration Hub',
        description: 'Pre-built connectors to Xero, MYOB, practice management, CRM, and other business systems.',
        icon: Network,
        benefits: ['Pre-built connectors', 'Sync automation', 'Data mapping']
      }
    ],
    modules: [
      'API Gateway',
      'Webhook Manager',
      'Evidence Vault',
      'Access Control',
      'Integration Hub',
      'SSO Provider',
      'Audit Logger',
      'Data Export'
    ],
    integrations: [
      'Xero Practice Manager',
      'MYOB Practice',
      'HubSpot CRM',
      'Salesforce',
      'Microsoft 365',
      'Google Workspace',
      'Slack',
      'MS Teams'
    ],
    compliance: [
      'ISO 27001 (Information Security)',
      'SOC 2 Type II',
      'GDPR (EU Data Protection)',
      'Privacy Act 1988',
      'APRA CPS 234 (Banking Security)'
    ],
    useCases: [
      {
        scenario: 'Accounting firm syncs clients from Xero',
        before: 'Manual CSV import weekly, 30% data errors',
        after: 'Real-time sync via API, zero manual work, 100% accuracy'
      },
      {
        scenario: 'Credit provider integrates loan system',
        before: 'No integration, dual data entry, 3-day lag',
        after: 'API integration, instant KYC results, automated decisioning'
      },
      {
        scenario: 'AFSL holder needs audit evidence',
        before: 'Search emails/SharePoint, 80% incomplete records',
        after: 'Evidence vault export, complete chain-of-custody, 100% coverage'
      }
    ]
  }
};

export function LayerDetail({ layerId, onBack }: LayerDetailProps) {
  const layer = layerData[layerId as keyof typeof layerData];
  
  if (!layer) {
    return (
      <div className="min-h-screen bg-[#0d121d] p-8">
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="text-center mt-12">
          <p className="text-slate-300">Layer not found</p>
        </div>
      </div>
    );
  }

  const LayerIcon = layer.icon;

  return (
    <div className="min-h-screen bg-[#0d121d]">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0a0e17]">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <Button onClick={onBack} variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Overview
          </Button>

          <div className="flex items-center gap-6 mb-6">
            <div className={`w-20 h-20 bg-gradient-to-br ${layer.gradient} rounded-2xl flex items-center justify-center shadow-xl`}>
              <LayerIcon className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{layer.name}</h1>
              <p className="text-xl text-slate-300">{layer.tagline}</p>
            </div>
          </div>

          <p className="text-lg text-slate-300 max-w-4xl">{layer.description}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Key Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {layer.keyFeatures.map((feature, idx) => {
              const FeatureIcon = feature.icon;
              return (
                <Card key={idx} className="border-2 hover:border-[#13B5EA] transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 bg-${layer.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <FeatureIcon className={`w-6 h-6 text-${layer.color}-600`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                        <p className="text-slate-300 mb-4">{feature.description}</p>
                        <div className="space-y-2">
                          {feature.benefits.map((benefit, bidx) => (
                            <div key={bidx} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-sm text-slate-300">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Modules */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Included Modules</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {layer.modules.map((module, idx) => (
              <Card key={idx} className="bg-[#0a0e17] hover:bg-white/5 transition-colors">
                <CardContent className="p-4 text-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-white">{module}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Use Cases */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Real-World Impact</h2>
          <div className="space-y-6">
            {layer.useCases.map((useCase, idx) => (
              <Card key={idx} className="border-2 border-white/10">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-white mb-4">{useCase.scenario}</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <span className="font-semibold text-red-900">Before</span>
                      </div>
                      <p className="text-sm text-slate-300">{useCase.before}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-900">After</span>
                      </div>
                      <p className="text-sm text-slate-300">{useCase.after}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Grid Layout for Integrations & Compliance */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Integrations */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="w-6 h-6 text-[#13B5EA]" />
                Integrations
              </CardTitle>
              <CardDescription>Pre-built connectors and APIs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {layer.integrations.map((integration, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-[#0a0e17] rounded">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-white">{integration}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Compliance */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-green-600" />
                Compliance Coverage
              </CardTitle>
              <CardDescription>Regulatory requirements met</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {layer.compliance.map((comp, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-green-50 rounded border border-green-200">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-white">{comp}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-[#13B5EA] to-[#0E7C9E] text-white border-0">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to see {layer.name} in action?</h3>
            <p className="text-white/90 mb-6 text-lg">
              Schedule a demo to see how this layer transforms your compliance operations.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button 
                size="lg"
                className="bg-[#0d121d] text-[#13B5EA] hover:bg-white/90"
                onClick={onBack}
              >
                Explore Other Layers
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Schedule Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
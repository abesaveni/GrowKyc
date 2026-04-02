import React, { useState } from 'react';
import {
  Calculator,
  Scale,
  DollarSign,
  CheckCircle,
  ArrowRight,
  Users,
  FileText,
  Clock,
  Shield,
  Target,
  TrendingUp,
  Calendar,
  Briefcase,
  Building2,
  AlertTriangle,
  Sparkles,
  Zap
} from 'lucide-react';
import { PrimaryButton, SecondaryButton, StatusBadge } from '../onboarding/DesignSystem';
import { toast } from 'sonner';

type Vertical = 'accounting' | 'legal' | 'finance' | null;

interface VerticalFeature {
  title: string;
  description: string;
  icon: any;
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export function VerticalOnboarding({ onComplete }: { onComplete?: () => void }) {
  const [selectedVertical, setSelectedVertical] = useState<Vertical>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const verticals = [
    {
      id: 'accounting' as Vertical,
      name: 'Accounting Firms',
      icon: Calculator,
      color: 'blue',
      tagline: 'Tax, compliance, and advisory services',
      features: [
        'Client register with entity relationships',
        'Recurring jobs & compliance calendar',
        'Structured workpapers with tick marks',
        'Year-on-year variance analysis',
        'Document packs & engagement letters',
        'Time tracking & WIP management',
        'Client portal with automated reminders'
      ]
    },
    {
      id: 'legal' as Vertical,
      name: 'Legal Firms',
      icon: Scale,
      color: 'purple',
      tagline: 'Matter management and document automation',
      features: [
        'Matter register with conflict checks',
        'Document automation & templates',
        'Version control with redline compare',
        'Time recording by matter',
        'Trust accounting integration',
        'Court date & deadline tracking',
        'Client & third-party portals'
      ]
    },
    {
      id: 'finance' as Vertical,
      name: 'Finance & Lending',
      icon: DollarSign,
      color: 'green',
      tagline: 'Deal pipeline and credit management',
      features: [
        'Deal pipeline with stages',
        'Borrower & guarantor profiles',
        'Asset register with security',
        'Credit memo builder',
        'Covenant tracking & reporting',
        'Investor register & distributions',
        'Payment schedules & arrears alerts'
      ]
    }
  ];

  const getOnboardingSteps = (vertical: Vertical): OnboardingStep[] => {
    const steps: Record<Vertical, OnboardingStep[]> = {
      accounting: [
        {
          id: 'clients',
          title: 'Set up your client register',
          description: 'Import or create clients with entity structures',
          completed: false
        },
        {
          id: 'calendar',
          title: 'Configure compliance calendar',
          description: 'Set up recurring jobs and lodgement dates',
          completed: false
        },
        {
          id: 'workpapers',
          title: 'Customize workpaper templates',
          description: 'Choose or build structured workpaper sections',
          completed: false
        },
        {
          id: 'documents',
          title: 'Set up document templates',
          description: 'Engagement letters, tax letters, and client packs',
          completed: false
        },
        {
          id: 'portal',
          title: 'Activate client portal',
          description: 'Enable client uploads and status tracking',
          completed: false
        },
        {
          id: 'automation',
          title: 'Configure automation rules',
          description: 'Auto-create jobs and send reminders',
          completed: false
        }
      ],
      legal: [
        {
          id: 'matters',
          title: 'Set up matter types',
          description: 'Define practice areas and matter workflows',
          completed: false
        },
        {
          id: 'conflicts',
          title: 'Configure conflict checks',
          description: 'Set up relationship mapping and alerts',
          completed: false
        },
        {
          id: 'documents',
          title: 'Document automation setup',
          description: 'Letters, contracts, and court templates',
          completed: false
        },
        {
          id: 'trust',
          title: 'Trust accounting integration',
          description: 'Link trust accounts and configure rules',
          completed: false
        },
        {
          id: 'deadlines',
          title: 'Court date tracking',
          description: 'Set up deadline reminders and escalations',
          completed: false
        },
        {
          id: 'automation',
          title: 'Workflow automation',
          description: 'Auto-generate documents and approval routing',
          completed: false
        }
      ],
      finance: [
        {
          id: 'pipeline',
          title: 'Configure deal pipeline',
          description: 'Set up stages, probabilities, and workflows',
          completed: false
        },
        {
          id: 'borrowers',
          title: 'Borrower & guarantor setup',
          description: 'Create profiles and relationship tracking',
          completed: false
        },
        {
          id: 'assets',
          title: 'Asset register configuration',
          description: 'Set up security positions and valuations',
          completed: false
        },
        {
          id: 'credit',
          title: 'Credit memo templates',
          description: 'Build structured credit paper templates',
          completed: false
        },
        {
          id: 'covenants',
          title: 'Covenant tracking',
          description: 'Set up monitoring and breach alerts',
          completed: false
        },
        {
          id: 'automation',
          title: 'Deal automation',
          description: 'Auto-generate term sheets and reminders',
          completed: false
        }
      ]
    };

    return steps[vertical] || [];
  };

  const getCoreModules = (vertical: Vertical) => {
    const modules: Record<Vertical, VerticalFeature[]> = {
      accounting: [
        {
          title: 'Client Register',
          description: 'Clients, groups, entity relationships, ownership structures',
          icon: Users
        },
        {
          title: 'Recurring Jobs',
          description: 'Compliance calendar, lodgement tracking, auto-creation by entity type',
          icon: Calendar
        },
        {
          title: 'Workpapers',
          description: 'Structured sections, tick marks, year-on-year compare, variance notes',
          icon: FileText
        },
        {
          title: 'Document Packs',
          description: 'Merge letters, engagement letters, trust resolutions, dividend minutes',
          icon: Briefcase
        },
        {
          title: 'Time & WIP',
          description: 'Time tracking, WIP, write-offs, recoverability, utilization reports',
          icon: Clock
        },
        {
          title: 'Billing',
          description: 'Quote to invoice, subscription billing, payment links, aged debtors',
          icon: DollarSign
        }
      ],
      legal: [
        {
          title: 'Matter Register',
          description: 'Matter types, practice areas, matter lifecycle, file numbering',
          icon: Briefcase
        },
        {
          title: 'Conflict Checks',
          description: 'Relationship mapping, party search, conflict alerts, clearance workflow',
          icon: AlertTriangle
        },
        {
          title: 'Document Automation',
          description: 'Letters, contracts, court docs, version control, redline compare',
          icon: FileText
        },
        {
          title: 'Trust Accounting',
          description: 'Controlled money, trust receipts, disbursements, reconciliation',
          icon: Shield
        },
        {
          title: 'Time Recording',
          description: 'Time by matter and fee earner, billing rates, cost recovery',
          icon: Clock
        },
        {
          title: 'Deadline Tracking',
          description: 'Court dates, limitation periods, reminders, escalation to partner',
          icon: Calendar
        }
      ],
      finance: [
        {
          title: 'Deal Pipeline',
          description: 'Stages, probability, weighted forecast, origination to settlement',
          icon: Target
        },
        {
          title: 'Borrower Profiles',
          description: 'Borrowers, guarantors, directors, KYC, credit history',
          icon: Users
        },
        {
          title: 'Asset Register',
          description: 'Security positions, valuations, LVR tracking, cross-collateral',
          icon: Building2
        },
        {
          title: 'Credit Memos',
          description: 'Structured inputs, financial analysis, approval workflow, credit committee',
          icon: FileText
        },
        {
          title: 'Covenant Tracking',
          description: 'Financial covenants, reporting dates, breach alerts, waivers',
          icon: TrendingUp
        },
        {
          title: 'Investor Register',
          description: 'Investor allocations, distributions, statements, compliance reporting',
          icon: DollarSign
        }
      ]
    };

    return modules[vertical] || [];
  };

  const getAutomationFeatures = (vertical: Vertical) => {
    const automation: Record<Vertical, string[]> = {
      accounting: [
        'Auto create jobs based on entity type (e.g., company → ASIC Annual Review)',
        'Missing info reminders by email and SMS to clients',
        'Escalate overdue jobs to manager after SLA breach',
        'Auto build year-end pack from template when job complete',
        'Risk flags for missing docs or large variances',
        'Send engagement letter on job creation'
      ],
      legal: [
        'Auto create matter workflow by practice area',
        'Engagement letter and cost disclosure auto-draft',
        'Court deadline reminders and escalation to partner',
        'Auto bundle documents into court-ready PDF pack',
        'Approval routing for settlement offers over threshold',
        'Conflict check on every new matter'
      ],
      finance: [
        'Auto generate term sheet from deal record',
        'Compliance reminders for reporting dates',
        'Arrears alerts and escalation ladder',
        'Auto update investor statements monthly',
        'KYC checklist triggered on new borrower',
        'Covenant breach notifications to credit team'
      ]
    };

    return automation[vertical] || [];
  };

  const getAIFeatures = (vertical: Vertical) => {
    const ai: Record<Vertical, string[]> = {
      accounting: [
        'Draft client queries from workpaper gaps',
        'Summarise financials into plain language',
        'Highlight anomalies and margin drift',
        'Suggest advisory opportunities from financial trends',
        'Auto-complete variance explanations',
        'Predict lodgement delays based on client patterns'
      ],
      legal: [
        'Draft first pass contract clauses from template',
        'Summarise case notes into chronology',
        'Extract key dates and obligations from contracts',
        'Risk scan for unusual clauses',
        'Predict matter outcome based on similar cases',
        'Auto-generate time narrative from activity log'
      ],
      finance: [
        'Summarise borrower financials into executive summary',
        'Flag covenant breaches early with trend analysis',
        'Draft credit paper from structured inputs',
        'Compare current deal to prior deals',
        'Predict default risk from payment patterns',
        'Generate investor communications from deal data'
      ]
    };

    return ai[vertical] || [];
  };

  const renderVerticalSelection = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Choose Your Industry</h1>
        <p className="text-lg text-gray-600">
          Select your vertical to customize the platform for your practice
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {verticals.map((vertical) => {
          const Icon = vertical.icon;
          const isSelected = selectedVertical === vertical.id;
          
          return (
            <button
              key={vertical.id}
              onClick={() => setSelectedVertical(vertical.id)}
              className={`p-8 rounded-lg border-2 text-left transition-all hover:shadow-lg ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className={`w-16 h-16 rounded-lg ${
                vertical.id === 'accounting' ? 'bg-blue-100' :
                vertical.id === 'legal' ? 'bg-purple-100' :
                'bg-green-100'
              } flex items-center justify-center mb-4`}>
                <Icon className={`w-8 h-8 ${
                  vertical.id === 'accounting' ? 'text-blue-600' :
                  vertical.id === 'legal' ? 'text-purple-600' :
                  'text-green-600'
                }`} />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">{vertical.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{vertical.tagline}</p>
              
              <div className="space-y-2">
                {vertical.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      vertical.id === 'accounting' ? 'text-blue-600' :
                      vertical.id === 'legal' ? 'text-purple-600' :
                      'text-green-600'
                    }`} />
                    <span className="text-xs text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {isSelected && (
                <div className="mt-6 flex items-center justify-center gap-2 text-sm font-bold text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  Selected
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selectedVertical && (
        <div className="flex justify-center pt-6">
          <PrimaryButton onClick={() => setCurrentStep(2)}>
            <span>Continue with {verticals.find(v => v.id === selectedVertical)?.name}</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </PrimaryButton>
        </div>
      )}
    </div>
  );

  const renderOnboardingFlow = () => {
    if (!selectedVertical) return null;

    const steps = getOnboardingSteps(selectedVertical);
    const coreModules = getCoreModules(selectedVertical);
    const automationFeatures = getAutomationFeatures(selectedVertical);
    const aiFeatures = getAIFeatures(selectedVertical);
    const vertical = verticals.find(v => v.id === selectedVertical)!;
    const Icon = vertical.icon;

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className={`bg-gradient-to-r from-${vertical.color}-600 to-${vertical.color}-700 text-white rounded-lg p-6`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Icon className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{vertical.name}</h1>
              <p className={`text-${vertical.color}-100`}>{vertical.tagline}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-500"
                style={{ width: `${(completedSteps.size / steps.length) * 100}%` }}
              />
            </div>
            <span className="font-bold">
              {completedSteps.size} / {steps.length}
            </span>
          </div>
        </div>

        {/* Onboarding Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Setup Checklist</h2>
            
            {steps.map((step, idx) => {
              const isCompleted = completedSteps.has(step.id);
              
              return (
                <div
                  key={step.id}
                  className={`border-2 rounded-lg p-6 transition-all ${
                    isCompleted
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <span className="font-bold">{idx + 1}</span>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                      
                      {!isCompleted && (
                        <button
                          onClick={() => {
                            setCompletedSteps(new Set(completedSteps).add(step.id));
                            toast.success(`${step.title} completed!`);
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold"
                        >
                          Start Setup
                        </button>
                      )}
                      
                      {isCompleted && (
                        <div className="flex items-center gap-2 text-sm text-green-600 font-semibold">
                          <CheckCircle className="w-4 h-4" />
                          Completed
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Feature Overview */}
          <div className="space-y-6">
            <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">Core Modules</h3>
              <div className="space-y-3">
                {coreModules.map((module, idx) => {
                  const ModuleIcon = module.icon;
                  return (
                    <div key={idx} className="flex gap-3">
                      <ModuleIcon className={`w-5 h-5 text-${vertical.color}-600 mt-0.5 flex-shrink-0`} />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{module.title}</p>
                        <p className="text-xs text-gray-600">{module.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-orange-600" />
                <h3 className="font-bold text-gray-900">Automation</h3>
              </div>
              <div className="space-y-2">
                {automationFeatures.slice(0, 3).map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-orange-600 mt-2 flex-shrink-0" />
                    <p className="text-xs text-gray-700">{feature}</p>
                  </div>
                ))}
                <button className="text-xs text-orange-600 font-semibold hover:underline">
                  + {automationFeatures.length - 3} more
                </button>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-gray-900">AI Features</h3>
              </div>
              <div className="space-y-2">
                {aiFeatures.slice(0, 3).map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
                    <p className="text-xs text-gray-700">{feature}</p>
                  </div>
                ))}
                <button className="text-xs text-purple-600 font-semibold hover:underline">
                  + {aiFeatures.length - 3} more
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Complete Setup */}
        {completedSteps.size === steps.length && (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Setup Complete!</h2>
            <p className="text-gray-600 mb-6">
              Your {vertical.name} platform is ready. You can customize further in Settings.
            </p>
            <PrimaryButton onClick={() => onComplete?.()}>
              Go to Dashboard
            </PrimaryButton>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {currentStep === 1 && renderVerticalSelection()}
        {currentStep === 2 && renderOnboardingFlow()}
      </div>
    </div>
  );
}
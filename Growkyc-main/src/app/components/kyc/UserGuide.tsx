import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  BookOpen,
  Search,
  ChevronRight,
  ChevronDown,
  Play,
  FileText,
  Users,
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Video,
  HelpCircle,
  Star,
  Zap,
  Target,
  Settings,
  Bell,
  Eye,
  Lock,
  Home,
  XCircle
} from 'lucide-react';

interface GuideSection {
  id: string;
  title: string;
  icon: any;
  subsections: {
    id: string;
    title: string;
    content: React.ReactNode;
  }[];
}

export function UserGuide() {
  const [activeSection, setActiveSection] = useState<string>('getting-started');
  const [activeSubsection, setActiveSubsection] = useState<string>('welcome');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<string[]>(['getting-started']);

  const toggleSection = (sectionId: string) => {
    if (expandedSections.includes(sectionId)) {
      setExpandedSections(expandedSections.filter(id => id !== sectionId));
    } else {
      setExpandedSections([...expandedSections, sectionId]);
    }
  };

  const guideSections: GuideSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Home,
      subsections: [
        {
          id: 'welcome',
          title: 'Welcome to Grow KYC',
          content: (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white">
                <h1 className="text-4xl font-bold mb-4">Welcome to Grow KYC</h1>
                <p className="text-xl text-blue-100">
                  Your complete AUSTRAC-compliant AML/CTF compliance platform for accounting firms
                </p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                <h3 className="text-xl font-bold text-blue-300 mb-3">What is Grow KYC?</h3>
                <p className="text-blue-300 mb-4">
                  Grow KYC (Sentinel AML) is a comprehensive compliance platform designed specifically for 
                  Australian accounting firms providing designated services under AUSTRAC Tranche 2 regulations.
                </p>
                <div className="space-y-2">
                  {[
                    'Complete AML/CTF program management',
                    'Risk assessment and client onboarding',
                    'Personnel due diligence tracking',
                    'Ongoing monitoring and alerts',
                    'Suspicious matter reporting (SMR)',
                    'GreenID and InfoTrack integration',
                    'AUSTRAC audit preparation'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-blue-400 mr-2" />
                      <span className="text-blue-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Quick Start', icon: Zap, time: '10 min' },
                  { label: 'Video Tutorials', icon: Video, time: '5 videos' },
                  { label: 'Best Practices', icon: Star, time: '15 min' }
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={index}
                      className="bg-white rounded-lg border-2 border-white/10 p-4 hover:border-blue-500 hover:shadow-lg transition-all"
                    >
                      <Icon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <p className="font-bold text-slate-100">{item.label}</p>
                      <p className="text-sm text-slate-300">{item.time}</p>
                    </button>
                  );
                })}
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3 mt-0.5" />
                  <div>
                    <p className="font-semibold text-yellow-300 mb-1">Important First Steps</p>
                    <p className="text-sm text-yellow-300">
                      Before providing designated services, you must complete: Risk Assessment, 
                      Personnel Policy, Client Policy, and obtain Senior Manager approval.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        },
        {
          id: 'quick-start',
          title: 'Quick Start Guide',
          content: (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-100">Quick Start Guide</h2>
              <p className="text-slate-300">Follow these steps to get your AML/CTF program operational</p>

              <div className="space-y-4">
                {[
                  {
                    step: 1,
                    title: 'Complete Risk Assessment',
                    description: 'Define designated services, client types, delivery channels, risk factors, and country exposure',
                    duration: '30-45 minutes',
                    critical: true
                  },
                  {
                    step: 2,
                    title: 'Set Up Personnel Policy',
                    description: 'Appoint compliance officer, complete PDD, set up training tracker',
                    duration: '20-30 minutes',
                    critical: true
                  },
                  {
                    step: 3,
                    title: 'Configure Client Policy',
                    description: 'Set up CDD workflows, enhanced CDD requirements, and monitoring rules',
                    duration: '25-35 minutes',
                    critical: true
                  },
                  {
                    step: 4,
                    title: 'Establish Maintain Program',
                    description: 'Configure update triggers, effectiveness testing, and independent review schedule',
                    duration: '15-20 minutes',
                    critical: true
                  },
                  {
                    step: 5,
                    title: 'Obtain Senior Manager Approval',
                    description: 'Submit complete program for senior manager approval and sign-off',
                    duration: '5 minutes',
                    critical: true
                  },
                  {
                    step: 6,
                    title: 'Enrol with AUSTRAC',
                    description: 'Complete AUSTRAC enrolment and notify compliance officer appointment',
                    duration: '10-15 minutes',
                    critical: true
                  }
                ].map((item) => (
                  <div key={item.step} className={`border-l-4 rounded-r-lg p-6 ${
                    item.critical ? 'border-red-500 bg-red-500/10' : 'border-blue-500 bg-blue-500/10'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-lg">
                          {item.step}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-100">{item.title}</h3>
                          {item.critical && (
                            <span className="inline-block px-2 py-1 bg-red-500 text-white text-xs font-bold rounded mt-1">
                              CRITICAL
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Clock className="w-4 h-4" />
                        {item.duration}
                      </div>
                    </div>
                    <p className="text-slate-300">{item.description}</p>
                  </div>
                ))}
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-400 mr-3 mt-0.5" />
                  <div>
                    <p className="font-bold text-green-300 mb-2">Total Setup Time: 2-3 Hours</p>
                    <p className="text-sm text-green-300">
                      Once complete, you can begin onboarding clients and providing designated services. 
                      The system will enforce all compliance requirements automatically.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        },
        {
          id: 'system-overview',
          title: 'System Overview',
          content: (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-100">System Overview</h2>
              
              <div className="bg-white rounded-lg border border-white/10 p-6">
                <h3 className="text-xl font-bold text-slate-100 mb-4">Master Structure</h3>
                <p className="text-slate-300 mb-6">
                  The system follows the exact AUSTRAC-required structure:
                </p>
                
                <div className="space-y-4">
                  {[
                    {
                      number: 1,
                      title: 'Risk Assessment',
                      description: 'Define services, clients, channels, risk factors, and countries',
                      icon: Shield
                    },
                    {
                      number: 2,
                      title: 'Policy – Personnel',
                      description: 'Role register, PDD workflows, training tracker',
                      icon: Users
                    },
                    {
                      number: 3,
                      title: 'Policy – Clients',
                      description: 'Initial CDD, Enhanced CDD, Ongoing CDD, monitoring',
                      icon: FileText
                    },
                    {
                      number: 4,
                      title: 'Policy – Maintain Program',
                      description: 'Updates, effectiveness testing, independent reviews',
                      icon: Settings
                    },
                    {
                      number: 5,
                      title: 'Processes & Forms',
                      description: 'SMR/TTR/CBM reporting, tipping-off controls',
                      icon: AlertTriangle
                    },
                    {
                      number: 6,
                      title: 'Document & Approve Layer',
                      description: 'Senior manager approval, version control, audit trail',
                      icon: CheckCircle
                    }
                  ].map((module) => {
                    const Icon = module.icon;
                    return (
                      <div key={module.number} className="flex items-start gap-4 p-4 bg-white/5 rounded-lg">
                        <div className="w-12 h-12 bg-blue-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-100 mb-1">
                            {module.number}. {module.title}
                          </h4>
                          <p className="text-sm text-slate-300">{module.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                <h3 className="text-xl font-bold text-blue-300 mb-3">Key Integrations</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-bold text-slate-100 mb-2">GreenID</h4>
                    <p className="text-sm text-slate-300 mb-2">DVS-certified identity verification</p>
                    <ul className="text-xs text-slate-300 space-y-1">
                      <li>• Document verification</li>
                      <li>• AML/CTF screening</li>
                      <li>• PEP and sanctions checks</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-bold text-slate-100 mb-2">InfoTrack</h4>
                    <p className="text-sm text-slate-300 mb-2">Comprehensive verification services</p>
                    <ul className="text-xs text-slate-300 space-y-1">
                      <li>• ASIC company searches</li>
                      <li>• Property title searches</li>
                      <li>• Credit checks</li>
                      <li>• Bankruptcy searches</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      ]
    },
    {
      id: 'risk-assessment',
      title: 'Risk Assessment',
      icon: Shield,
      subsections: [
        {
          id: 'designated-services',
          title: 'Designated Services',
          content: (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-100">Designated Services Configuration</h2>
              
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3 mt-0.5" />
                  <div>
                    <p className="font-semibold text-yellow-300 mb-1">Critical Requirement</p>
                    <p className="text-sm text-yellow-300">
                      ALL rows must be completed with inherent risk rating, risk appetite (YES/NO), 
                      and mandatory control statement if NO. Cannot activate program without completion.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-white/10 p-6">
                <h3 className="text-xl font-bold text-slate-100 mb-4">How to Configure Designated Services</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-slate-100 mb-3">Step 1: Select Services</h4>
                    <p className="text-slate-300 mb-3">Review the 8 designated services:</p>
                    <ul className="space-y-2 text-sm text-slate-300">
                      {[
                        'Real estate transactions',
                        'Body corporate transactions',
                        'Holding or managing client property',
                        'Equity/debt financing',
                        'Shelf companies',
                        'Company/trust formation',
                        'Nominee positions',
                        'Registered office services'
                      ].map((service, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-100 mb-3">Step 2: Set Inherent Risk</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <p className="font-bold text-green-300">LOW</p>
                        <p className="text-xs text-green-300">Simple, transparent transactions</p>
                      </div>
                      <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <p className="font-bold text-yellow-300">MEDIUM</p>
                        <p className="text-xs text-yellow-300">Some complexity or risk factors</p>
                      </div>
                      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="font-bold text-red-300">HIGH</p>
                        <p className="text-xs text-red-300">Complex, high-value, or opaque</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-100 mb-3">Step 3: Set Risk Appetite</h4>
                    <div className="space-y-3">
                      <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <p className="font-bold text-green-300 mb-1">YES - Accept the Risk</p>
                        <p className="text-sm text-green-300">
                          Service is within risk appetite. Will provide this service with standard controls.
                        </p>
                      </div>
                      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="font-bold text-red-300 mb-1">NO - Do Not Accept</p>
                        <p className="text-sm text-red-300 mb-2">
                          Service is outside risk appetite. Must provide control statement explaining why.
                        </p>
                        <p className="text-xs text-red-400 font-semibold">
                          ⚠️ MANDATORY: Control statement required if NO selected
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-100 mb-3">Step 4: Document Control Statement</h4>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                      <p className="text-sm text-blue-300 mb-2">
                        <strong>Example Control Statements:</strong>
                      </p>
                      <ul className="text-sm text-blue-300 space-y-1">
                        <li>• "Not accepted unless exceptional circumstances with senior manager approval"</li>
                        <li>• "Requires enhanced CDD and source of funds verification"</li>
                        <li>• "Only accepted for existing clients with established history"</li>
                        <li>• "Requires quarterly monitoring and compliance officer oversight"</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-300 mb-1">System Validation</p>
                    <p className="text-sm text-green-300">
                      System will validate that all services are complete before allowing program activation. 
                      Missing inherent risk, risk appetite, or required control statements will block activation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        },
        {
          id: 'country-risk',
          title: 'Country Risk Module',
          content: (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-100">Country Risk Assessment</h2>

              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-red-400 mr-3 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-300 mb-1">Auto-Risk Logic</p>
                    <p className="text-sm text-red-300">
                      Countries with FATF listing OR DFAT sanctions are AUTOMATICALLY classified as HIGH risk. 
                      This cannot be overridden.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-white/10 p-6">
                <h3 className="text-xl font-bold text-slate-100 mb-4">Country Risk Inputs</h3>

                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-lg">
                    <h4 className="font-bold text-slate-100 mb-2">1. Basel AML Index Score</h4>
                    <p className="text-sm text-slate-300 mb-2">
                      Risk assessment score from Basel Institute (0-10 scale)
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="p-2 bg-green-500/15 rounded text-green-300">
                        <strong>≥ 6.0</strong> - Low Risk
                      </div>
                      <div className="p-2 bg-yellow-500/15 rounded text-yellow-300">
                        <strong>4.0-5.9</strong> - Medium Risk
                      </div>
                      <div className="p-2 bg-red-500/15 rounded text-red-300">
                        <strong>&lt; 4.0</strong> - High Risk
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-lg">
                    <h4 className="font-bold text-slate-100 mb-2">2. FATF Override</h4>
                    <p className="text-sm text-slate-300 mb-2">
                      Financial Action Task Force high-risk jurisdiction list
                    </p>
                    <div className="bg-red-500/10 border border-red-500/30 rounded p-3">
                      <p className="text-sm text-red-300 font-semibold">
                        ⚠️ If FATF listed → Automatic HIGH risk (cannot be overridden)
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-lg">
                    <h4 className="font-bold text-slate-100 mb-2">3. DFAT Sanctions Override</h4>
                    <p className="text-sm text-slate-300 mb-2">
                      Australian Department of Foreign Affairs and Trade sanctions list
                    </p>
                    <div className="bg-red-500/10 border border-red-500/30 rounded p-3">
                      <p className="text-sm text-red-300 font-semibold">
                        ⚠️ If DFAT sanctioned → Automatic HIGH risk (cannot be overridden)
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-lg">
                    <h4 className="font-bold text-slate-100 mb-2">4. Risk Appetite Per Country</h4>
                    <p className="text-sm text-slate-300 mb-3">
                      Define whether you will accept clients from each country
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-white rounded">
                        <span className="text-sm text-slate-100">Low risk countries</span>
                        <span className="px-2 py-1 bg-green-500/15 text-green-300 text-xs font-semibold rounded">
                          Usually YES
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white rounded">
                        <span className="text-sm text-slate-100">Medium risk countries</span>
                        <span className="px-2 py-1 bg-yellow-500/15 text-yellow-300 text-xs font-semibold rounded">
                          Case-by-case
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white rounded">
                        <span className="text-sm text-slate-100">High risk countries</span>
                        <span className="px-2 py-1 bg-red-500/15 text-red-300 text-xs font-semibold rounded">
                          Usually NO
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                <h3 className="font-bold text-blue-300 mb-3">Stress Test Example</h3>
                <div className="space-y-3">
                  <p className="text-sm text-blue-300">
                    <strong>Test Scenario:</strong> What happens if a client becomes resident in a high-risk country tomorrow?
                  </p>
                  <div className="bg-white rounded p-3">
                    <p className="text-sm text-slate-100 mb-2"><strong>System Response:</strong></p>
                    <ul className="text-sm text-slate-300 space-y-1">
                      <li>✓ Monitoring detects jurisdiction change</li>
                      <li>✓ Risk automatically recalculates to HIGH</li>
                      <li>✓ Alert created for compliance officer</li>
                      <li>✓ Enhanced CDD triggered</li>
                      <li>✓ Engagement may be restricted pending review</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      ]
    },
    {
      id: 'client-onboarding',
      title: 'Client Onboarding',
      icon: Users,
      subsections: [
        {
          id: 'cdd-workflow',
          title: 'CDD Workflow',
          content: (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-100">Customer Due Diligence (CDD) Workflow</h2>

              <div className="bg-red-500/10 border-2 border-red-500/30 rounded-lg p-4">
                <div className="flex items-start">
                  <Lock className="w-6 h-6 text-red-400 mr-3 mt-0.5" />
                  <div>
                    <p className="font-bold text-red-300 mb-1">HARD GATE: Cannot Start Service Before CDD Complete</p>
                    <p className="text-sm text-red-300">
                      System will block all designated services until CDD is complete and approved. 
                      This is non-negotiable and cannot be bypassed.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-white/10 p-6">
                <h3 className="text-xl font-bold text-slate-100 mb-4">7-Step CDD Process</h3>

                <div className="space-y-4">
                  {[
                    {
                      step: 1,
                      title: 'Select Client Type',
                      description: 'Individual, Company, Trust, Partnership, or Government Body',
                      time: '1 min'
                    },
                    {
                      step: 2,
                      title: 'Enter Basic Details',
                      description: 'Name, address, contact details, ABN/ACN (if applicable)',
                      time: '3-5 min'
                    },
                    {
                      step: 3,
                      title: 'Build Beneficial Ownership Graph',
                      description: 'Identify all owners >25% or with control rights. Visual tree builder.',
                      time: '5-10 min',
                      critical: true
                    },
                    {
                      step: 4,
                      title: 'Identity Verification',
                      description: 'GreenID or InfoTrack verification. DVS-certified document checks.',
                      time: '2-5 min',
                      critical: true
                    },
                    {
                      step: 5,
                      title: 'Screening (Sanctions/PEP/Adverse Media)',
                      description: 'Automated screening against sanctions lists, PEP databases, adverse media',
                      time: 'Automatic',
                      critical: true
                    },
                    {
                      step: 6,
                      title: 'Auto Risk Rating',
                      description: 'System calculates risk based on factors. May trigger Enhanced CDD.',
                      time: 'Automatic',
                      critical: true
                    },
                    {
                      step: 7,
                      title: 'Approval & Activation',
                      description: 'High-risk requires senior manager approval. Otherwise auto-approved.',
                      time: '1-2 min'
                    }
                  ].map((item) => (
                    <div key={item.step} className={`p-4 border-l-4 rounded-r-lg ${
                      item.critical ? 'border-red-500 bg-red-500/10' : 'border-blue-500 bg-blue-500/10'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold">
                            {item.step}
                          </div>
                          <h4 className="font-bold text-slate-100">{item.title}</h4>
                          {item.critical && (
                            <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                              CRITICAL
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-300 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {item.time}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300 ml-11">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
                <h3 className="font-bold text-yellow-300 mb-3">Delayed CDD Logic</h3>
                <p className="text-sm text-yellow-300 mb-3">
                  In limited circumstances, CDD may be delayed. If delay permitted:
                </p>
                <ul className="text-sm text-yellow-300 space-y-1">
                  <li>• All documents marked "UNVERIFIED CLIENT"</li>
                  <li>• Cannot deal with client funds</li>
                  <li>• Countdown timer set</li>
                  <li>• Auto-lock if not completed in timeframe</li>
                </ul>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <h3 className="font-bold text-green-300 mb-2">Total CDD Time</h3>
                <p className="text-sm text-green-300">
                  <strong>Standard client:</strong> 15-25 minutes
                  <br />
                  <strong>Complex trust:</strong> 30-45 minutes
                  <br />
                  <strong>High-risk with Enhanced CDD:</strong> 45-60 minutes
                </p>
              </div>
            </div>
          )
        },
        {
          id: 'greenid-infotrack',
          title: 'GreenID & InfoTrack',
          content: (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-100">Identity Verification Services</h2>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg p-6 text-white">
                  <h3 className="text-2xl font-bold mb-4">GreenID</h3>
                  <p className="text-green-100 mb-4">DVS-Certified Identity Verification</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Document Verification Service
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      AML/CTF Screening
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      PEP & Sanctions Checks
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      98%+ Confidence Scores
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
                  <h3 className="text-2xl font-bold mb-4">InfoTrack</h3>
                  <p className="text-blue-100 mb-4">Comprehensive Verification</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Credit Checks & Scoring
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      ASIC Company Searches
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Property Title Searches
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Bankruptcy & Court Records
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-white/10 p-6">
                <h3 className="text-xl font-bold text-slate-100 mb-4">When to Use Each Service</h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <h4 className="font-bold text-green-300 mb-2">Use GreenID For:</h4>
                    <ul className="text-sm text-green-300 space-y-1">
                      <li>• Individual identity verification (primary method)</li>
                      <li>• Driver's license and passport verification</li>
                      <li>• Real-time DVS checks</li>
                      <li>• Fast turnaround (seconds)</li>
                      <li>• Standard CDD requirements</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <h4 className="font-bold text-blue-300 mb-2">Use InfoTrack For:</h4>
                    <ul className="text-sm text-blue-300 space-y-1">
                      <li>• Company and trust verification</li>
                      <li>• ASIC company extracts and director searches</li>
                      <li>• Property title verification</li>
                      <li>• Credit history and bankruptcy checks</li>
                      <li>• Enhanced CDD requirements</li>
                      <li>• Comprehensive background checks</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                <h3 className="font-bold text-blue-300 mb-3">Integration Workflow</h3>
                <div className="space-y-3">
                  {[
                    { step: 1, text: 'Client enters personal details in onboarding form' },
                    { step: 2, text: 'Click "Start GreenID Verification" or "Use InfoTrack"' },
                    { step: 3, text: 'Service runs verification in real-time (5-30 seconds)' },
                    { step: 4, text: 'Results automatically populate in client file' },
                    { step: 5, text: 'Confidence scores and verification status recorded' },
                    { step: 6, text: 'Evidence stored in Evidence Vault with SHA-256 hash' }
                  ].map((item) => (
                    <div key={item.step} className="flex items-start">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold mr-3 mt-0.5">
                        {item.step}
                      </div>
                      <p className="text-sm text-blue-300">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        }
      ]
    },
    {
      id: 'monitoring',
      title: 'Monitoring & Alerts',
      icon: Bell,
      subsections: [
        {
          id: 'ongoing-monitoring',
          title: 'Ongoing Monitoring',
          content: (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-100">Ongoing Customer Due Diligence (OCDD)</h2>

              <div className="bg-white rounded-lg border border-white/10 p-6">
                <h3 className="text-xl font-bold text-slate-100 mb-4">What is Monitored?</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { title: 'Ownership Changes', description: 'Beneficial owner additions or changes >25%', icon: Users },
                    { title: 'PEP Status Changes', description: 'New PEP appointments or changes', icon: Shield },
                    { title: 'Sanctions Updates', description: 'New sanctions list matches', icon: Lock },
                    { title: 'Unusual Behaviour', description: 'Transaction patterns or activity changes', icon: AlertTriangle },
                    { title: 'ID Expiry', description: 'Document expiration dates', icon: Clock },
                    { title: 'Address Changes', description: 'Jurisdiction and location updates', icon: Target }
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <Icon className="w-6 h-6 text-blue-400 mb-2" />
                        <h4 className="font-bold text-slate-100 mb-1">{item.title}</h4>
                        <p className="text-sm text-slate-300">{item.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-lg border border-white/10 p-6">
                <h3 className="text-xl font-bold text-slate-100 mb-4">Review Cycles</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <div>
                      <p className="font-bold text-red-300">High Risk Clients</p>
                      <p className="text-sm text-red-300">Full review required</p>
                    </div>
                    <span className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg">
                      12 months
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <div>
                      <p className="font-bold text-yellow-300">Medium Risk Clients</p>
                      <p className="text-sm text-yellow-300">Standard review required</p>
                    </div>
                    <span className="px-4 py-2 bg-yellow-600 text-white font-bold rounded-lg">
                      2 years
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div>
                      <p className="font-bold text-green-300">Low Risk Clients</p>
                      <p className="text-sm text-green-300">Light-touch review required</p>
                    </div>
                    <span className="px-4 py-2 bg-green-600 text-white font-bold rounded-lg">
                      3 years
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3 mt-0.5" />
                  <div>
                    <p className="font-semibold text-yellow-300 mb-1">Overdue Review Blocking</p>
                    <p className="text-sm text-yellow-300">
                      System will block new designated services if review is overdue AND doubts exist about client. 
                      Reviews must be completed to continue servicing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        },
        {
          id: 'alert-management',
          title: 'Alert Management',
          content: (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-100">Managing Monitoring Alerts</h2>

              <div className="bg-white rounded-lg border border-white/10 p-6">
                <h3 className="text-xl font-bold text-slate-100 mb-4">Alert Types & Severity</h3>

                <div className="space-y-3">
                  {[
                    {
                      severity: 'CRITICAL',
                      color: 'red',
                      examples: ['Sanctions match', 'FATF country', 'Terrorism financing'],
                      action: 'Immediate compliance officer review. May require SMR.'
                    },
                    {
                      severity: 'HIGH',
                      color: 'orange',
                      examples: ['PEP status change', 'Adverse media', 'Complex ownership change'],
                      action: 'Review within 24 hours. Enhanced CDD may be required.'
                    },
                    {
                      severity: 'MEDIUM',
                      color: 'yellow',
                      examples: ['Ownership change', 'High-value transaction', 'Address change'],
                      action: 'Review within 3 business days. Update client file.'
                    },
                    {
                      severity: 'LOW',
                      color: 'blue',
                      examples: ['ID nearing expiry', 'Contact detail change', 'Review due'],
                      action: 'Review within 7 days. Routine update.'
                    }
                  ].map((item) => (
                    <div key={item.severity} className={`p-4 bg-${item.color}-50 border border-${item.color}-200 rounded-lg`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-3 py-1 bg-${item.color}-500 text-white font-bold rounded text-sm`}>
                          {item.severity}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300 mb-2">
                        <strong>Examples:</strong> {item.examples.join(', ')}
                      </p>
                      <p className="text-sm text-slate-300">
                        <strong>Action:</strong> {item.action}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg border border-white/10 p-6">
                <h3 className="text-xl font-bold text-slate-100 mb-4">Alert Actions</h3>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      action: 'Close as False Positive',
                      description: 'Alert was triggered in error. Document reasoning.',
                      icon: XCircle,
                      color: 'green'
                    },
                    {
                      action: 'Escalate to Case',
                      description: 'Requires investigation. Create formal case.',
                      icon: AlertTriangle,
                      color: 'red'
                    },
                    {
                      action: 'Restrict Client',
                      description: 'Temporarily suspend services pending review.',
                      icon: Lock,
                      color: 'orange'
                    },
                    {
                      action: 'Request Information',
                      description: 'Contact client for additional details.',
                      icon: FileText,
                      color: 'blue'
                    }
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.action} className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <Icon className={`w-6 h-6 text-${item.color}-600 mb-2`} />
                        <h4 className="font-bold text-slate-100 mb-1">{item.action}</h4>
                        <p className="text-xs text-slate-300">{item.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                <h3 className="font-bold text-blue-300 mb-3">Best Practices</h3>
                <ul className="text-sm text-blue-300 space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Review alerts within severity timeframes</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Document ALL alert resolutions with detailed reasoning</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Escalate to compliance officer if uncertain</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Never ignore critical or high-severity alerts</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Track time to resolution for effectiveness testing</span>
                  </li>
                </ul>
              </div>
            </div>
          )
        }
      ]
    },
    {
      id: 'reporting',
      title: 'Reporting',
      icon: FileText,
      subsections: [
        {
          id: 'smr',
          title: 'Suspicious Matter Reports',
          content: (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-100">Suspicious Matter Reporting (SMR)</h2>

              <div className="bg-red-500/10 border-2 border-red-500/30 rounded-lg p-6">
                <div className="flex items-start">
                  <Lock className="w-6 h-6 text-red-400 mr-3 mt-0.5" />
                  <div>
                    <p className="font-bold text-red-300 mb-2">RESTRICTED ACCESS - TIPPING OFF CONTROLS</p>
                    <p className="text-sm text-red-300">
                      SMR module has restricted visibility. Only Compliance Officer, Senior Manager, and 
                      Governing Body can view SMRs. Operational staff CANNOT see SMR existence to prevent tipping off.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-white/10 p-6">
                <h3 className="text-xl font-bold text-slate-100 mb-4">SMR Timers</h3>
                
                <div className="space-y-3">
                  <div className="p-4 bg-red-500/10 border-2 border-red-500/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-red-300">Terrorism Financing</h4>
                      <span className="px-3 py-1 bg-red-600 text-white font-bold rounded">24 HOURS</span>
                    </div>
                    <p className="text-sm text-red-300">
                      Must be reported to AUSTRAC immediately or within 24 hours if discovered outside business hours
                    </p>
                  </div>

                  <div className="p-4 bg-orange-500/10 border-2 border-orange-500/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-orange-300">All Other Suspicious Matters</h4>
                      <span className="px-3 py-1 bg-orange-600 text-white font-bold rounded">3 BUSINESS DAYS</span>
                    </div>
                    <p className="text-sm text-orange-300">
                      Must be reported within 3 business days after forming suspicion
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-white/10 p-6">
                <h3 className="text-xl font-bold text-slate-100 mb-4">SMR Decision Process</h3>

                <div className="space-y-3">
                  {[
                    { step: 1, title: 'Detect Suspicious Activity', description: 'Alert, transaction pattern, or staff observation' },
                    { step: 2, title: 'Escalate to Compliance Officer', description: 'Create restricted case with full details' },
                    { step: 3, title: 'Compliance Officer Assessment', description: 'Review evidence, conduct analysis, make decision' },
                    { step: 4, title: 'Notify Senior Manager/Governing Body', description: 'Inform decision makers (restricted communication)' },
                    { step: 5, title: 'Prepare SMR', description: 'Complete AUSTRAC Online form with all details' },
                    { step: 6, title: 'Submit to AUSTRAC', description: 'Submit via AUSTRAC Online within timeframe' },
                    { step: 7, title: 'Record Submission', description: 'Store confirmation and evidence in restricted vault' }
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                      <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-100">{item.title}</h4>
                        <p className="text-sm text-slate-300">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3 mt-0.5" />
                  <div>
                    <p className="font-semibold text-yellow-300 mb-1">Tipping Off Offence</p>
                    <p className="text-sm text-yellow-300">
                      It is a criminal offence to inform a client or any person that an SMR has been or may be submitted. 
                      All SMR activity must remain strictly confidential. System enforces this through restricted access.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                <h3 className="font-bold text-blue-300 mb-3">What Makes Something Suspicious?</h3>
                <ul className="text-sm text-blue-300 space-y-2">
                  <li>• Transactions inconsistent with client's known legitimate business or personal activities</li>
                  <li>• Unnecessarily complex or structured transactions</li>
                  <li>• Transactions involving high-risk jurisdictions</li>
                  <li>• Client refuses to provide information or documentation</li>
                  <li>• Transactions with no apparent economic purpose</li>
                  <li>• Attempts to avoid reporting thresholds</li>
                  <li>• Unusual sources of funds or wealth</li>
                  <li>• Connections to known criminal activity</li>
                </ul>
              </div>
            </div>
          )
        }
      ]
    },
    {
      id: 'testing',
      title: 'Testing & Audit',
      icon: Target,
      subsections: [
        {
          id: 'austrac-review',
          title: 'AUSTRAC Review Testing',
          content: (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-100">AUSTRAC Review Testing</h2>

              <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-lg p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Test Your System Before AUSTRAC Does</h3>
                <p className="text-red-100">
                  90+ compliance checks, stress tests, and red team attack scenarios to validate your AML/CTF program
                </p>
              </div>

              <div className="bg-white rounded-lg border border-white/10 p-6">
                <h3 className="text-xl font-bold text-slate-100 mb-4">Three Key Tests</h3>

                <div className="space-y-3">
                  <div className="p-4 border-l-4 border-blue-600 bg-blue-500/10 rounded-r-lg">
                    <h4 className="font-bold text-blue-300 mb-1">1. Do you understand your risk?</h4>
                    <p className="text-sm text-blue-300">
                      Risk assessment specificity, rationale documentation, appetite alignment
                    </p>
                  </div>

                  <div className="p-4 border-l-4 border-purple-600 bg-purple-500/10 rounded-r-lg">
                    <h4 className="font-bold text-purple-300 mb-1">2. Do you follow your own rules?</h4>
                    <p className="text-sm text-purple-300">
                      Operational compliance, hard gate enforcement, escalation discipline
                    </p>
                  </div>

                  <div className="p-4 border-l-4 border-green-600 bg-green-500/10 rounded-r-lg">
                    <h4 className="font-bold text-green-300 mb-1">3. Can you prove it?</h4>
                    <p className="text-sm text-green-300">
                      Evidence completeness, audit trails, decision documentation, 7-year retention
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-white/10 p-6">
                <h3 className="text-xl font-bold text-slate-100 mb-4">How to Run Tests</h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-100 mb-2">Step 1: Compliance Checklist</h4>
                    <p className="text-sm text-slate-300 mb-2">
                      Review 90+ compliance items across 8 categories. Mark each as complete with evidence.
                    </p>
                    <p className="text-xs text-slate-400">
                      Categories: Governance, Risk Assessment, Personnel, Client CDD, Monitoring, Reporting, 
                      Record Keeping, Program Maintenance
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-100 mb-2">Step 2: Stress Tests</h4>
                    <p className="text-sm text-slate-300 mb-2">
                      Run specific tests on critical items. Examples:
                    </p>
                    <ul className="text-xs text-slate-300 space-y-1">
                      <li>• "Ask random staff: Who is the AML/CTF compliance officer?"</li>
                      <li>• "Attempt to onboard client from prohibited country - System must block"</li>
                      <li>• "Attempt to delete CDD record - System must block for 7 years"</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-100 mb-2">Step 3: Readiness Scoring</h4>
                    <p className="text-sm text-slate-300 mb-2">
                      Calculate scores (1-5) for five key areas:
                    </p>
                    <ul className="text-xs text-slate-300 space-y-1">
                      <li>• Governance Strength</li>
                      <li>• Risk Clarity</li>
                      <li>• Operational Discipline</li>
                      <li>• Monitoring Responsiveness</li>
                      <li>• Documentation Quality</li>
                    </ul>
                    <p className="text-xs text-red-400 mt-2 font-semibold">
                      ⚠️ Score below 4.0 in any area = Material Weakness
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-100 mb-2">Step 4: Generate Report</h4>
                    <p className="text-sm text-slate-300">
                      Download complete readiness report with findings, gaps, and recommendations
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                <h3 className="font-bold text-blue-300 mb-3">Pass Criteria</h3>
                <p className="text-sm text-blue-300 mb-3">
                  You pass comfortably if:
                </p>
                <ul className="text-sm text-blue-300 space-y-1">
                  {[
                    'Every file shows structured workflow',
                    'Risk rationale is specific',
                    'Approvals are timestamped',
                    'Monitoring alerts have outcomes',
                    'System enforces hard gates',
                    'All critical items complete (100%)',
                    'All readiness scores ≥ 4.0'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        },
        {
          id: 'simulated-audit',
          title: 'Simulated AUSTRAC Audit',
          content: (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-100">Simulated AUSTRAC Audit</h2>

              <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-lg p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">6-Stage Audit + 10 Red Team Attacks</h3>
                <p className="text-red-100">
                  Experience a realistic AUSTRAC audit including desk review, sample testing, and adversarial attacks
                </p>
              </div>

              <div className="bg-white rounded-lg border border-white/10 p-6">
                <h3 className="text-xl font-bold text-slate-100 mb-4">Audit Stages</h3>

                <div className="space-y-3">
                  {[
                    {
                      stage: 1,
                      title: 'Desk Review',
                      description: 'Generate 10 required documents in under 1 hour',
                      target: '< 60 minutes',
                      critical: true
                    },
                    {
                      stage: 2,
                      title: 'Sample Testing',
                      description: 'Test 12 client files (5 low, 3 medium, 2 high, 1 PEP, 1 trust)',
                      target: 'All files complete',
                      critical: true
                    },
                    {
                      stage: 3,
                      title: 'High-Risk Deep Dive',
                      description: 'Detailed examination of 1 high-risk client',
                      target: 'Source of funds/wealth documented',
                      critical: true
                    },
                    {
                      stage: 4,
                      title: 'Personnel Test',
                      description: 'Compliance officer PDD and knowledge interview',
                      target: 'Complete file + pass interview',
                      critical: true
                    },
                    {
                      stage: 5,
                      title: 'Effectiveness Review',
                      description: 'Internal testing validation',
                      target: 'Documented review with actions',
                      critical: false
                    },
                    {
                      stage: 6,
                      title: 'Red Team Attacks',
                      description: '10 attack scenarios to break your system',
                      target: 'Block all attacks',
                      critical: true
                    }
                  ].map((item) => (
                    <div key={item.stage} className={`p-4 border-l-4 rounded-r-lg ${
                      item.critical ? 'border-red-500 bg-red-500/10' : 'border-blue-500 bg-blue-500/10'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-slate-100">Stage {item.stage}: {item.title}</h4>
                        {item.critical && (
                          <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                            CRITICAL
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-300 mb-1">{item.description}</p>
                      <p className="text-xs text-slate-300">
                        <strong>Target:</strong> {item.target}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg border border-white/10 p-6">
                <h3 className="text-xl font-bold text-slate-100 mb-4">Red Team Attack Examples</h3>

                <div className="space-y-2">
                  {[
                    'Shell Company Layering - Hide beneficial owner under 25%',
                    'Foreign PEP Disguised as Relative - Close associate detection',
                    'Source of Funds Fake - Upstream entity verification',
                    'Sanctions Near Match (85%) - Override controls',
                    'Staff Collusion - Alert suppression attempts',
                    'Expiring ID - Ongoing CDD weakness',
                    'High Risk Jurisdiction Shift - Dynamic risk recalculation',
                    'SMR Tipping Off - Access control and segregation',
                    'Program Change Not Re-Approved - Governance breakdown',
                    'Independent Review Surface Test - Operational evidence'
                  ].map((attack, index) => (
                    <div key={index} className="flex items-start p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <Zap className="w-4 h-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-red-300">{attack}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <h3 className="font-bold text-green-300 mb-2">Pass Criteria</h3>
                <p className="text-sm text-green-300">
                  System is regulator-resilient if it withstands:
                </p>
                <ul className="text-sm text-green-300 space-y-1 mt-2">
                  <li>✓ All 6 audit stages passed</li>
                  <li>✓ Desk review &lt; 1 hour</li>
                  <li>✓ All sample files complete</li>
                  <li>✓ All 10 red team attacks blocked</li>
                  <li>✓ No critical failures</li>
                </ul>
              </div>
            </div>
          )
        }
      ]
    },
    {
      id: 'faqs',
      title: 'FAQs',
      icon: HelpCircle,
      subsections: [
        {
          id: 'common-questions',
          title: 'Common Questions',
          content: (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-100">Frequently Asked Questions</h2>

              <div className="space-y-4">
                {[
                  {
                    q: 'How long does initial setup take?',
                    a: 'Complete program setup takes 2-3 hours. This includes Risk Assessment (30-45 min), Personnel Policy (20-30 min), Client Policy (25-35 min), Maintain Program (15-20 min), and Senior Manager approval.'
                  },
                  {
                    q: 'Can I provide designated services before completing setup?',
                    a: 'NO. System enforces a hard gate - you cannot provide designated services until Risk Assessment, Personnel Policy, Client Policy, and Maintain Program are complete AND approved by Senior Manager.'
                  },
                  {
                    q: 'What happens if I select "NO" for a designated service?',
                    a: 'You must provide a control statement explaining why that service is outside your risk appetite. System will not allow activation without this mandatory statement.'
                  },
                  {
                    q: 'How often do high-risk clients need to be reviewed?',
                    a: 'High-risk clients must be reviewed at least annually (12 months). System will flag overdue reviews and may block new services if review is overdue and doubts exist.'
                  },
                  {
                    q: 'Who can view SMRs in the system?',
                    a: 'Only Compliance Officer, Senior Manager, and Governing Body can view SMRs. Operational staff cannot see SMR existence to prevent tipping off. This is enforced by system access controls.'
                  },
                  {
                    q: 'What is the difference between GreenID and InfoTrack?',
                    a: 'GreenID is for individual identity verification (DVS-certified, real-time). InfoTrack is for comprehensive checks including company searches, credit checks, property titles, and bankruptcy searches. Use GreenID for individuals, InfoTrack for companies and enhanced CDD.'
                  },
                  {
                    q: 'How long are records retained?',
                    a: 'CDD records: 7 years after client relationship ends. Personnel PDD: 7 years after role ends. Transaction records: 7 years. Program versions: 7 years. System enforces these retention periods automatically.'
                  },
                  {
                    q: 'What triggers an SMR?',
                    a: 'Transactions inconsistent with known business, unnecessarily complex structures, high-risk jurisdictions, refusal to provide information, no apparent economic purpose, threshold avoidance, unusual sources of funds/wealth, or connections to criminal activity.'
                  },
                  {
                    q: 'Can I delete client records?',
                    a: 'NO. System blocks deletion of CDD records for 7 years after relationship ends. This is a regulatory requirement and cannot be overridden.'
                  },
                  {
                    q: 'What if a client becomes a resident of a high-risk country?',
                    a: 'System automatically detects jurisdiction changes through ongoing monitoring. Risk will recalculate to HIGH, alert created for compliance officer, Enhanced CDD triggered, and engagement may be restricted pending review.'
                  }
                ].map((faq, index) => (
                  <div key={index} className="bg-white rounded-lg border border-white/10 p-6">
                    <h4 className="font-bold text-slate-100 mb-2 flex items-start">
                      <HelpCircle className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                      {faq.q}
                    </h4>
                    <p className="text-slate-300 ml-7">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        }
      ]
    }
  ];

  const currentSection = guideSections.find(s => s.id === activeSection);
  const currentSubsection = currentSection?.subsections.find(s => s.id === activeSubsection);

  return (
    <div className="flex h-screen bg-white/5">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl font-bold text-slate-100">User Guide</h1>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {guideSections.map((section) => {
              const Icon = section.icon;
              const isExpanded = expandedSections.includes(section.id);
              const isActive = activeSection === section.id;

              return (
                <div key={section.id}>
                  <button
                    onClick={() => toggleSection(section.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      isActive ? 'bg-blue-500/10 text-blue-300' : 'hover:bg-white/5 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5" />
                      <span className="font-semibold">{section.title}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="ml-4 mt-1 space-y-1">
                      {section.subsections.map((subsection) => (
                        <button
                          key={subsection.id}
                          onClick={() => {
                            setActiveSection(section.id);
                            setActiveSubsection(subsection.id);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            activeSubsection === subsection.id && isActive
                              ? 'bg-blue-500/15 text-blue-300 font-semibold'
                              : 'hover:bg-white/5 text-slate-300'
                          }`}
                        >
                          {subsection.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-white/10 bg-blue-500/10">
          <p className="text-sm text-blue-300 mb-2">
            <strong>Need Help?</strong>
          </p>
          <p className="text-xs text-blue-300">
            Contact support or visit documentation for additional assistance
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          {currentSubsection?.content}
        </div>
      </div>
    </div>
  );
}

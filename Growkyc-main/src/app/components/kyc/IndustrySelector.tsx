import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Building2,
  Scale,
  Calculator,
  Home,
  Shield,
  CheckCircle,
  ArrowRight,
  Users,
  FileText,
  TrendingUp,
  AlertTriangle,
  X
} from 'lucide-react';

export type Industry = 'finance' | 'legal' | 'accounting' | 'real_estate';

interface IndustryConfig {
  id: Industry;
  name: string;
  icon: any;
  tagline: string;
  description: string;
  color: string;
  gradient: string;
  regulations: string[];
  features: string[];
  primaryCompliance: string;
  stats: {
    clients: string;
    cases: string;
    compliance: string;
  };
}

const industryConfigs: IndustryConfig[] = [
  {
    id: 'finance',
    name: 'Financial Services',
    icon: Building2,
    tagline: 'AUSTRAC AML/CTF & Responsible Lending',
    description: 'Complete compliance solution for banks, lenders, and financial institutions',
    color: 'blue',
    gradient: 'from-blue-600 to-indigo-600',
    regulations: [
      'AUSTRAC Tranche 2 AML/CTF',
      'NCCP Responsible Lending',
      'ASIC Reportable Situations',
      'Privacy Act Compliance'
    ],
    features: [
      'Customer Due Diligence (CDD)',
      'Credit Assessment & Verification',
      'Loan Origination Compliance',
      'Ongoing Monitoring & Alerts',
      'Suspicious Matter Reporting (SMR)',
      'GreenID & InfoTrack Integration'
    ],
    primaryCompliance: 'AUSTRAC',
    stats: {
      clients: '1,247',
      cases: '34',
      compliance: '98%'
    }
  },
  {
    id: 'legal',
    name: 'Legal Practice',
    icon: Scale,
    tagline: 'Trust Accounting & Client Verification',
    description: 'Compliance system for law firms and legal practitioners',
    color: 'purple',
    gradient: 'from-purple-600 to-pink-600',
    regulations: [
      'Legal Profession Rules',
      'Trust Account Regulations',
      'AML/CTF for Conveyancing',
      'Client Identity Verification',
      'Conflict of Interest Management'
    ],
    features: [
      'Client Acceptance & Conflicts',
      'Matter Risk Assessment',
      'Trust Account Compliance',
      'Legal Privilege Protection',
      'Source of Funds Verification',
      'Beneficial Owner Identification'
    ],
    primaryCompliance: 'Law Society',
    stats: {
      clients: '856',
      cases: '23',
      compliance: '97%'
    }
  },
  {
    id: 'accounting',
    name: 'Accounting Firms',
    icon: Calculator,
    tagline: 'Tax Agent AML/CTF & Client Acceptance',
    description: 'AUSTRAC compliance for tax agents and accounting practices',
    color: 'green',
    gradient: 'from-green-600 to-emerald-600',
    regulations: [
      'AUSTRAC Designated Services',
      'Tax Practitioners Board',
      'Professional Independence',
      'Client Acceptance Standards',
      'Quality Control Systems'
    ],
    features: [
      'Tax Agent AML/CTF Program',
      'Client Risk Assessment',
      'Independence Verification',
      'Engagement Letter Management',
      'Quality Review System',
      'Professional Standards Compliance'
    ],
    primaryCompliance: 'AUSTRAC & TPB',
    stats: {
      clients: '2,341',
      cases: '12',
      compliance: '99%'
    }
  },
  {
    id: 'real_estate',
    name: 'Real Estate Agents',
    icon: Home,
    tagline: 'Property Settlement & Trust Account',
    description: 'Compliance platform for real estate agencies and property professionals',
    color: 'orange',
    gradient: 'from-orange-600 to-red-600',
    regulations: [
      'Real Estate Licensing',
      'Trust Account Requirements',
      'Vendor/Purchaser Verification',
      'Settlement Compliance',
      'Consumer Protection Laws'
    ],
    features: [
      'Vendor ID Verification',
      'Purchaser Due Diligence',
      'Trust Account Monitoring',
      'Settlement Workflow',
      'Commission Tracking',
      'Property Title Verification'
    ],
    primaryCompliance: 'Fair Trading',
    stats: {
      clients: '634',
      cases: '45',
      compliance: '96%'
    }
  }
];

interface IndustrySelectorProps {
  onSelectIndustry: (industry: Industry) => void;
  onClose?: () => void;
}

export function IndustrySelector({ onSelectIndustry, onClose }: IndustrySelectorProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleSelect = (industry: Industry) => {
    setSelectedIndustry(industry);
    setShowDetails(true);
  };

  const handleConfirm = () => {
    if (selectedIndustry) {
      onSelectIndustry(selectedIndustry);
    }
  };

  const selectedConfig = selectedIndustry ? industryConfigs.find(c => c.id === selectedIndustry) : null;

  if (showDetails && selectedConfig) {
    const Icon = selectedConfig.icon;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" onClick={() => setShowDetails(false)}>
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
              Back to Industry Selection
            </Button>
            {onClose && (
              <Button variant="ghost" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Industry Header */}
          <div className={`bg-gradient-to-r ${selectedConfig.gradient} rounded-2xl p-8 text-white mb-8`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center">
                  <Icon className="w-12 h-12" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">{selectedConfig.name}</h1>
                  <p className="text-xl opacity-90">{selectedConfig.tagline}</p>
                </div>
              </div>
              <CheckCircle className="w-12 h-12" />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg border border-white/10 p-6 text-center">
              <Users className={`w-10 h-10 text-${selectedConfig.color}-600 mx-auto mb-3`} />
              <div className="text-3xl font-bold text-slate-100 mb-1">{selectedConfig.stats.clients}</div>
              <div className="text-sm text-slate-300">Active Clients</div>
            </div>
            <div className="bg-white rounded-lg border border-white/10 p-6 text-center">
              <FileText className={`w-10 h-10 text-${selectedConfig.color}-600 mx-auto mb-3`} />
              <div className="text-3xl font-bold text-slate-100 mb-1">{selectedConfig.stats.cases}</div>
              <div className="text-sm text-slate-300">Active Cases</div>
            </div>
            <div className="bg-white rounded-lg border border-white/10 p-6 text-center">
              <TrendingUp className={`w-10 h-10 text-${selectedConfig.color}-600 mx-auto mb-3`} />
              <div className="text-3xl font-bold text-slate-100 mb-1">{selectedConfig.stats.compliance}</div>
              <div className="text-sm text-slate-300">Compliance Score</div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg border border-white/10 p-6 mb-8">
            <h3 className="text-xl font-bold text-slate-100 mb-3">About This Industry Module</h3>
            <p className="text-slate-300 mb-4">{selectedConfig.description}</p>
            <div className={`inline-block px-4 py-2 bg-${selectedConfig.color}-50 text-${selectedConfig.color}-700 rounded-lg font-semibold`}>
              Primary Regulator: {selectedConfig.primaryCompliance}
            </div>
          </div>

          {/* Regulatory Requirements */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg border border-white/10 p-6">
              <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center">
                <Shield className={`w-5 h-5 text-${selectedConfig.color}-600 mr-2`} />
                Regulatory Compliance
              </h3>
              <ul className="space-y-2">
                {selectedConfig.regulations.map((reg, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className={`w-5 h-5 text-${selectedConfig.color}-600 mr-2 flex-shrink-0 mt-0.5`} />
                    <span className="text-slate-300">{reg}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg border border-white/10 p-6">
              <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center">
                <FileText className={`w-5 h-5 text-${selectedConfig.color}-600 mr-2`} />
                Key Features
              </h3>
              <ul className="space-y-2">
                {selectedConfig.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className={`w-5 h-5 text-${selectedConfig.color}-600 mr-2 flex-shrink-0 mt-0.5`} />
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* What You Get */}
          <div className={`bg-gradient-to-r ${selectedConfig.gradient} rounded-lg p-6 text-white mb-8`}>
            <h3 className="text-xl font-bold mb-4">What You Get</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                'Industry-specific workflows',
                'Tailored compliance requirements',
                'Custom terminology & forms',
                'Regulatory reporting templates',
                'Risk assessment frameworks',
                'Best practice guidelines'
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setShowDetails(false)}>
              Choose Different Industry
            </Button>
            <Button 
              className={`bg-gradient-to-r ${selectedConfig.gradient} text-white px-8 py-6 text-lg`}
              onClick={handleConfirm}
            >
              Continue with {selectedConfig.name}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          {onClose && (
            <Button variant="ghost" onClick={onClose} className="mb-4">
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
          )}
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-16 h-16 text-blue-400" />
            <h1 className="text-5xl font-bold text-slate-100">Grow KYC</h1>
          </div>
          <p className="text-2xl text-slate-300 font-semibold mb-2">
            Industry-Specific Compliance Platform
          </p>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Select your industry to access tailored compliance workflows, regulatory requirements,
            and best practices designed specifically for your sector.
          </p>
        </div>

        {/* Industry Cards */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {industryConfigs.map((config) => {
            const Icon = config.icon;
            const isSelected = selectedIndustry === config.id;
            
            return (
              <button
                key={config.id}
                onClick={() => handleSelect(config.id)}
                className={`bg-white rounded-2xl border-2 p-8 text-left transition-all hover:shadow-xl hover:scale-105 ${
                  isSelected ? `border-${config.color}-500 shadow-lg` : 'border-white/10'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${config.gradient} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-9 h-9 text-white" />
                  </div>
                  {isSelected && <CheckCircle className={`w-8 h-8 text-${config.color}-600`} />}
                </div>
                
                <h3 className="text-2xl font-bold text-slate-100 mb-2">{config.name}</h3>
                <p className={`text-${config.color}-600 font-semibold mb-3`}>{config.tagline}</p>
                <p className="text-slate-300 text-sm mb-4">{config.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-4 text-sm text-slate-300">
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {config.stats.clients}
                    </span>
                    <span className="flex items-center">
                      <FileText className="w-4 h-4 mr-1" />
                      {config.stats.cases}
                    </span>
                  </div>
                  <ArrowRight className={`w-5 h-5 text-${config.color}-600`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-2xl border border-white/10 p-8">
          <h3 className="text-2xl font-bold text-slate-100 text-center mb-6">
            Why Industry-Specific Compliance Matters
          </h3>
          <div className="grid grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: 'Tailored Workflows',
                description: 'Purpose-built for your industry requirements'
              },
              {
                icon: CheckCircle,
                title: 'Regulatory Alignment',
                description: 'Meets specific compliance obligations'
              },
              {
                icon: TrendingUp,
                title: 'Faster Onboarding',
                description: 'Pre-configured for your sector'
              },
              {
                icon: AlertTriangle,
                title: 'Risk Management',
                description: 'Industry-specific risk frameworks'
              }
            ].map((benefit, index) => {
              const BenefitIcon = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-blue-500/15 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <BenefitIcon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h4 className="font-bold text-slate-100 mb-2">{benefit.title}</h4>
                  <p className="text-sm text-slate-300">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-400">
            Can't find your industry? Contact us to discuss custom compliance solutions.
          </p>
        </div>
      </div>
    </div>
  );
}

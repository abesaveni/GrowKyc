import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Building,
  Store,
  Home,
  Briefcase,
  TrendingUp,
  DollarSign,
  Users,
  Shield,
  AlertTriangle,
  CheckCircle,
  FileText,
  Settings,
  Target,
  Activity,
  Zap,
  Globe,
  Package,
  Truck,
  Heart,
  Cpu,
  Hammer
} from 'lucide-react';

interface IndustryModule {
  id: string;
  name: string;
  icon: any;
  status: 'active' | 'beta' | 'coming-soon';
  clientCount: number;
  description: string;
  riskProfile: 'low' | 'medium' | 'high';
  specificRequirements: string[];
  commonRedFlags: string[];
  typicalTransactions: string[];
}

export function IndustryModules() {
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);

  const industries: IndustryModule[] = [
    {
      id: 'accounting',
      name: 'Accounting & Bookkeeping',
      icon: FileText,
      status: 'active',
      clientCount: 52,
      description: 'Accounting firms, bookkeepers, tax agents, and financial advisors providing professional services.',
      riskProfile: 'medium',
      specificRequirements: [
        'Enhanced CDD for trust account operations',
        'Source of funds verification for large cash deposits',
        'Client identity verification for tax services',
        'Beneficial ownership identification for company clients',
        'Record retention: 7 years minimum'
      ],
      commonRedFlags: [
        'Unusual cash transactions',
        'Complex trust structures without clear purpose',
        'Reluctance to provide source of funds evidence',
        'Frequent changes in business structure',
        'Inconsistent financial information'
      ],
      typicalTransactions: [
        'Professional fees payment',
        'Trust account deposits/withdrawals',
        'Tax refund processing',
        'BAS lodgement services',
        'Financial statement preparation'
      ]
    },
    {
      id: 'real-estate',
      name: 'Real Estate & Property',
      icon: Home,
      status: 'active',
      clientCount: 38,
      description: 'Real estate agents, property developers, conveyancers, and property management services.',
      riskProfile: 'high',
      specificRequirements: [
        'Enhanced CDD for property transactions over $1M',
        'Source of funds verification mandatory',
        'Foreign buyer additional screening',
        'Beneficial ownership for corporate purchases',
        'AUSTRAC TTR for deposits over $10,000',
        'PEP screening for high-value transactions'
      ],
      commonRedFlags: [
        'Cash deposits for property purchase',
        'Offshore entities purchasing property',
        'Nominee buyers concealing true ownership',
        'Rapid property flipping',
        'Purchase price significantly above/below market value',
        'Complex ownership structures'
      ],
      typicalTransactions: [
        'Property deposit payments',
        'Settlement transactions',
        'Rental bond management',
        'Property management fees',
        'Commission payments'
      ]
    },
    {
      id: 'legal',
      name: 'Legal Services',
      icon: Briefcase,
      status: 'active',
      clientCount: 29,
      description: 'Law firms, solicitors, barristers, and legal practitioners handling client funds.',
      riskProfile: 'high',
      specificRequirements: [
        'Trust account compliance (state law society rules)',
        'Enhanced CDD for litigation funding',
        'Source of funds for large settlements',
        'Client identity verification (AML/CTF Act)',
        'Retainer payment verification',
        'Third-party payment approval process'
      ],
      commonRedFlags: [
        'Reluctance to disclose client identity',
        'Unusual trust account activity',
        'Large cash retainers',
        'Complex offshore structures',
        'Inconsistent transaction patterns',
        'Third-party funding without clear purpose'
      ],
      typicalTransactions: [
        'Retainer payments',
        'Settlement funds',
        'Trust account operations',
        'Litigation funding',
        'Professional fees'
      ]
    },
    {
      id: 'financial-services',
      name: 'Financial Services',
      icon: TrendingUp,
      status: 'active',
      clientCount: 45,
      description: 'Financial planners, wealth managers, investment advisors, and mortgage brokers.',
      riskProfile: 'high',
      specificRequirements: [
        'Enhanced CDD for high-net-worth clients',
        'Source of wealth documentation',
        'Investment source verification',
        'PEP screening mandatory',
        'Ongoing monitoring of account activity',
        'Sanctions screening for international transfers'
      ],
      commonRedFlags: [
        'Unusual investment patterns',
        'Source of funds unclear or inconsistent',
        'Frequent changes in investment strategy',
        'Complex offshore structures',
        'Round-dollar transactions',
        'Transactions inconsistent with client profile'
      ],
      typicalTransactions: [
        'Investment deposits',
        'Portfolio rebalancing',
        'Loan settlements',
        'Insurance premium payments',
        'Advisory fees'
      ]
    },
    {
      id: 'retail',
      name: 'Retail & E-commerce',
      icon: Store,
      status: 'beta',
      clientCount: 18,
      description: 'Retail businesses, online stores, and e-commerce platforms with high cash volume.',
      riskProfile: 'medium',
      specificRequirements: [
        'Cash transaction monitoring (TTR threshold)',
        'High-value purchase verification',
        'Refund policy abuse monitoring',
        'Gift card transaction tracking',
        'Structuring detection for cash deposits'
      ],
      commonRedFlags: [
        'Structuring of cash deposits',
        'Large cash purchases of high-value items',
        'Frequent returns and refunds',
        'Gift card purchases in unusual amounts',
        'Multiple transactions just below reporting thresholds'
      ],
      typicalTransactions: [
        'Cash sales',
        'Card payments',
        'Online transactions',
        'Gift card purchases',
        'Refunds and exchanges'
      ]
    },
    {
      id: 'healthcare',
      name: 'Healthcare & Medical',
      icon: Heart,
      status: 'beta',
      clientCount: 15,
      description: 'Medical practices, hospitals, allied health providers with significant cash transactions.',
      riskProfile: 'low',
      specificRequirements: [
        'Cash payment monitoring',
        'Insurance claim verification',
        'Bulk billing compliance',
        'Patient identity verification',
        'Medicare fraud detection'
      ],
      commonRedFlags: [
        'Large cash payments for services',
        'Unusual billing patterns',
        'Insurance fraud indicators',
        'Identity theft in Medicare claims',
        'Excessive bulk billing'
      ],
      typicalTransactions: [
        'Patient payments',
        'Insurance claims',
        'Bulk billing',
        'Private health fund payments',
        'Gap payments'
      ]
    },
    {
      id: 'construction',
      name: 'Construction & Trades',
      icon: Hammer,
      status: 'coming-soon',
      clientCount: 0,
      description: 'Construction companies, builders, and trade contractors with cash-intensive operations.',
      riskProfile: 'medium',
      specificRequirements: [
        'Cash payment monitoring',
        'Subcontractor verification',
        'Progress payment tracking',
        'Retention account monitoring',
        'Building industry payment security'
      ],
      commonRedFlags: [
        'Cash payments to subcontractors',
        'Invoice fraud',
        'Phoenix company activity',
        'Falsified progress claims',
        'Unusual payment patterns'
      ],
      typicalTransactions: [
        'Progress payments',
        'Supplier payments',
        'Subcontractor fees',
        'Retention releases',
        'Variation payments'
      ]
    },
    {
      id: 'technology',
      name: 'Technology & Software',
      icon: Cpu,
      status: 'coming-soon',
      clientCount: 0,
      description: 'Tech companies, software developers, and IT service providers.',
      riskProfile: 'low',
      specificRequirements: [
        'International payment verification',
        'Cryptocurrency transaction monitoring',
        'Subscription payment tracking',
        'Licensing fee verification',
        'IP transfer documentation'
      ],
      commonRedFlags: [
        'Cryptocurrency payments',
        'Unusual international transfers',
        'Complex licensing arrangements',
        'IP transfer to offshore entities',
        'Anonymous payment methods'
      ],
      typicalTransactions: [
        'Subscription payments',
        'Software licensing',
        'Development fees',
        'Support and maintenance',
        'Cloud services'
      ]
    },
    {
      id: 'hospitality',
      name: 'Hospitality & Tourism',
      icon: Globe,
      status: 'coming-soon',
      clientCount: 0,
      description: 'Hotels, restaurants, tourism operators with high cash volume.',
      riskProfile: 'medium',
      specificRequirements: [
        'Cash transaction monitoring',
        'International guest verification',
        'Travel booking verification',
        'Group booking screening',
        'Deposit tracking'
      ],
      commonRedFlags: [
        'Large cash transactions',
        'Suspicious booking patterns',
        'Last-minute high-value bookings',
        'Third-party payments',
        'Unusual cancellation patterns'
      ],
      typicalTransactions: [
        'Room bookings',
        'Food and beverage sales',
        'Tour bookings',
        'Event deposits',
        'Cancellation refunds'
      ]
    },
    {
      id: 'transport',
      name: 'Transport & Logistics',
      icon: Truck,
      status: 'coming-soon',
      clientCount: 0,
      description: 'Transport companies, logistics providers, and freight forwarders.',
      riskProfile: 'medium',
      specificRequirements: [
        'Cargo documentation verification',
        'Cross-border transaction monitoring',
        'Client identity verification',
        'Route and destination screening',
        'Beneficial cargo owner identification'
      ],
      commonRedFlags: [
        'Unusual shipping routes',
        'Inconsistent cargo descriptions',
        'High-risk destination countries',
        'Cash payments for freight',
        'False documentation'
      ],
      typicalTransactions: [
        'Freight charges',
        'Storage fees',
        'Customs clearance',
        'Insurance payments',
        'Demurrage charges'
      ]
    }
  ];

  const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low': return 'green';
      case 'medium': return 'yellow';
      case 'high': return 'orange';
    }
  };

  const getStatusColor = (status: 'active' | 'beta' | 'coming-soon') => {
    switch (status) {
      case 'active': return 'green';
      case 'beta': return 'blue';
      case 'coming-soon': return 'gray';
    }
  };

  const selectedModule = industries.find(i => i.id === selectedIndustry);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Building className="w-16 h-16" />
            <div>
              <h1 className="text-4xl font-bold mb-2">Industry Modules</h1>
              <p className="text-xl text-teal-100">Industry-Specific Compliance Requirements</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button className="bg-white text-teal-600 hover:bg-teal-50">
              <Settings className="w-5 h-5 mr-2" />
              Configure
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Active Modules</h3>
              <CheckCircle className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold">{industries.filter(i => i.status === 'active').length}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Total Clients</h3>
              <Users className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold">{industries.reduce((sum, i) => sum + i.clientCount, 0)}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Beta Testing</h3>
              <Zap className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-blue-300">{industries.filter(i => i.status === 'beta').length}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Coming Soon</h3>
              <Activity className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-gray-300">{industries.filter(i => i.status === 'coming-soon').length}</p>
          </div>
        </div>
      </div>

      {/* Industry Overview */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Target className="w-6 h-6 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-bold text-blue-900 mb-2">Industry-Specific Compliance</h3>
            <p className="text-sm text-blue-800 mb-3">
              Each industry has unique AML/CTF risk profiles and regulatory requirements. These modules provide:
            </p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Tailored risk assessment criteria based on industry characteristics</li>
              <li>• Industry-specific red flag indicators and suspicious activity patterns</li>
              <li>• Customized CDD questionnaires relevant to the industry</li>
              <li>• Typical transaction profiles for benchmarking</li>
              <li>• Regulatory guidance specific to the industry sector</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Industry Grid */}
      <div className="grid grid-cols-2 gap-4">
        {industries.map((industry) => {
          const Icon = industry.icon;
          return (
            <div
              key={industry.id}
              onClick={() => setSelectedIndustry(industry.id)}
              className={`bg-white rounded-lg border-2 p-6 cursor-pointer transition-all hover:shadow-lg ${
                selectedIndustry === industry.id ? 'border-teal-500 shadow-lg' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{industry.name}</h3>
                    <p className="text-sm text-gray-600">{industry.clientCount} clients</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <span className={`px-3 py-1 bg-${getStatusColor(industry.status)}-100 text-${getStatusColor(industry.status)}-700 text-xs font-bold rounded-full`}>
                    {industry.status === 'active' ? 'ACTIVE' : industry.status === 'beta' ? 'BETA' : 'COMING SOON'}
                  </span>
                  <span className={`px-3 py-1 bg-${getRiskColor(industry.riskProfile)}-100 text-${getRiskColor(industry.riskProfile)}-700 text-xs font-bold rounded-full`}>
                    {industry.riskProfile.toUpperCase()} RISK
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-3">{industry.description}</p>

              {industry.status !== 'coming-soon' && (
                <Button 
                  size="sm" 
                  className={`w-full ${selectedIndustry === industry.id ? 'bg-teal-600' : 'bg-gray-600'} hover:bg-teal-700`}
                >
                  View Details
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Industry Details */}
      {selectedModule && selectedModule.status !== 'coming-soon' && (
        <div className="bg-white rounded-lg border-2 border-teal-500 p-6">
          <div className="flex items-center gap-3 mb-6">
            {React.createElement(selectedModule.icon, { className: "w-8 h-8 text-teal-600" })}
            <h2 className="text-2xl font-bold text-gray-900">{selectedModule.name}</h2>
            <span className={`px-3 py-1 bg-${getRiskColor(selectedModule.riskProfile)}-100 text-${getRiskColor(selectedModule.riskProfile)}-700 text-sm font-bold rounded-full`}>
              {selectedModule.riskProfile.toUpperCase()} RISK INDUSTRY
            </span>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Specific Requirements */}
            <div className="p-4 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-blue-600" />
                <h4 className="font-bold text-blue-900">Specific Requirements</h4>
              </div>
              <ul className="space-y-2">
                {selectedModule.specificRequirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-blue-800">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Common Red Flags */}
            <div className="p-4 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h4 className="font-bold text-red-900">Common Red Flags</h4>
              </div>
              <ul className="space-y-2">
                {selectedModule.commonRedFlags.map((flag, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-red-800">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Typical Transactions */}
            <div className="p-4 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-5 h-5 text-green-600" />
                <h4 className="font-bold text-green-900">Typical Transactions</h4>
              </div>
              <ul className="space-y-2">
                {selectedModule.typicalTransactions.map((transaction, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-green-800">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{transaction}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

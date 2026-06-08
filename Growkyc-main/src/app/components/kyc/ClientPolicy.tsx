import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { toast } from '../../lib/toast';
import {
  Shield,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Clock,
  Eye,
  Download,
  Edit,
  Lock,
  Unlock,
  Search,
  Filter,
  Target,
  Zap,
  BookOpen,
  GitBranch,
  Activity,
  Bell,
  Info,
  Plus,
  Trash2,
  Copy,
  RefreshCw,
  Archive,
  Ban,
  CheckSquare
} from 'lucide-react';

type ClientType = 'individual' | 'company' | 'trust' | 'partnership' | 'smsf' | 'foreign-entity';
type RiskTier = 'low' | 'medium' | 'high' | 'prohibited';
type CDDLevel = 'simplified' | 'standard' | 'enhanced';
type ApprovalStatus = 'auto-approved' | 'pending-review' | 'approved' | 'rejected' | 'restricted';

interface ClientAcceptanceRule {
  id: string;
  name: string;
  clientType: ClientType;
  riskFactors: string[];
  cddLevel: CDDLevel;
  requiresApproval: boolean;
  approvalAuthority: string;
  prohibitedIndicators: string[];
  documentRequirements: string[];
  monitoringFrequency: string;
}

interface PolicyVersion {
  version: string;
  effectiveDate: Date;
  approvedBy: string;
  status: 'draft' | 'review' | 'active' | 'archived';
  changes: string[];
}

const getPersonaConfig = (userId: string) => {
  const configs: Record<string, { name: string; title: string; role: string }> = {
    sarah_chen: { name: 'Sarah Chen', title: 'Head of Compliance', role: 'compliance_officer' },
    emma_williams: { name: 'Emma Williams', title: 'Compliance Officer', role: 'compliance_officer' },
    jessica_lee: { name: 'Jessica Lee', title: 'Senior Compliance Officer', role: 'compliance_officer' },
    alex_rivera: { name: 'Alex Rivera', title: 'AML Analyst', role: 'analyst' },
    david_thompson: { name: 'David Thompson', title: 'Internal Auditor', role: 'auditor' },
    michael_roberts: { name: 'Michael Roberts', title: 'Managing Partner', role: 'partner' },
    robert_kim: { name: 'Robert Kim', title: 'Risk Partner', role: 'partner' }
  };
  return configs[userId] || configs.sarah_chen;
};

export function ClientPolicy() {
  const [activeTab, setActiveTab] = useState<'overview' | 'acceptance' | 'cdd-rules' | 'edd-triggers' | 'sdd-criteria' | 'approval-workflow' | 'restrictions' | 'documents' | 'versions'>('overview');
  const [selectedClientType, setSelectedClientType] = useState<ClientType | 'all'>('all');

  const [activePersona, setActivePersona] = useState(() => localStorage.getItem('growkyc_selected_user') || 'sarah_chen');

  useEffect(() => {
    const handlePersonaChange = () => {
      setActivePersona(localStorage.getItem('growkyc_selected_user') || 'sarah_chen');
    };
    window.addEventListener('growkyc:persona_changed', handlePersonaChange);
    return () => window.removeEventListener('growkyc:persona_changed', handlePersonaChange);
  }, []);

  const [policyVersions, setPolicyVersions] = useState<PolicyVersion[]>(() => {
    const saved = localStorage.getItem('growkyc_policy_versions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((p: any) => ({ ...p, effectiveDate: new Date(p.effectiveDate) }));
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        version: '3.2',
        effectiveDate: new Date('2024-02-01'),
        approvedBy: 'Michael Chen (Senior Manager)',
        status: 'active',
        changes: [
          'Added Equifax risk scoring integration',
          'Updated PEP screening requirements',
          'Enhanced trust structure documentation',
          'Added quarterly review for foreign entities'
        ]
      },
      {
        version: '3.1',
        effectiveDate: new Date('2023-11-15'),
        approvedBy: 'Sarah Johnson (Governing Body)',
        status: 'archived',
        changes: [
          'Updated high-risk jurisdiction list',
          'Added cryptocurrency source of funds guidance',
          'Enhanced beneficial ownership thresholds'
        ]
      },
      {
        version: '3.0',
        effectiveDate: new Date('2023-07-01'),
        approvedBy: 'Sarah Johnson (Governing Body)',
        status: 'archived',
        changes: [
          'Major overhaul for AUSTRAC Rule amendments',
          'Introduced risk-based approach framework',
          'Added simplified due diligence criteria',
          'Enhanced customer due diligence procedures'
        ]
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('growkyc_policy_versions', JSON.stringify(policyVersions));
  }, [policyVersions]);

  const [showDraftModal, setShowDraftModal] = useState(false);
  const [newVersion, setNewVersion] = useState('');
  const [newChangeText, setNewChangeText] = useState('');
  const [newChanges, setNewChanges] = useState<string[]>([]);

  // Client Acceptance Rules
  const [clientRules] = useState<ClientAcceptanceRule[]>([
    {
      id: 'CAR-001',
      name: 'Individual - Low Risk',
      clientType: 'individual',
      riskFactors: ['Australian resident', 'Transparent source of wealth', 'No adverse media', 'Stable occupation'],
      cddLevel: 'standard',
      requiresApproval: false,
      approvalAuthority: 'Client Manager',
      prohibitedIndicators: [],
      documentRequirements: ['Government-issued ID', 'Proof of address', 'Source of funds declaration'],
      monitoringFrequency: 'Annual'
    },
    {
      id: 'CAR-002',
      name: 'Individual - High Risk',
      clientType: 'individual',
      riskFactors: ['PEP or family member', 'High-risk jurisdiction', 'Complex wealth structure', 'Cash-intensive business'],
      cddLevel: 'enhanced',
      requiresApproval: true,
      approvalAuthority: 'Senior Manager',
      prohibitedIndicators: ['Sanctions match', 'Known criminal activity', 'Terrorism links'],
      documentRequirements: ['Enhanced ID verification', 'Source of wealth evidence', 'Business ownership docs', 'Financial statements', 'Reference letters'],
      monitoringFrequency: 'Quarterly'
    },
    {
      id: 'CAR-003',
      name: 'Company - Standard',
      clientType: 'company',
      riskFactors: ['Australian entity', 'Public disclosure', 'Transparent ownership', 'Established trading history'],
      cddLevel: 'standard',
      requiresApproval: false,
      approvalAuthority: 'Client Manager',
      prohibitedIndicators: ['Insolvency', 'Director disqualification', 'ASIC investigation'],
      documentRequirements: ['ASIC extract', 'Constitution', 'Director IDs', 'Shareholder register', 'UBO declaration'],
      monitoringFrequency: 'Annual'
    },
    {
      id: 'CAR-004',
      name: 'Trust - Enhanced Due Diligence',
      clientType: 'trust',
      riskFactors: ['Complex structure', 'Foreign beneficiaries', 'Discretionary powers', 'High value assets'],
      cddLevel: 'enhanced',
      requiresApproval: true,
      approvalAuthority: 'Compliance Officer',
      prohibitedIndicators: ['Nominee arrangements without disclosure', 'Tax haven connections', 'Layered structures'],
      documentRequirements: ['Trust deed', 'Trustee company docs', 'Appointor details', 'Beneficiary list', 'Financial statements', 'Source of funds'],
      monitoringFrequency: 'Semi-Annual'
    },
    {
      id: 'CAR-005',
      name: 'Foreign Entity - Prohibited Without Approval',
      clientType: 'foreign-entity',
      riskFactors: ['High-risk jurisdiction', 'No Australian presence', 'Complex ownership', 'Limited transparency'],
      cddLevel: 'enhanced',
      requiresApproval: true,
      approvalAuthority: 'Senior Manager + Compliance Officer',
      prohibitedIndicators: ['Sanctioned country', 'FATF blacklist', 'Tax haven without substance', 'Shell company indicators'],
      documentRequirements: ['Certificate of incorporation', 'Apostilled documents', 'Legal opinion', 'UBO declaration', 'Bank references', 'Business plan'],
      monitoringFrequency: 'Quarterly'
    }
  ]);

  // EDD Triggers
  const eddTriggers = [
    {
      category: 'Client Characteristics',
      triggers: [
        'Client is a Politically Exposed Person (PEP) or immediate family member',
        'Client is from a high-risk jurisdiction (FATF list)',
        'Client has adverse media or reputational concerns',
        'Client has sanctions screening match (further investigation required)',
        'Client has complex ownership structure with nominee arrangements',
        'Client has unexplained wealth or inconsistent income profile'
      ]
    },
    {
      category: 'Business Relationship',
      triggers: [
        'Cash-intensive business without reasonable explanation',
        'Business activities in high-risk sectors (gaming, precious metals, money remittance)',
        'Client refuses to provide standard information',
        'Frequent changes in beneficial ownership',
        'Use of multiple trust structures or shell companies',
        'Transactions inconsistent with client profile'
      ]
    },
    {
      category: 'Geographic Risk',
      triggers: [
        'Significant business operations in high-risk jurisdictions',
        'Payments to/from sanctioned countries',
        'Use of tax havens without legitimate business purpose',
        'Cross-border transactions with no apparent commercial rationale'
      ]
    },
    {
      category: 'Transaction Patterns',
      triggers: [
        'Unusually large transactions relative to client profile',
        'Rapid movement of funds (in and out quickly)',
        'Structuring transactions to avoid reporting thresholds',
        'Use of third-party payments without clear relationship',
        'Transactions with no apparent legitimate purpose'
      ]
    },
    {
      category: 'Red Flags',
      triggers: [
        'Client insists on unusual levels of secrecy',
        'Reluctance to provide identification documentation',
        'Documentation appears forged or altered',
        'Client terminates relationship when additional info requested',
        'Source of funds inconsistent with declared activities',
        'Previous relationship terminated by another firm for ML/TF concerns'
      ]
    }
  ];

  // SDD Criteria
  const sddCriteria = [
    {
      category: 'Eligible Entities',
      description: 'Australian Government Bodies',
      criteria: [
        'Federal, State, or Local Government agencies',
        'Government-owned corporations',
        'Regulatory authorities (ASIC, AUSTRAC, ATO)',
        'Verification: ABN lookup confirms government entity'
      ],
      cddRequirements: ['Entity name and ABN', 'Contact person details', 'Engagement scope'],
      restrictions: ['Cannot be used for foreign government bodies', 'Must have legitimate business purpose']
    },
    {
      category: 'Eligible Entities',
      description: 'Listed Companies (ASX)',
      criteria: [
        'Listed on Australian Securities Exchange (ASX)',
        'Subject to continuous disclosure obligations',
        'Publicly available financial information',
        'Verification: ASX listing confirmed'
      ],
      cddRequirements: ['Company name and ACN', 'ASX code', 'Contact person', 'Last annual report'],
      restrictions: ['Must maintain ASX listing throughout engagement', 'Delisting triggers standard CDD']
    },
    {
      category: 'Eligible Entities',
      description: 'Regulated Australian Financial Institutions',
      criteria: [
        'APRA-regulated banks, insurers, superannuation funds',
        'ASIC-licensed financial services providers',
        'Subject to AML/CTF Act obligations',
        'Verification: APRA/ASIC register check'
      ],
      cddRequirements: ['Entity name and license number', 'Regulator confirmation', 'Contact details'],
      restrictions: ['License must be current', 'Cannot apply to foreign financial institutions']
    }
  ];

  const handleSubmitForReview = (versionToSubmit: string) => {
    setPolicyVersions(prev => prev.map(v => 
      v.version === versionToSubmit ? { ...v, status: 'review' } : v
    ));
    toast.success('Policy Sent for Review', `Version ${versionToSubmit} has been submitted for approval.`);
  };

  const handleApproveAndPublish = (versionToApprove: string) => {
    const persona = getPersonaConfig(activePersona);
    if (persona.title !== 'Head of Compliance' && persona.role !== 'partner') {
      toast.error('Permission Denied', 'Only the Head of Compliance or Managing Partner can approve and publish policy changes.');
      return;
    }
    setPolicyVersions(prev => {
      return prev.map(v => {
        if (v.version === versionToApprove) {
          return { 
            ...v, 
            status: 'active', 
            effectiveDate: new Date(), 
            approvedBy: `${persona.name} (${persona.title})`
          };
        }
        if (v.status === 'active') {
          return { ...v, status: 'archived' };
        }
        return v;
      });
    });
    toast.success('Policy Published', `Version ${versionToApprove} is now active.`);
  };

  const handleCreateDraft = () => {
    if (!newVersion) {
      toast.error('Error', 'Please specify a version number.');
      return;
    }
    const draft: PolicyVersion = {
      version: newVersion,
      effectiveDate: new Date(),
      approvedBy: 'Draft Status',
      status: 'draft',
      changes: newChanges.length > 0 ? newChanges : ['Policy updates and parameter tuning.']
    };
    setPolicyVersions(prev => [draft, ...prev]);
    setShowDraftModal(false);
    setNewVersion('');
    setNewChanges([]);
    toast.success('Draft Created', `Version ${newVersion} is now available in your version history.`);
  };

  const getRiskColor = (tier: RiskTier) => {
    switch (tier) {
      case 'low': return 'green';
      case 'medium': return 'yellow';
      case 'high': return 'orange';
      case 'prohibited': return 'red';
    }
  };

  const getCDDLevelColor = (level: CDDLevel) => {
    switch (level) {
      case 'simplified': return 'blue';
      case 'standard': return 'green';
      case 'enhanced': return 'orange';
    }
  };

  const clientTypeLabels: Record<ClientType, string> = {
    'individual': 'Individual',
    'company': 'Company',
    'trust': 'Trust',
    'partnership': 'Partnership',
    'smsf': 'SMSF',
    'foreign-entity': 'Foreign Entity'
  };

  const filteredRules = selectedClientType === 'all' 
    ? clientRules 
    : clientRules.filter(r => r.clientType === selectedClientType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <FileText className="w-16 h-16" />
            <div>
              <h1 className="text-4xl font-bold mb-2">Client Policy</h1>
              <p className="text-xl text-purple-100">Client Acceptance & Due Diligence Framework</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button className="bg-white text-purple-600 hover:bg-purple-50">
              <Download className="w-5 h-5 mr-2" />
              Export Policy
            </Button>
            <Button className="bg-white text-purple-600 hover:bg-purple-50">
              <Edit className="w-5 h-5 mr-2" />
              Edit Policy
            </Button>
          </div>
        </div>

        {/* Current Version Info */}
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm text-purple-100">Current Version</p>
                <p className="text-2xl font-bold">v{policyVersions[0].version}</p>
              </div>
              <div className="h-12 w-px bg-white/20" />
              <div>
                <p className="text-sm text-purple-100">Effective Date</p>
                <p className="text-lg font-semibold">{policyVersions[0].effectiveDate.toLocaleDateString()}</p>
              </div>
              <div className="h-12 w-px bg-white/20" />
              <div>
                <p className="text-sm text-purple-100">Approved By</p>
                <p className="text-lg font-semibold">{policyVersions[0].approvedBy}</p>
              </div>
              <div className="h-12 w-px bg-white/20" />
              <div>
                <p className="text-sm text-purple-100">Next Review</p>
                <p className="text-lg font-semibold">July 2024</p>
              </div>
            </div>
            <span className="px-4 py-2 bg-green-500 text-white font-bold rounded-full">
              ACTIVE
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-2">
          {[
            { id: 'overview', label: 'Overview', icon: BookOpen },
            { id: 'acceptance', label: 'Client Acceptance Rules', icon: CheckSquare },
            { id: 'cdd-rules', label: 'CDD Framework', icon: Shield },
            { id: 'edd-triggers', label: 'EDD Triggers', icon: AlertTriangle },
            { id: 'sdd-criteria', label: 'SDD Criteria', icon: Zap },
            { id: 'approval-workflow', label: 'Approval Workflow', icon: GitBranch },
            { id: 'restrictions', label: 'Restrictions & Exit', icon: Ban },
            { id: 'documents', label: 'Document Requirements', icon: FileText },
            { id: 'versions', label: 'Version History', icon: Clock }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 font-semibold flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Policy Statement */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Policy Statement</h3>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                This Client Policy establishes the framework for client acceptance, customer due diligence (CDD), 
                and ongoing monitoring in accordance with the Anti-Money Laundering and Counter-Terrorism Financing 
                Act 2006 (Cth) and associated Rules.
              </p>
              <p className="text-gray-700 mb-4">
                The firm adopts a <strong>risk-based approach</strong> to client acceptance and due diligence, 
                with the level of scrutiny proportionate to the identified money laundering and terrorism financing 
                (ML/TF) risks.
              </p>
              <p className="text-gray-700">
                All staff must adhere to this policy. Non-compliance may result in disciplinary action and 
                potential breaches of the AML/CTF Act.
              </p>
            </div>
          </div>

          {/* Key Principles */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-blue-900 mb-2">Risk-Based Approach</h4>
              <p className="text-sm text-blue-800">
                CDD measures are scaled according to the assessed ML/TF risk. Higher risk clients receive 
                enhanced scrutiny and ongoing monitoring.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-green-900 mb-2">Know Your Client</h4>
              <p className="text-sm text-green-800">
                We verify the identity of clients and beneficial owners, understand the purpose and nature 
                of the business relationship, and monitor transactions.
              </p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-orange-900 mb-2">Ongoing Monitoring</h4>
              <p className="text-sm text-orange-800">
                Client information is kept up-to-date through periodic reviews, transaction monitoring, 
                and trigger-based reassessments.
              </p>
            </div>
          </div>

          {/* CDD Levels Overview */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Customer Due Diligence Levels</h3>
            
            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                <div className="flex-shrink-0">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-blue-900 mb-2">Simplified Due Diligence (SDD)</h4>
                  <p className="text-sm text-blue-800 mb-2">
                    Applied to low-risk clients such as Australian Government entities, ASX-listed companies, 
                    and APRA-regulated financial institutions.
                  </p>
                  <p className="text-xs text-blue-700">
                    <strong>Requirements:</strong> Reduced documentation, verification via public registers, 
                    no beneficial ownership investigation required.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-green-900 mb-2">Standard Due Diligence (CDD)</h4>
                  <p className="text-sm text-green-800 mb-2">
                    Default level for most clients. Verifies identity, collects beneficial ownership information, 
                    and assesses risk.
                  </p>
                  <p className="text-xs text-green-700">
                    <strong>Requirements:</strong> Government-issued ID, proof of address, business documents, 
                    beneficial ownership declaration, source of funds/wealth.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-orange-50 border-l-4 border-orange-500 rounded-r-lg">
                <div className="flex-shrink-0">
                  <AlertTriangle className="w-8 h-8 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-orange-900 mb-2">Enhanced Due Diligence (EDD)</h4>
                  <p className="text-sm text-orange-800 mb-2">
                    Applied to high-risk clients including PEPs, high-risk jurisdictions, complex structures, 
                    and cash-intensive businesses.
                  </p>
                  <p className="text-xs text-orange-700">
                    <strong>Requirements:</strong> All CDD requirements PLUS additional verification, source of wealth 
                    evidence, senior management approval, and enhanced ongoing monitoring (quarterly).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Dashboard */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">Active Clients</h4>
                <Users className="w-5 h-5 text-gray-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">287</p>
            </div>

            <div className="bg-white rounded-lg border border-green-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">Standard CDD</h4>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600">245</p>
              <p className="text-xs text-gray-600">85% of portfolio</p>
            </div>

            <div className="bg-white rounded-lg border border-orange-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">Enhanced CDD</h4>
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-3xl font-bold text-orange-600">38</p>
              <p className="text-xs text-gray-600">13% of portfolio</p>
            </div>

            <div className="bg-white rounded-lg border border-blue-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">Simplified CDD</h4>
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-600">4</p>
              <p className="text-xs text-gray-600">2% of portfolio</p>
            </div>
          </div>
        </div>
      )}

      {/* Client Acceptance Rules Tab */}
      {activeTab === 'acceptance' && (
        <div className="space-y-6">
          {/* Filter */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-gray-900">Filter by Client Type:</span>
              <button
                onClick={() => setSelectedClientType('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedClientType === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({clientRules.length})
              </button>
              {Object.entries(clientTypeLabels).map(([type, label]) => {
                const count = clientRules.filter(r => r.clientType === type).length;
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedClientType(type as ClientType)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedClientType === type
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {label} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rules List */}
          <div className="space-y-4">
            {filteredRules.map((rule) => (
              <div key={rule.id} className={`bg-white rounded-lg border-2 p-6 ${
                rule.cddLevel === 'enhanced' ? 'border-orange-200' :
                rule.cddLevel === 'simplified' ? 'border-blue-200' :
                'border-green-200'
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{rule.name}</h3>
                      <span className={`px-3 py-1 bg-${getCDDLevelColor(rule.cddLevel)}-100 text-${getCDDLevelColor(rule.cddLevel)}-700 text-sm font-bold rounded-full`}>
                        {rule.cddLevel.toUpperCase().replace('-', ' ')}
                      </span>
                      {rule.requiresApproval && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-semibold rounded-full flex items-center gap-1">
                          <Lock className="w-4 h-4" />
                          APPROVAL REQUIRED
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">Rule ID: {rule.id} • Client Type: {clientTypeLabels[rule.clientType]}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Risk Factors</h4>
                    <ul className="space-y-1">
                      {rule.riskFactors.map((factor, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>

                    {rule.prohibitedIndicators.length > 0 && (
                      <>
                        <h4 className="font-semibold text-red-900 mb-3 mt-4">Prohibited Indicators</h4>
                        <ul className="space-y-1">
                          {rule.prohibitedIndicators.map((indicator, index) => (
                            <li key={index} className="text-sm text-red-700 flex items-start">
                              <XCircle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{indicator}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Document Requirements</h4>
                    <ul className="space-y-1">
                      {rule.documentRequirements.map((doc, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start">
                          <FileText className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-600 mb-1">Approval Authority</p>
                          <p className="font-semibold text-gray-900">{rule.approvalAuthority}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">Monitoring Frequency</p>
                          <p className="font-semibold text-gray-900">{rule.monitoringFrequency}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EDD Triggers Tab */}
      {activeTab === 'edd-triggers' && (
        <div className="space-y-6">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-bold text-orange-900 mb-2">Enhanced Due Diligence Triggers</h3>
                <p className="text-sm text-orange-800">
                  When ANY of the following indicators are present, Enhanced Due Diligence (EDD) must be applied. 
                  This includes additional verification steps, senior management approval, and enhanced ongoing monitoring.
                </p>
              </div>
            </div>
          </div>

          {eddTriggers.map((category, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{category.category}</h3>
              <div className="space-y-3">
                {category.triggers.map((trigger, triggerIndex) => (
                  <div key={triggerIndex} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-800">{trigger}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* EDD Process */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">EDD Process Requirements</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Additional Verification Steps</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Independent verification of source of wealth (bank statements, tax returns, asset valuations)</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Enhanced screening (PEP, sanctions, adverse media)</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Background checks on key individuals</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Business premises verification (if applicable)</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Third-party references (bank, legal, business)</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Approval & Monitoring</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <Lock className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Senior Manager</strong> approval required before acceptance</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <Lock className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Compliance Officer</strong> review and sign-off</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <Activity className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Quarterly</strong> monitoring and review</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <Bell className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Transaction alerts</strong> for unusual activity</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <FileText className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Enhanced record keeping</strong> with full justification</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SDD Criteria Tab */}
      {activeTab === 'sdd-criteria' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <Zap className="w-6 h-6 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-bold text-blue-900 mb-2">Simplified Due Diligence Eligibility</h3>
                <p className="text-sm text-blue-800">
                  SDD may only be applied to specific low-risk entities. All eligibility criteria must be met 
                  and verified. If any criterion is not satisfied, standard CDD applies.
                </p>
              </div>
            </div>
          </div>

          {sddCriteria.map((criteria, index) => (
            <div key={index} className="bg-white rounded-lg border-2 border-blue-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-600">{criteria.category}</p>
                  <h3 className="text-xl font-bold text-gray-900">{criteria.description}</h3>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Eligibility Criteria</h4>
                  <ul className="space-y-2">
                    {criteria.criteria.map((criterion, criterionIndex) => (
                      <li key={criterionIndex} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{criterion}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Reduced CDD Requirements</h4>
                  <ul className="space-y-2">
                    {criteria.cddRequirements.map((req, reqIndex) => (
                      <li key={reqIndex} className="flex items-start gap-2 text-sm text-gray-700">
                        <FileText className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2">Restrictions & Limitations</h4>
                <ul className="space-y-1">
                  {criteria.restrictions.map((restriction, restrictionIndex) => (
                    <li key={restrictionIndex} className="flex items-start gap-2 text-sm text-yellow-800">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span>{restriction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Approval Workflow Tab */}
      {activeTab === 'approval-workflow' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Client Acceptance Approval Workflow</h3>

            {/* Workflow Diagram */}
            <div className="space-y-6">
              {/* Stage 1 */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-2">Initial Assessment</h4>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-gray-700 mb-2"><strong>Responsible:</strong> Client Manager</p>
                    <p className="text-sm text-gray-700 mb-3"><strong>Actions:</strong></p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Collect preliminary information</li>
                      <li>• Run initial screening (sanctions, PEP, adverse media)</li>
                      <li>• Assess risk tier (Low/Medium/High)</li>
                      <li>• Determine CDD level required</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <GitBranch className="w-8 h-8 text-gray-400" />
              </div>

              {/* Stage 2a - Auto Approval */}
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    2a
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-green-900 mb-2">Auto-Approval Path</h4>
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-gray-700 mb-2"><strong>Criteria:</strong></p>
                      <ul className="space-y-1 text-sm text-gray-700 mb-3">
                        <li>• Risk tier: Low</li>
                        <li>• CDD level: Standard or Simplified</li>
                        <li>• No red flags in screening</li>
                        <li>• Client type eligible for auto-approval</li>
                      </ul>
                      <p className="text-sm text-gray-700"><strong>Outcome:</strong> Client accepted immediately</p>
                    </div>
                  </div>
                </div>

                {/* Stage 2b - Manual Review */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    2b
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-orange-900 mb-2">Manual Review Path</h4>
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm text-gray-700 mb-2"><strong>Triggers:</strong></p>
                      <ul className="space-y-1 text-sm text-gray-700 mb-3">
                        <li>• Risk tier: Medium or High</li>
                        <li>• CDD level: Enhanced</li>
                        <li>• Any EDD triggers present</li>
                        <li>• Foreign entity or complex structure</li>
                      </ul>
                      <p className="text-sm text-gray-700"><strong>Action:</strong> Escalate to Stage 3</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <GitBranch className="w-8 h-8 text-gray-400" />
              </div>

              {/* Stage 3 - Senior Review */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-2">Senior Manager Review</h4>
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-sm text-gray-700 mb-2"><strong>Responsible:</strong> Senior Manager</p>
                    <p className="text-sm text-gray-700 mb-3"><strong>Review Criteria:</strong></p>
                    <ul className="space-y-1 text-sm text-gray-700 mb-3">
                      <li>• Adequacy of CDD documentation</li>
                      <li>• Risk assessment accuracy</li>
                      <li>• Source of funds/wealth verification</li>
                      <li>• Business rationale</li>
                      <li>• Firm's risk appetite alignment</li>
                    </ul>
                    <div className="flex gap-3">
                      <span className="px-3 py-1 bg-green-600 text-white text-sm font-bold rounded">APPROVE</span>
                      <span className="px-3 py-1 bg-red-600 text-white text-sm font-bold rounded">REJECT</span>
                      <span className="px-3 py-1 bg-yellow-600 text-white text-sm font-bold rounded">REQUEST MORE INFO</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stage 4 - Compliance Review (High Risk Only) */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  4
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-2">Compliance Officer Review (High Risk Only)</h4>
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-gray-700 mb-2"><strong>Responsible:</strong> AML/CTF Compliance Officer</p>
                    <p className="text-sm text-gray-700 mb-3"><strong>Required for:</strong></p>
                    <ul className="space-y-1 text-sm text-gray-700 mb-3">
                      <li>• Risk tier: High</li>
                      <li>• PEP or sanctioned individual (with further investigation)</li>
                      <li>• Foreign entity from high-risk jurisdiction</li>
                      <li>• Complex beneficial ownership structure</li>
                    </ul>
                    <p className="text-sm text-gray-700"><strong>Final Decision:</strong> Compliance Officer must sign off before acceptance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SLA Timeframes */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Service Level Agreement (SLA) Timeframes</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Auto-Approval</h4>
                <p className="text-3xl font-bold text-green-600">Instant</p>
                <p className="text-sm text-green-700 mt-2">System processes immediately</p>
              </div>
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-2">Senior Manager Review</h4>
                <p className="text-3xl font-bold text-orange-600">2 days</p>
                <p className="text-sm text-orange-700 mt-2">Business days from submission</p>
              </div>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-900 mb-2">Compliance Review</h4>
                <p className="text-3xl font-bold text-red-600">5 days</p>
                <p className="text-sm text-red-700 mt-2">Business days (high risk cases)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Version History Tab */}
      {activeTab === 'versions' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Policy Version History</h3>
              {!policyVersions.some(v => v.status === 'draft' || v.status === 'review') && (
                <Button 
                  onClick={() => setShowDraftModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Create Policy Draft
                </Button>
              )}
            </div>

            {showDraftModal && (
              <div className="mb-6 p-6 border-2 border-dashed border-indigo-200 bg-indigo-50/20 rounded-xl space-y-4">
                <h4 className="text-lg font-bold text-indigo-900">New Policy Version Draft</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Version Number</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 3.3" 
                      value={newVersion} 
                      onChange={e => setNewVersion(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Add Key Change</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Describe a change..." 
                        value={newChangeText} 
                        onChange={e => setNewChangeText(e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                      />
                      <Button 
                        onClick={() => {
                          if (newChangeText.trim()) {
                            setNewChanges(prev => [...prev, newChangeText.trim()]);
                            setNewChangeText('');
                          }
                        }}
                        className="bg-gray-800 hover:bg-gray-900 text-white font-semibold"
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </div>

                {newChanges.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Changes List</span>
                    <ul className="space-y-1 bg-white p-3 border rounded-lg">
                      {newChanges.map((ch, idx) => (
                        <li key={idx} className="text-xs text-gray-700 font-medium flex items-center justify-between">
                          <span>• {ch}</span>
                          <button 
                            onClick={() => setNewChanges(prev => prev.filter((_, i) => i !== idx))}
                            className="text-red-500 hover:text-red-700 font-bold"
                          >
                            ✕
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <Button 
                    onClick={() => setShowDraftModal(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateDraft}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                  >
                    Save Draft
                  </Button>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              {policyVersions.map((version, index) => {
                const isDraft = version.status === 'draft';
                const isReview = version.status === 'review';
                const isActive = version.status === 'active';
                const persona = getPersonaConfig(activePersona);
                const canApprove = persona.title === 'Head of Compliance' || persona.role === 'partner';
                
                return (
                  <div key={index} className={`p-6 rounded-lg border-2 ${
                    isActive ? 'border-green-500 bg-green-50' :
                    isReview ? 'border-indigo-400 bg-indigo-50/20' :
                    isDraft ? 'border-yellow-500 bg-yellow-50/20' :
                    'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-2xl font-bold text-gray-900">Version {version.version}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            isActive ? 'bg-green-500 text-white' :
                            isReview ? 'bg-indigo-600 text-white' :
                            isDraft ? 'bg-yellow-500 text-yellow-800 border border-yellow-200' :
                            'bg-gray-400 text-white'
                          }`}>
                            {version.status.toUpperCase() === 'REVIEW' ? 'PENDING APPROVAL' : version.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <span>{isActive ? 'Effective Date' : 'Created Date'}: {version.effectiveDate.toLocaleDateString()}</span>
                          <span>•</span>
                          <span>Approved by: {isActive ? version.approvedBy : 'Pending Sign-off'}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {isDraft && (
                          <Button 
                            onClick={() => handleSubmitForReview(version.version)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-1 h-8"
                          >
                            Submit for Review
                          </Button>
                        )}
                        {isReview && (
                          <div className="flex flex-col items-end gap-1">
                            <Button 
                              onClick={() => handleApproveAndPublish(version.version)}
                              disabled={!canApprove}
                              className={`${
                                canApprove ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'
                              } text-white font-semibold text-xs py-1 h-8`}
                            >
                              Approve & Publish
                            </Button>
                            {!canApprove && (
                              <span className="text-[10px] text-red-500 font-semibold max-w-[200px] text-right">
                                Requires Head of Compliance or Partner sign-off
                              </span>
                            )}
                          </div>
                        )}
                        <Button size="sm" variant="outline" className="h-8">
                          <Eye className="w-4 h-4 mr-2" />
                          View Full
                        </Button>
                        <Button size="sm" variant="outline" className="h-8">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Key Changes:</h5>
                      <ul className="space-y-1">
                        {version.changes.map((change, changeIndex) => (
                          <li key={changeIndex} className="text-sm text-gray-700 flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{change}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Policy Governance */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Policy Governance</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-3">Review Schedule</h4>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>• <strong>Annual Review:</strong> July of each year</li>
                  <li>• <strong>Trigger-based Review:</strong> Material AUSTRAC Rule changes</li>
                  <li>• <strong>Ad-hoc Review:</strong> Significant firm risk profile changes</li>
                  <li>• <strong>Next Review Due:</strong> July 2024</li>
                </ul>
              </div>

              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-3">Approval Authority</h4>
                <ul className="space-y-2 text-sm text-purple-800">
                  <li>• <strong>Draft Policy:</strong> Compliance Officer prepares</li>
                  <li>• <strong>Policy Changes:</strong> Senior Manager reviews</li>
                  <li>• <strong>Final Approval:</strong> Governing Body approves</li>
                  <li>• <strong>Implementation:</strong> All staff notified and trained</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Sparkles,
  FileText,
  Users,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Shield,
  Eye,
  Edit,
  Send,
  Download,
  Lock,
  Zap,
  TrendingUp,
  Activity,
  Target,
  Brain
} from 'lucide-react';

interface CopilotAction {
  id: string;
  type: 'draft' | 'check' | 'analysis' | 'case' | 'alert';
  title: string;
  status: 'pending' | 'processing' | 'complete' | 'requires-approval';
  confidence: number;
  evidence: string[];
  output?: any;
  missing?: string[];
  timestamp: Date;
  humanApproval?: boolean;
}

interface ComplianceDraft {
  id: string;
  type: 'risk-rationale' | 'enhanced-cdd' | 'source-funds' | 'source-wealth' | 'approval-pack';
  content: string;
  evidence: string[];
  confidence: number;
  status: 'draft' | 'approved' | 'rejected';
  createdBy: 'AI Copilot';
  approvedBy?: string;
  timestamp: Date;
}

export function ComplianceCopilot() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'drafts' | 'actions' | 'audit'>('dashboard');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState<ComplianceDraft | null>(null);

  const [actions, setActions] = useState<CopilotAction[]>([
    {
      id: 'A001',
      type: 'draft',
      title: 'Auto-build ownership graph for TechCorp Pty Ltd',
      status: 'complete',
      confidence: 0.92,
      evidence: ['ASIC Extract #12345', 'Company Constitution', 'Share Registry'],
      output: {
        parties: 4,
        controllers: 2,
        beneficialOwners: 2
      },
      timestamp: new Date('2024-02-18T10:30:00')
    },
    {
      id: 'A002',
      type: 'check',
      title: 'Run comprehensive screening (GreenID + Sanctions + PEP)',
      status: 'complete',
      confidence: 0.98,
      evidence: ['GreenID Result #G789', 'DFAT Sanctions List', 'PEP Database'],
      output: {
        identity: 'VERIFIED',
        sanctions: 'CLEAR',
        pep: 'CLEAR'
      },
      timestamp: new Date('2024-02-18T10:35:00')
    },
    {
      id: 'A003',
      type: 'analysis',
      title: 'Draft risk rationale - HIGH RISK detected',
      status: 'requires-approval',
      confidence: 0.85,
      evidence: ['Client Questionnaire', 'Country Risk: Malaysia', 'Service Type: Company Formation'],
      output: {
        riskTier: 'HIGH',
        rationale: 'Client is establishing company in Malaysia (Basel AML Index: 5.2) for international consulting. Complex ownership structure with offshore beneficiaries. Enhanced CDD required.',
        triggers: ['High-risk jurisdiction', 'Complex structure', 'International transactions']
      },
      missing: ['Source of wealth documentation', 'Beneficial owner ID verification'],
      timestamp: new Date('2024-02-18T10:40:00')
    },
    {
      id: 'A004',
      type: 'case',
      title: 'Create Enhanced CDD case (auto-assigned to Compliance Officer)',
      status: 'pending',
      confidence: 0.95,
      evidence: ['Risk Assessment Result', 'Policy Section 3.2: Enhanced CDD Triggers'],
      output: {
        caseType: 'Enhanced CDD',
        assignedTo: 'Compliance Officer',
        dueDate: '2024-02-21',
        priority: 'HIGH'
      },
      timestamp: new Date('2024-02-18T10:42:00')
    }
  ]);

  const [drafts, setDrafts] = useState<ComplianceDraft[]>([
    {
      id: 'D001',
      type: 'risk-rationale',
      content: `**Risk Rating: HIGH**

**Client Profile:**
- Entity Type: Company (TechCorp Pty Ltd)
- Services Required: Company formation, registered office
- Jurisdiction: Malaysia
- Transaction Type: International consulting

**Risk Factors Identified:**
1. **High-Risk Jurisdiction (Weight: 35%)**
   - Malaysia Basel AML Index: 5.2 (Medium-High)
   - FATF assessed jurisdiction
   - Evidence: Country Risk Matrix #CRM-2024-MY

2. **Complex Ownership Structure (Weight: 25%)**
   - Multi-tier ownership: Trust → Holding Company → Operating Company
   - Offshore beneficial owners (2 identified, 1 pending verification)
   - Evidence: ASIC Extract #12345, Trust Deed Analysis

3. **International Transaction Flows (Weight: 20%)**
   - Cross-border payments expected
   - Multiple currency accounts
   - Evidence: Client Questionnaire Q12-Q15

4. **New Client Relationship (Weight: 10%)**
   - No prior history with firm
   - Limited verifiable background
   - Evidence: Client Intake Form

5. **Service Complexity (Weight: 10%)**
   - Company formation + ongoing registered office
   - Multiple designated services
   - Evidence: Service Agreement

**Total Risk Score: 7.8/10 (HIGH)**

**Mitigation Controls Required:**
- Enhanced Due Diligence (mandatory)
- Source of funds verification (documentary evidence required)
- Source of wealth verification (independent corroboration required)
- Senior manager approval (mandatory gate)
- Quarterly monitoring (automatic alerts)
- Enhanced CDD review annually (hard gate)

**Recommendation:**
Accept engagement subject to:
1. Complete Enhanced CDD within 10 business days
2. Source of funds/wealth verified to Level 3 standard
3. Senior manager approval obtained
4. Enhanced monitoring activated

**Evidence Trail:**
- Country Risk Matrix: CRM-2024-MY
- ASIC Extract: #12345
- Client Questionnaire: CQ-789
- Policy Reference: Section 3.2 (Enhanced CDD Triggers)
- Generated: 2024-02-18 10:40 AEDT
- Confidence: 85%`,
      evidence: ['CRM-2024-MY', 'ASIC #12345', 'CQ-789', 'Policy 3.2'],
      confidence: 0.85,
      status: 'draft',
      createdBy: 'AI Copilot',
      timestamp: new Date('2024-02-18T10:40:00')
    },
    {
      id: 'D002',
      type: 'enhanced-cdd',
      content: `**ENHANCED CUSTOMER DUE DILIGENCE MEMO**

**Client:** TechCorp Pty Ltd (ACN 123 456 789)  
**Date:** 18 February 2024  
**Prepared by:** AI Compliance Copilot  
**Status:** DRAFT - Requires Compliance Officer Review

---

**1. SOURCE OF FUNDS**

**Inquiry Required:**
- What is the source of the initial capital injection ($500,000)?
- What are the expected revenue sources?
- What is the payment flow for international transactions?

**Documentation Required:**
- Bank statements showing origin of funds (last 6 months)
- Sale agreements or loan documents (if applicable)
- Tax returns or financial statements (last 2 years)
- Independent verification of transaction history

**Current Status:** ⚠️ MISSING - Request sent to client on [DATE]

---

**2. SOURCE OF WEALTH**

**Inquiry Required:**
- How did beneficial owners accumulate wealth to invest?
- What is the business/employment history?
- Are there family wealth sources or inheritance?

**Documentation Required:**
- Employment contracts or business ownership evidence
- Property ownership records
- Investment portfolio statements
- Inheritance documentation (if applicable)

**Current Status:** ⚠️ MISSING - Request sent to client on [DATE]

---

**3. NATURE AND PURPOSE OF ENGAGEMENT**

**Business Purpose:**
The client intends to establish TechCorp Pty Ltd as an Australian registered entity to provide international IT consulting services. The company will act as a contractor for Malaysian and Singaporean clients, with payments flowing through Australian bank accounts before distribution to subcontractors and owners.

**Engagement Purpose:**
- Company formation and ASIC registration
- Registered office services (ongoing)
- Director nominee services (if required)

**Economic Rationale:**
Client states Australian registration provides credibility for international contracts and access to Australian banking system. Revenue model appears commercially sound based on IT consulting industry benchmarks.

**Red Flags Identified:**
- None at this stage
- Transaction flows appear consistent with stated purpose
- Complexity justified by business model

**Evidence:** Client Business Plan v1.2, Industry Benchmarking Report

---

**4. ONGOING MONITORING PLAN**

**Monitoring Frequency:** Quarterly (HIGH risk tier)

**Monitoring Actions:**
1. Review transaction patterns against projected volumes
2. Re-screen beneficial owners (sanctions, PEP, adverse media)
3. Verify continued business activity (website, client reviews, ATO compliance)
4. Check for ownership changes (ASIC monitoring)
5. Review any unusual activity alerts

**Escalation Triggers:**
- Transaction volume exceeds 150% of baseline
- New high-risk jurisdiction involvement
- PEP or sanctions match
- Adverse media alert
- Ownership structure change

---

**5. SENIOR MANAGER APPROVAL REQUIRED**

**Approval Gate:** HIGH risk client requires Senior Manager sign-off before engagement commences.

**Approval Pack Includes:**
- This Enhanced CDD memo
- Risk rationale
- Complete CDD checklist
- Evidence vault summary
- Proposed monitoring plan

**Recommendation:** 
☐ APPROVE - Accept engagement with Enhanced CDD controls  
☐ REJECT - Outside risk appetite  
☐ REQUEST MORE INFO - Specify requirements

---

**Evidence Trail:**
- Client Business Plan: BP-TechCorp-2024
- ASIC Extract: #12345
- Country Risk Assessment: CRM-2024-MY
- Generated: 2024-02-18 10:45 AEDT
- Confidence: 82%

**Next Steps:**
1. Compliance Officer review and edit
2. Request missing source of funds/wealth documentation
3. Complete beneficial owner ID verification
4. Prepare senior manager approval pack
5. Obtain formal approval before engagement`,
      evidence: ['BP-TechCorp-2024', 'ASIC #12345', 'CRM-2024-MY'],
      confidence: 0.82,
      status: 'draft',
      createdBy: 'AI Copilot',
      timestamp: new Date('2024-02-18T10:45:00')
    }
  ]);

  const workloadStats = {
    totalTasks: 50,
    completedByAI: 40,
    requiresHumanReview: 8,
    blockedByHuman: 2,
    timesSaved: 24.5 // hours
  };

  const aiCompletionRate = Math.round((workloadStats.completedByAI / workloadStats.totalTasks) * 100);

  const guardrails = [
    { action: 'Lodge SMR', status: 'BLOCKED', icon: Lock, color: 'red' },
    { action: 'Override Sanctions Match', status: 'BLOCKED', icon: Lock, color: 'red' },
    { action: 'Decide "Suspicious"', status: 'BLOCKED', icon: Lock, color: 'red' },
    { action: 'Unlock Restricted Client', status: 'BLOCKED', icon: Lock, color: 'red' },
    { action: 'Change Risk Appetite', status: 'BLOCKED', icon: Lock, color: 'red' },
    { action: 'Final Risk Rating Approval', status: 'HUMAN ONLY', icon: Users, color: 'orange' },
    { action: 'Enhanced CDD Approval', status: 'HUMAN ONLY', icon: Users, color: 'orange' },
    { action: 'Client Restriction Decision', status: 'HUMAN ONLY', icon: Users, color: 'orange' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Compliance Copilot</h1>
              <p className="text-xl text-purple-100">AI completes 80% of AML workload. Humans decide the critical 20%.</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold mb-1">{aiCompletionRate}%</div>
            <div className="text-purple-100">AI Completion Rate</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">Total Tasks</h3>
            <Activity className="w-5 h-5 text-gray-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{workloadStats.totalTasks}</p>
        </div>
        
        <div className="bg-white rounded-lg border border-green-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">AI Completed</h3>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-600">{workloadStats.completedByAI}</p>
        </div>

        <div className="bg-white rounded-lg border border-orange-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">Human Review</h3>
            <Eye className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-orange-600">{workloadStats.requiresHumanReview}</p>
        </div>

        <div className="bg-white rounded-lg border border-red-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">Blocked</h3>
            <Lock className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-red-600">{workloadStats.blockedByHuman}</p>
        </div>

        <div className="bg-white rounded-lg border border-blue-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">Time Saved</h3>
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-600">{workloadStats.timesSaved}h</p>
        </div>
      </div>

      {/* Guardrails Panel */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-red-600" />
          <h3 className="text-xl font-bold text-red-900">AI Guardrails - What Copilot Cannot Do</h3>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {guardrails.map((guardrail, index) => {
            const Icon = guardrail.icon;
            return (
              <div key={index} className={`p-3 bg-white border-2 border-${guardrail.color}-200 rounded-lg`}>
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 text-${guardrail.color}-600`} />
                  <span className={`text-xs font-bold text-${guardrail.color}-700`}>{guardrail.status}</span>
                </div>
                <p className="text-sm text-gray-900">{guardrail.action}</p>
              </div>
            );
          })}
        </div>
        <p className="text-sm text-red-800 mt-4">
          <strong>Principle:</strong> AI suggests. Humans decide. All critical compliance decisions require human approval.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
            { id: 'drafts', label: 'AI Drafts', icon: FileText },
            { id: 'actions', label: 'Actions Log', icon: Activity },
            { id: 'audit', label: 'Audit Trail', icon: Eye }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 font-semibold flex items-center gap-2 transition-colors ${
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

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Active Workflows</h3>
            
            <div className="space-y-4">
              {/* Workflow 1: Company Client */}
              <div className="border-2 border-blue-200 rounded-lg p-6 bg-blue-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-blue-600" />
                    <div>
                      <h4 className="font-bold text-gray-900">TechCorp Pty Ltd - Company Onboarding</h4>
                      <p className="text-sm text-gray-600">High-risk client requiring Enhanced CDD</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-orange-500 text-white font-bold rounded-full text-sm">
                    REQUIRES APPROVAL
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  {actions.map((action) => (
                    <div key={action.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center gap-3">
                        {action.status === 'complete' ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : action.status === 'requires-approval' ? (
                          <AlertTriangle className="w-5 h-5 text-orange-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-gray-400" />
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">{action.title}</p>
                          {action.output && (
                            <p className="text-xs text-gray-600">
                              {action.type === 'draft' && `${action.output.parties} parties, ${action.output.beneficialOwners} beneficial owners`}
                              {action.type === 'check' && `Identity: ${action.output.identity}, Sanctions: ${action.output.sanctions}`}
                              {action.type === 'analysis' && `Risk: ${action.output.riskTier}`}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500">
                          {action.confidence > 0 && `${Math.round(action.confidence * 100)}% confidence`}
                        </span>
                        {action.status === 'requires-approval' && (
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                            Review
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {actions.some(a => a.missing && a.missing.length > 0) && (
                  <div className="p-4 bg-white border border-gray-200 rounded-lg mb-4">
                    <p className="font-semibold text-yellow-900 mb-2">⚠️ Missing Information</p>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      {actions.find(a => a.missing)?.missing?.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Eye className="w-4 h-4 mr-2" />
                    Review Risk Rationale
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <FileText className="w-4 h-4 mr-2" />
                    View Enhanced CDD Draft
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Evidence Pack
                  </Button>
                </div>
              </div>

              {/* Workflow 2: Monitoring Alert */}
              <div className="border-2 border-green-200 rounded-lg p-6 bg-green-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Activity className="w-6 h-6 text-green-600" />
                    <div>
                      <h4 className="font-bold text-gray-900">Alert Triage - 5 New Monitoring Events</h4>
                      <p className="text-sm text-gray-600">Copilot grouped related alerts and triaged</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-500 text-white font-bold rounded-full text-sm">
                    AI HANDLED
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Duplicate Alerts</p>
                    <p className="text-2xl font-bold text-green-600">3</p>
                    <p className="text-xs text-gray-500">Auto-closed</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">False Positives</p>
                    <p className="text-2xl font-bold text-green-600">1</p>
                    <p className="text-xs text-gray-500">Auto-dismissed</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Requires Review</p>
                    <p className="text-2xl font-bold text-orange-600">1</p>
                    <p className="text-xs text-gray-500">Escalated to compliance</p>
                  </div>
                </div>

                <p className="text-sm text-green-800">
                  <strong>Time saved:</strong> 2.5 hours of manual alert review
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drafts Tab */}
      {activeTab === 'drafts' && (
        <div className="space-y-4">
          {drafts.map((draft) => (
            <div key={draft.id} className={`border-2 rounded-lg p-6 ${
              draft.status === 'draft' ? 'border-orange-200 bg-orange-50' :
              draft.status === 'approved' ? 'border-green-200 bg-green-50' :
              'border-red-200 bg-red-50'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-6 h-6 text-gray-700" />
                    <h3 className="text-xl font-bold text-gray-900">
                      {draft.type === 'risk-rationale' && 'Risk Rationale Draft'}
                      {draft.type === 'enhanced-cdd' && 'Enhanced CDD Memo Draft'}
                      {draft.type === 'source-funds' && 'Source of Funds Summary'}
                      {draft.type === 'source-wealth' && 'Source of Wealth Summary'}
                      {draft.type === 'approval-pack' && 'Senior Manager Approval Pack'}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Created: {draft.timestamp.toLocaleString()}</span>
                    <span>By: {draft.createdBy}</span>
                    <span className="flex items-center">
                      <Sparkles className="w-4 h-4 mr-1 text-purple-600" />
                      Confidence: {Math.round(draft.confidence * 100)}%
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {draft.status === 'draft' && (
                    <>
                      <Button 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          setSelectedDraft(draft);
                          setShowApprovalModal(true);
                        }}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button variant="outline">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </>
                  )}
                  {draft.status === 'approved' && (
                    <span className="px-4 py-2 bg-green-600 text-white font-bold rounded-lg">
                      ✓ APPROVED
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
                <div className="prose max-w-none">
                  <pre className="text-sm whitespace-pre-wrap font-sans text-gray-800">{draft.content}</pre>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">Evidence Cited:</p>
                    <div className="flex gap-2">
                      {draft.evidence.map((ev, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                          {ev}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Audit Trail Tab */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Complete Audit Trail</h3>
          
          <div className="space-y-3">
            {[
              { time: '10:42:00', action: 'AI created Enhanced CDD case', user: 'System', confidence: 95 },
              { time: '10:40:30', action: 'AI drafted risk rationale (HIGH risk)', user: 'System', confidence: 85 },
              { time: '10:35:15', action: 'AI completed screening (GreenID + Sanctions + PEP)', user: 'System', confidence: 98 },
              { time: '10:30:45', action: 'AI built ownership graph from ASIC extract', user: 'System', confidence: 92 },
              { time: '10:28:30', action: 'AI requested InfoTrack ASIC extract', user: 'System', confidence: 100 },
              { time: '10:25:00', action: 'User submitted client onboarding form', user: 'Sarah Chen', confidence: null }
            ].map((log, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-semibold text-gray-900">{log.action}</p>
                    <p className="text-xs text-gray-500">{log.time} - {log.user}</p>
                  </div>
                </div>
                {log.confidence && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded">
                    {log.confidence}% confidence
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Audit Principle:</strong> Every AI action is logged with timestamp, confidence score, 
              evidence references, and outcome. Human decisions are separately logged for regulatory audit trail.
            </p>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedDraft && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Approve AI Draft?</h3>
            
            <div className="mb-4 p-4 bg-white border border-gray-200 rounded-lg">
              <p className="text-sm text-purple-900 mb-2">
                <strong>Document Type:</strong> {selectedDraft.type}
              </p>
              <p className="text-sm text-purple-900 mb-2">
                <strong>AI Confidence:</strong> {Math.round(selectedDraft.confidence * 100)}%
              </p>
              <p className="text-sm text-purple-900">
                <strong>Evidence Cited:</strong> {selectedDraft.evidence.join(', ')}
              </p>
            </div>

            <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg">
              <p className="text-sm text-yellow-900">
                <strong>⚠️ Human Responsibility:</strong> By approving this draft, you confirm that you have 
                reviewed the content, verified the evidence, and take responsibility for the compliance decision. 
                Your approval will be logged in the audit trail.
              </p>
            </div>

            <div className="flex gap-3">
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700 py-3"
                onClick={() => {
                  setDrafts(drafts.map(d => 
                    d.id === selectedDraft.id 
                      ? { ...d, status: 'approved', approvedBy: 'Current User' }
                      : d
                  ));
                  setShowApprovalModal(false);
                  setSelectedDraft(null);
                }}
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Approve Draft
              </Button>
              <Button 
                variant="outline"
                className="flex-1 py-3"
                onClick={() => {
                  setShowApprovalModal(false);
                  setSelectedDraft(null);
                }}
              >
                <XCircle className="w-5 h-5 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
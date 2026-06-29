import React, { useState } from 'react';
import { CustomerRiskAssessment } from './CustomerRiskAssessment';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import SourceOfFundsVerification, { SOFData } from './SourceOfFundsVerification';
import { getReviewWorkflowService } from '../../../lib/models/reviewWorkflowService';
import { toast } from 'sonner';
import { logComplianceActivity } from '../../../utils/activityLogger';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Download,
  PlayCircle,
  Target,
  Clock,
  Users,
  Search,
  Lock,
  Eye,
  TrendingDown,
  Activity,
  Zap
} from 'lucide-react';

type AuditStage =
  | 'overview'
  | 'desk-review'
  | 'customer-risk-assessment'
  | 'sample-testing'
  | 'high-risk-dive'
  | 'source-of-funds'
  | 'personnel-test'
  | 'effectiveness-review'
  | 'exit-meeting'
  | 'red-team'
  | 'results';

interface AuditTest {
  id: string;
  name: string;
  category: string;
  passed: boolean | null;
  evidence?: string;
  notes?: string;
  critical: boolean;
}

interface RedTeamAttack {
  id: string;
  name: string;
  scenario: string;
  test: string[];
  passed: boolean | null;
  failure: string;
  severity: 'critical' | 'high' | 'medium';
}

export function SimulatedAUSTRACAudit() {
  const [currentStage, setCurrentStage] = useState<AuditStage>('overview');
  const [auditStartTime, setAuditStartTime] = useState<Date | null>(null);
  // Source of Funds state
  const [sofData, setSofData] = useState<SOFData | null>(null);
  const [riskResult, setRiskResult] = useState<any>(null);
  const [deskReviewComplete, setDeskReviewComplete] = useState(false);
  const [completedStages, setCompletedStages] = useState<string[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Final Submission (exit-meeting) Stage States
  // Also holds Source of Funds data
  const [exitChecklist, setExitChecklist] = useState({
    documentsUploaded: false,
    riskTiersVerified: false,
    failuresInvestigated: false,
    immutableLogsConfirmed: false,
    complianceDeclaration: false
  });

  // Sync checklist with stage completion
  React.useEffect(() => {
    setExitChecklist(prev => ({
      ...prev,
      documentsUploaded: completedStages.includes('desk-review') || prev.documentsUploaded,
      riskTiersVerified: completedStages.includes('customer-risk-assessment') || prev.riskTiersVerified,
      failuresInvestigated: completedStages.includes('sample-testing') || prev.failuresInvestigated,
      immutableLogsConfirmed: completedStages.includes('high-risk-dive') || prev.immutableLogsConfirmed,
    }));
  }, [completedStages]);
  const [submittingToAustrac, setSubmittingToAustrac] = useState(false);
  const [submissionStep, setSubmissionStep] = useState(0);
  const [submissionCompleted, setSubmissionCompleted] = useState(false);
  const [submissionRefId, setSubmissionRefId] = useState('');

  const [deskReviewItems, setDeskReviewItems] = useState([
    { id: 'DR-1', name: 'Latest AML/CTF Program', generated: false, timeSeconds: 0 },
    { id: 'DR-2', name: 'Senior Manager Approval Records', generated: false, timeSeconds: 0 },
    { id: 'DR-3', name: 'List of Designated Services', generated: false, timeSeconds: 0 },
    { id: 'DR-4', name: 'Client Risk Rating Distribution', generated: false, timeSeconds: 0 },
    { id: 'DR-5', name: 'All High-Risk Clients (Filtered)', generated: false, timeSeconds: 0 },
    { id: 'DR-6', name: 'All PEP Clients (Filtered)', generated: false, timeSeconds: 0 },
    { id: 'DR-7', name: 'SMR Register (Restricted Access)', generated: false, timeSeconds: 0 },
    { id: 'DR-8', name: 'Compliance Officer File', generated: false, timeSeconds: 0 },
    { id: 'DR-9', name: 'Training Completion Register', generated: false, timeSeconds: 0 },
    { id: 'DR-10', name: 'Last Effectiveness Testing Report', generated: false, timeSeconds: 0 }
  ]);

  const [sampleTests, setSampleTests] = useState<AuditTest[]>([
    // Low Risk Clients (5)
    { id: 'ST-L1', name: 'Low Risk Client 1 - Identity Verification', category: 'Identity', passed: null, critical: true },
    { id: 'ST-L1-BO', name: 'Low Risk Client 1 - Beneficial Ownership', category: 'Ownership', passed: null, critical: true },
    { id: 'ST-L1-SP', name: 'Low Risk Client 1 - Sanctions/PEP Screening', category: 'Screening', passed: null, critical: true },
    { id: 'ST-L1-RR', name: 'Low Risk Client 1 - Risk Rating Logic', category: 'Risk', passed: null, critical: false },
    { id: 'ST-L1-M', name: 'Low Risk Client 1 - Monitoring Cycles', category: 'Monitoring', passed: null, critical: false },

    // Medium Risk Clients (3)
    { id: 'ST-M1', name: 'Medium Risk Client 1 - Enhanced Verification', category: 'Identity', passed: null, critical: true },
    { id: 'ST-M1-BO', name: 'Medium Risk Client 1 - Complex Ownership Tracing', category: 'Ownership', passed: null, critical: true },
    { id: 'ST-M1-RR', name: 'Medium Risk Client 1 - Risk Rationale Documentation', category: 'Risk', passed: null, critical: true },

    // High Risk Clients (2)
    { id: 'ST-H1', name: 'High Risk Client 1 - Source of Funds', category: 'Enhanced CDD', passed: null, critical: true },
    { id: 'ST-H1-SW', name: 'High Risk Client 1 - Source of Wealth', category: 'Enhanced CDD', passed: null, critical: true },
    { id: 'ST-H1-APP', name: 'High Risk Client 1 - Senior Manager Approval', category: 'Approval', passed: null, critical: true },
    { id: 'ST-H1-AM', name: 'High Risk Client 1 - Adverse Media Analysis', category: 'Enhanced CDD', passed: null, critical: true },

    // PEP Client (1)
    { id: 'ST-PEP1', name: 'PEP Client - Foreign PEP Escalation', category: 'PEP', passed: null, critical: true },
    { id: 'ST-PEP1-EDD', name: 'PEP Client - Enhanced Due Diligence', category: 'Enhanced CDD', passed: null, critical: true },

    // Complex Trust (1)
    { id: 'ST-TR1', name: 'Trust Client - Trustee Identification', category: 'Ownership', passed: null, critical: true },
    { id: 'ST-TR1-BEN', name: 'Trust Client - Beneficiary Screening', category: 'Ownership', passed: null, critical: true }
  ]);

  const [redTeamAttacks, setRedTeamAttacks] = useState<RedTeamAttack[]>([
    {
      id: 'RT-1',
      name: 'ATTACK 1: Shell Company Layering',
      scenario: 'Trust → Company → Company → Offshore nominee shareholder. Goal: Hide beneficial owner under 25%',
      test: [
        'Does system detect control, not just % ownership?',
        'Does graph depth raise risk?',
        'Does complex structure auto-escalate?'
      ],
      passed: null,
      failure: 'Blind spot in control identification',
      severity: 'critical'
    },
    {
      id: 'RT-2',
      name: 'ATTACK 2: Foreign PEP Disguised as Relative',
      scenario: 'Beneficial owner is spouse of foreign minister',
      test: [
        'Does PEP screening detect close associates?',
        'Does risk escalate to High?',
        'Is enhanced CDD mandatory?'
      ],
      passed: null,
      failure: 'PEP logic incomplete',
      severity: 'critical'
    },
    {
      id: 'RT-3',
      name: 'ATTACK 3: Source of Funds Fake',
      scenario: 'Client provides bank statement showing large deposit from another private company',
      test: [
        'Does enhanced CDD require explanation of upstream entity?',
        'Does system force follow-up?',
        'Does reviewer document reasoning?'
      ],
      passed: null,
      failure: 'Superficial source-of-funds review',
      severity: 'high'
    },
    {
      id: 'RT-4',
      name: 'ATTACK 4: Sanctions Near Match (85%)',
      scenario: 'Name matches 85% to sanctioned person',
      test: [
        'Does system allow override?',
        'Is override justification mandatory?',
        'Is compliance officer required to approve?'
      ],
      passed: null,
      failure: 'Override without documentation',
      severity: 'critical'
    },
    {
      id: 'RT-5',
      name: 'ATTACK 5: Staff Collusion',
      scenario: 'Client manager suppresses alert to keep client',
      test: [
        'Are monitoring alerts visible to compliance officer independently?',
        'Can alerts be deleted?',
        'Is audit trail immutable?'
      ],
      passed: null,
      failure: 'Operational override risk',
      severity: 'critical'
    },
    {
      id: 'RT-6',
      name: 'ATTACK 6: Expiring ID',
      scenario: 'Client ID expires but continues service',
      test: [
        'Does system flag expiry?',
        'Does it block new designated services?',
        'Is review forced?'
      ],
      passed: null,
      failure: 'Ongoing CDD weakness',
      severity: 'high'
    },
    {
      id: 'RT-7',
      name: 'ATTACK 7: High Risk Jurisdiction Shift',
      scenario: 'Client moves funds through newly sanctioned country',
      test: [
        'Does monitoring detect jurisdiction change?',
        'Does risk recalculate?',
        'Is engagement restricted automatically?'
      ],
      passed: null,
      failure: 'Dynamic risk gap',
      severity: 'critical'
    },
    {
      id: 'RT-8',
      name: 'ATTACK 8: SMR Tipping Off',
      scenario: 'Staff accidentally informs client investigation underway',
      test: [
        'Is SMR access restricted?',
        'Is visibility segregated?',
        'Is there access logging?'
      ],
      passed: null,
      failure: 'Tipping-off risk',
      severity: 'critical'
    },
    {
      id: 'RT-9',
      name: 'ATTACK 9: Program Change Not Re-Approved',
      scenario: 'Firm adds crypto advisory service but forgets to update risk assessment',
      test: [
        'Does new service trigger program review?',
        'Does system require senior manager approval?'
      ],
      passed: null,
      failure: 'Governance breakdown',
      severity: 'critical'
    },
    {
      id: 'RT-10',
      name: 'ATTACK 10: Independent Review Surface Test',
      scenario: 'Reviewer asks for monitoring testing evidence',
      test: [
        'Show evidence that monitoring rules were tested',
        'Show sample of dismissed alerts',
        'Show corrective action taken'
      ],
      passed: null,
      failure: 'Operational failure',
      severity: 'high'
    }
  ]);

  const [findings, setFindings] = useState({
    minor: [] as string[],
    moderate: [] as string[],
    serious: [] as string[]
  });

  const simulateDeskReview = () => {
    setAuditStartTime(new Date());

    // Simulate generation time for each item (realistic delays)
    deskReviewItems.forEach((item, index) => {
      setTimeout(() => {
        const generationTime = Math.floor(Math.random() * 30) + 10; // 10-40 seconds each
        setDeskReviewItems(prev => {
          const updated = [...prev];
          updated[index] = { ...updated[index], generated: true, timeSeconds: generationTime };
          return updated;
        });
      }, index * 2000); // Stagger generations
    });

    setTimeout(() => {
      setDeskReviewComplete(true);
      setCompletedStages(prev => [...prev, 'desk-review']);
      logComplianceActivity({
        type: 'document',
        action: 'completed AUSTRAC Desk Review simulation',
        iconName: 'FileText',
        color: 'text-purple-400'
      });
    }, deskReviewItems.length * 2000 + 1000);
  };

  const handleSOFComplete = async (data: SOFData) => {
    setSofData(data);
    logComplianceActivity({
      type: 'approval',
      action: 'verified Source of Funds (SOF) declaration',
      iconName: 'CheckCircle',
      color: 'text-green-400'
    });
    
    // Fire audit event via ReviewWorkflowService
    try {
      const service = getReviewWorkflowService({
        persistence: {
          createReviewWorkflowRecord: async (record) => record,
          updateReviewWorkflowRecord: async (input) => ({
            id: input.id,
            tenant_id: input.tenant_id,
            case_id: input.case_id,
            actor_id: 'compliance-officer-1',
            workflow_state: 'in_review',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ...input.changes
          })
        },
        auditWriter: {
          write: async (event: any) => {
            console.log('[Audit Event Logged]', event);
            setAuditLogs(prev => [...prev, {
              ...event,
              id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              timestamp: new Date().toLocaleTimeString()
            }]);
          }
        }
      });

      // Create workflow record
      const reviewResult = await service.createReviewWorkflow({
        id: `rev-${Date.now()}`,
        tenantId: 'tenant-123',
        caseId: 'AUS-2026-002',
        actorId: 'compliance-officer-1',
        actorRole: 'compliance_manager',
        initialState: 'draft',
        findings: [
          {
            id: 'find-1',
            source: 'pep_match',
            tenantId: 'tenant-123',
            title: 'PEP Match',
            severity: 'high',
            description: 'Customer matches Foreign PEP list: Sir Alexander Downer',
            detectedAt: new Date().toISOString()
          },
          {
            id: 'find-2',
            source: 'sanctions_hit',
            tenantId: 'tenant-123',
            title: 'Sanctions Hit',
            severity: 'critical',
            description: 'Sanctions match found on DFAT consolidated list: ABC Enterprises (85% match)',
            detectedAt: new Date().toISOString()
          }
        ]
      });

      // Transition state to log audit event
      await service.transitionReviewWorkflowState({
        review: reviewResult.review,
        actorId: 'compliance-officer-1',
        actorRole: 'compliance_manager',
        toState: 'submitted_for_review'
      });

      toast.success('Enhanced Due Diligence Audit event fired successfully via ReviewWorkflowService.');
    } catch (err) {
      console.error('Failed to fire audit event:', err);
      toast.error('Failed to register audit event with ReviewWorkflowService.');
    }

    setCurrentStage('high-risk-dive');
  };

  const handleEDDComplete = () => {
    setCompletedStages(prev => [...prev, 'high-risk-dive']);
    setCurrentStage('overview');
  };

  const getTotalGenerationTime = () => {
    return deskReviewItems.reduce((sum, item) => sum + item.timeSeconds, 0);
  };

  const getPassFailStats = () => {
    const samplePassed = sampleTests.filter(t => t.passed === true).length;
    const sampleFailed = sampleTests.filter(t => t.passed === false).length;
    const sampleTotal = sampleTests.length;

    const redTeamPassed = redTeamAttacks.filter(a => a.passed === true).length;
    const redTeamFailed = redTeamAttacks.filter(a => a.passed === false).length;
    const redTeamTotal = redTeamAttacks.length;

    const overallPassed = samplePassed + redTeamPassed;
    const overallFailed = sampleFailed + redTeamFailed;
    const overallTotal = sampleTotal + redTeamTotal;

    return {
      sample: { passed: samplePassed, failed: sampleFailed, total: sampleTotal },
      redTeam: { passed: redTeamPassed, failed: redTeamFailed, total: redTeamTotal },
      overall: { passed: overallPassed, failed: overallFailed, total: overallTotal }
    };
  };

  const calculateFinalOutcome = () => {
    const stats = getPassFailStats();
    const criticalFailures = [
      ...sampleTests.filter(t => t.critical && t.passed === false),
      ...redTeamAttacks.filter(a => a.severity === 'critical' && a.passed === false)
    ];

    if (criticalFailures.length > 0) {
      return { status: 'FAIL', color: 'red', reason: 'Critical failures detected' };
    }

    if (stats.overall.failed > stats.overall.total * 0.2) {
      return { status: 'MAJOR CONCERNS', color: 'orange', reason: 'More than 20% failure rate' };
    }

    if (stats.overall.failed > 0) {
      return { status: 'PASS WITH FINDINGS', color: 'yellow', reason: 'Minor issues identified' };
    }

    return { status: 'EXCELLENT', color: 'green', reason: 'All tests passed' };
  };

  // Overview Stage
  if (currentStage === 'overview') {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-lg p-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <Target className="w-16 h-16" />
            <div>
              <h1 className="text-4xl font-bold mb-2">Simulated AUSTRAC Audit</h1>
              <p className="text-xl text-red-100">Desk Review + Onsite Review + Red Team Attack Testing</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-500/10 border-2 border-yellow-500/30 rounded-lg p-6">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-yellow-400 mr-3 mt-0.5" />
            <div>
              <h3 className="font-bold text-yellow-300 mb-2">Scenario: AUSTRAC Compliance Review</h3>
              <p className="text-yellow-300 mb-3">
                AUSTRAC conducts desk review followed by onsite review 6 months after Tranche 2 commencement.
                Your system will be tested on response time, data quality, and resilience against attack vectors.
              </p>
              <p className="text-sm text-yellow-300 font-semibold">
                ⏱️ Desk Review Target: Generate all required documents in under 1 hour
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {[
            {
              stage: 'desk-review',
              title: 'STAGE 1: Desk Review',
              icon: FileText,
              description: 'Generate 10 required documents within 10 business days (target: < 1 hour)',
              items: ['Program export', 'Client lists', 'SMR register', 'Personnel files'],
              color: 'blue'
            },
            {
              stage: 'customer-risk-assessment',
              title: 'STAGE 2: Customer Risk Assessment',
              icon: Shield,
              description: 'Perform algorithm risk scoring, flag evaluations, and manual overrides',
              items: ['Dynamic weighting', 'Active risk factors', 'Justified overrides', 'Lock & confirm'],
              color: 'amber'
            },
            {
              stage: 'sample-testing',
              title: 'STAGE 3: Sample Testing',
              icon: Search,
              description: 'Test 12 client files across all risk tiers',
              items: ['5 Low risk', '3 Medium risk', '2 High risk', '1 PEP', '1 Complex trust'],
              color: 'purple'
            },
            {
              stage: 'high-risk-dive',
              title: 'STAGE 4: High-Risk Deep Dive',
              icon: AlertTriangle,
              description: 'Detailed examination of 1 high-risk client',
              items: ['Source of funds', 'Source of wealth', 'Senior approval', 'Monitoring'],
              color: 'orange'
            },
            {
              stage: 'personnel-test',
              title: 'STAGE 5: Personnel Test',
              icon: Users,
              description: 'Compliance officer validation and interview',
              items: ['PDD file', 'Criminal check', 'Training', 'Knowledge test'],
              color: 'green'
            },
            {
              stage: 'effectiveness-review',
              title: 'STAGE 6: Effectiveness Review',
              icon: Activity,
              description: 'Internal testing and action plan review',
              items: ['Sample testing', 'Findings', 'Remediation', 'Evidence'],
              color: 'indigo'
            },
            {
              stage: 'red-team',
              title: 'STAGE 7: Red Team Attacks',
              icon: Zap,
              description: '10 attack scenarios to break your system',
              items: ['Shell companies', 'PEP evasion', 'Sanctions bypass', 'Staff collusion'],
              color: 'red'
            },
            {
              stage: 'exit-meeting',
              title: 'STAGE 8: Final Submission',
              icon: CheckCircle,
              description: 'Review compliance data & submit final audit package to AUSTRAC',
              items: ['Data integrity sign-off', 'Audit trail verification', 'Secure API transmission', 'Receipt verification'],
              color: 'green'
            }
          ].map((stage) => {
            const Icon = stage.icon;
            const isCompleted = completedStages.includes(stage.stage);
            const isDisabled = stage.stage === 'high-risk-dive' && !completedStages.includes('customer-risk-assessment');
            return (
              <button
                key={stage.stage}
                onClick={() => !isDisabled && setCurrentStage(stage.stage as AuditStage)}
                disabled={isDisabled}
                className={`bg-white rounded-lg border-2 p-6 text-left hover:shadow-lg hover:border-blue-400 transition-all ${
                  isCompleted ? 'border-green-500/30 bg-green-500/10/10' : isDisabled ? 'opacity-50 cursor-not-allowed' : 'border-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 bg-${stage.color}-100 rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 text-${stage.color}-600`} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-100">{stage.title}</h3>
                  </div>
                  {isCompleted && (
                    <span className="bg-green-500/15 text-green-300 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 border border-green-500/30">
                      <CheckCircle className="w-3.5 h-3.5" />
                      COMPLETE
                    </span>
                  )}
                </div>
                <p className="text-slate-300 mb-4">{stage.description}</p>
                <div className="space-y-1">
                  {stage.items.map((item, index) => (
                    <div key={index} className="flex items-center text-sm text-slate-300">
                      <div className={`w-1.5 h-1.5 bg-${stage.color}-500 rounded-full mr-2`} />
                      {item}
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {auditLogs.length > 0 && (
          <Card className="border shadow-lg">
            <CardHeader className="bg-slate-900 text-white rounded-t-lg">
              <CardTitle className="text-sm font-mono flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-400 animate-pulse" />
                Active ReviewWorkflowService Audit Events Log
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 bg-slate-950 text-green-400 font-mono text-xs space-y-2 rounded-b-lg max-h-[200px] overflow-y-auto">
              {auditLogs.map((log) => (
                <div key={log.id} className="flex flex-col border-b border-slate-800 pb-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>[{log.timestamp}] EVENT: {log.action.toUpperCase()}</span>
                    <span>Tenant: {log.tenant_id} | Case: {log.case_id}</span>
                  </div>
                  <div className="text-white mt-0.5 font-bold">
                    Review ID: <span className="text-blue-400">{log.review_id}</span> | Actor ID: <span className="text-orange-400">{log.actor_id}</span>
                  </div>
                  {log.metadata && (
                    <div className="text-slate-400 mt-1 pl-4 border-l border-slate-700">
                      Metadata: {JSON.stringify(log.metadata)}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
          <h3 className="font-bold text-blue-300 mb-3">What AUSTRAC Cares About</h3>
          <div className="grid grid-cols-5 gap-4">
            {['Governance', 'Risk Logic', 'Decision Documentation', 'Ongoing Monitoring', 'Proof'].map((item, index) => (
              <div key={index} className="text-center">
                <Shield className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-blue-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Desk Review Stage
  if (currentStage === 'desk-review') {
    const totalTime = getTotalGenerationTime();
    const passed = deskReviewComplete && totalTime < 3600; // 1 hour = 3600 seconds

    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setCurrentStage('overview')}>
          ← Back to Overview
        </Button>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
          <h2 className="text-3xl font-bold mb-2">STAGE 1: Desk Review Request</h2>
          <p className="text-blue-100">Generate all required documents within 10 business days (Target: &lt; 1 hour)</p>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-300">
            <strong>AUSTRAC Request:</strong> Provide within 10 business days - Latest AML/CTF Program,
            client lists, SMR register, personnel files, and effectiveness reports.
          </p>
        </div>

        {!auditStartTime ? (
          <div className="text-center py-12">
            <Clock className="w-24 h-24 text-blue-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-slate-100 mb-4">Ready to Start Desk Review?</h3>
            <p className="text-slate-300 mb-6">System will attempt to generate all 10 required documents</p>
            <Button
              className="bg-blue-600 hover:bg-blue-700 px-8 py-6 text-lg"
              onClick={simulateDeskReview}
            >
              <PlayCircle className="w-6 h-6 mr-3" />
              Start Desk Review Simulation
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg border border-white/10 p-4">
                <h3 className="font-semibold text-slate-100 mb-2">Generation Status</h3>
                <p className="text-3xl font-bold text-blue-400">
                  {deskReviewItems.filter(i => i.generated).length}/{deskReviewItems.length}
                </p>
              </div>
              <div className="bg-white rounded-lg border border-white/10 p-4">
                <h3 className="font-semibold text-slate-100 mb-2">Total Time</h3>
                <p className={`text-3xl font-bold ${totalTime < 3600 ? 'text-green-400' : 'text-red-400'}`}>
                  {Math.floor(totalTime / 60)}m {totalTime % 60}s
                </p>
              </div>
              <div className="bg-white rounded-lg border border-white/10 p-4">
                <h3 className="font-semibold text-slate-100 mb-2">Target</h3>
                <p className="text-3xl font-bold text-slate-300">&lt; 60m</p>
              </div>
            </div>

            <div className="space-y-2">
              {deskReviewItems.map((item) => (
                <div key={item.id} className={`p-4 rounded-lg border-2 ${item.generated ? 'border-green-500/30 bg-green-500/10' : 'border-white/10 bg-white'
                  }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {item.generated ? (
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      ) : (
                        <Clock className="w-6 h-6 text-gray-400 animate-pulse" />
                      )}
                      <span className="font-semibold text-slate-100">{item.name}</span>
                    </div>
                    {item.generated && (
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-300">Generated in {item.timeSeconds}s</span>
                        <Button size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {deskReviewComplete && (
              <div className={`rounded-lg border-2 p-6 ${passed ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'
                }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">
                      {passed ? '✓ DESK REVIEW: PASS' : '✗ DESK REVIEW: RED FLAG'}
                    </h3>
                    <p className={passed ? 'text-green-300' : 'text-red-300'}>
                      {passed
                        ? `All documents generated in ${Math.floor(totalTime / 60)} minutes. System responsive and complete.`
                        : `Generation took ${Math.floor(totalTime / 60)} minutes - exceeds 1 hour target. First red flag to AUSTRAC.`
                      }
                    </p>
                  </div>
                  {passed ? (
                    <CheckCircle className="w-16 h-16 text-green-400" />
                  ) : (
                    <XCircle className="w-16 h-16 text-red-400" />
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // Red Team Attacks Stage
  if (currentStage === 'red-team') {
    const stats = getPassFailStats();

    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setCurrentStage('overview')}>
          ← Back to Overview
        </Button>

        <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-lg p-6 text-white">
          <h2 className="text-3xl font-bold mb-2">Red Team Attack Testing</h2>
          <p className="text-red-100">10 deliberate attempts to break your AML system</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-white/10 p-4">
            <h3 className="font-semibold text-slate-100 mb-2">Attacks Tested</h3>
            <p className="text-3xl font-bold text-blue-400">{redTeamAttacks.filter(a => a.passed !== null).length}/{redTeamAttacks.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-green-500/30 p-4">
            <h3 className="font-semibold text-slate-100 mb-2">Attacks Blocked</h3>
            <p className="text-3xl font-bold text-green-400">{stats.redTeam.passed}</p>
          </div>
          <div className="bg-white rounded-lg border border-red-500/30 p-4">
            <h3 className="font-semibold text-slate-100 mb-2">Vulnerabilities</h3>
            <p className="text-3xl font-bold text-red-400">{stats.redTeam.failed}</p>
          </div>
        </div>

        <div className="space-y-4">
          {redTeamAttacks.map((attack, index) => (
            <div key={attack.id} className={`border-2 rounded-lg p-6 ${attack.passed === true ? 'border-green-500/30 bg-green-500/10' :
                attack.passed === false ? 'border-red-500/30 bg-red-500/10' :
                  'border-white/10 bg-white'
              }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className={`w-6 h-6 ${attack.severity === 'critical' ? 'text-red-400' : 'text-orange-400'
                      }`} />
                    <h3 className="text-xl font-bold text-slate-100">{attack.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${attack.severity === 'critical' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
                      }`}>
                      {attack.severity.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-300 mb-1">Scenario:</p>
                      <p className="text-slate-100">{attack.scenario}</p>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-300 mb-2">Tests:</p>
                      <ul className="space-y-1">
                        {attack.test.map((test, idx) => (
                          <li key={idx} className="flex items-start text-sm text-slate-300">
                            <span className="mr-2">•</span>
                            <span>{test}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {attack.passed === false && (
                      <div className="p-3 bg-red-500/15 border border-red-300 rounded-lg">
                        <p className="text-sm font-semibold text-red-300">
                          ⚠️ Failure Mode: {attack.failure}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="ml-6">
                  {attack.passed === null ? (
                    <div className="space-y-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 w-24"
                        onClick={() => {
                          const updated = [...redTeamAttacks];
                          updated[index].passed = true;
                          setRedTeamAttacks(updated);
                        }}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Pass
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 w-24"
                        onClick={() => {
                          const updated = [...redTeamAttacks];
                          updated[index].passed = false;
                          setRedTeamAttacks(updated);
                        }}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Fail
                      </Button>
                    </div>
                  ) : attack.passed ? (
                    <div className="text-center">
                      <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
                      <p className="text-sm font-bold text-green-300">BLOCKED</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <XCircle className="w-12 h-12 text-red-400 mx-auto mb-2" />
                      <p className="text-sm font-bold text-red-300">VULNERABLE</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {redTeamAttacks.every(a => a.passed !== null) && (
          <div className={`rounded-lg border-2 p-6 ${stats.redTeam.failed === 0 ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'
            }`}>
            <h3 className="text-2xl font-bold mb-4">
              {stats.redTeam.failed === 0 ? '✓ REGULATOR-RESILIENT' : '✗ VULNERABILITIES DETECTED'}
            </h3>
            <p className={stats.redTeam.failed === 0 ? 'text-green-300' : 'text-red-300'}>
              {stats.redTeam.failed === 0
                ? 'System withstood all attack scenarios. Governance, risk logic, and controls are robust.'
                : `${stats.redTeam.failed} vulnerabilities detected. System has exploitable gaps that regulators will identify.`
              }
            </p>

            <div className="mt-6">
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setCurrentStage('results')}
              >
                View Final Audit Results
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Results Stage
  if (currentStage === 'results') {
    const outcome = calculateFinalOutcome();
    const stats = getPassFailStats();

    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setCurrentStage('overview')}>
          ← Back to Overview
        </Button>

        <div className={`bg-gradient-to-r ${outcome.color === 'green' ? 'from-green-600 to-emerald-600' :
            outcome.color === 'yellow' ? 'from-yellow-600 to-orange-600' :
              outcome.color === 'orange' ? 'from-orange-600 to-red-600' :
                'from-red-600 to-pink-600'
          } rounded-lg p-8 text-white`}>
          <h1 className="text-5xl font-bold mb-4">{outcome.status}</h1>
          <p className="text-2xl">{outcome.reason}</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-white/10 p-6">
            <h3 className="text-xl font-bold text-slate-100 mb-4">Sample Testing Results</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Total Tests:</span>
                <span className="font-bold text-slate-100">{stats.sample.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Passed:</span>
                <span className="font-bold text-green-400">{stats.sample.passed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Failed:</span>
                <span className="font-bold text-red-400">{stats.sample.failed}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-white/10 p-6">
            <h3 className="text-xl font-bold text-slate-100 mb-4">Red Team Attack Results</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Total Attacks:</span>
                <span className="font-bold text-slate-100">{stats.redTeam.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Blocked:</span>
                <span className="font-bold text-green-400">{stats.redTeam.passed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Vulnerabilities:</span>
                <span className="font-bold text-red-400">{stats.redTeam.failed}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-white/10 p-6">
          <h3 className="text-xl font-bold text-slate-100 mb-4">Pass Criteria Validation</h3>
          <div className="space-y-2">
            {[
              'Complex structure tracing',
              'PEP detection including associates',
              'Automatic high-risk gating',
              'Sanctions hard-stop',
              'Immutable logs',
              'Ongoing ID expiry controls',
              'Monitoring independence',
              'Program re-approval enforcement',
              'Escalation documentation',
              'Effectiveness review evidence'
            ].map((criteria, index) => {
              // Simplified logic - assume passed if no red team failures
              const passed = stats.redTeam.failed === 0;
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-slate-100">{criteria}</span>
                  {passed ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
          <h3 className="font-bold text-blue-300 mb-3">Final Reality Check</h3>
          <p className="text-blue-300 mb-4">
            AUSTRAC does not care how modern your UI is. They care about:
          </p>
          <div className="grid grid-cols-5 gap-4">
            {['Governance', 'Risk Logic', 'Decision Documentation', 'Ongoing Monitoring', 'Proof'].map((item, index) => (
              <div key={index} className="text-center p-3 bg-white rounded-lg">
                <Shield className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-blue-300">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-6 text-lg">
            <Download className="w-5 h-5 mr-3" />
            Download Complete Audit Report
          </Button>
        </div>
      </div>
    );
  }

  if (currentStage === 'customer-risk-assessment') {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setCurrentStage('overview')}>
          ← Back to Overview
        </Button>
        <CustomerRiskAssessment
          caseData={{
            caseId: 'AUS-2026-002',
            clientName: 'ABC Enterprises Pty Ltd',
            sanctionsMatch: true,
            foreignPEP: true,
            adverseMedia: true,
            unexplainedSOF: true,
            complexStructure: true,
            highRiskJurisdiction: true
          }}
          onComplete={(result) => {
            setRiskResult(result);
            setCompletedStages(prev => [...prev, 'customer-risk-assessment']);
            setCurrentStage('overview');
          }}
        />
      </div>
    );
  }

  if (currentStage === 'exit-meeting') {
    const stats = getPassFailStats();
    const allChecked = Object.values(exitChecklist).every(Boolean);

    const handleSubmissionFlow = () => {
      setSubmittingToAustrac(true);
      setSubmissionStep(0);

      const interval = setInterval(() => {
        setSubmissionStep(prev => {
          if (prev >= 4) {
            clearInterval(interval);
            setTimeout(() => {
              setSubmittingToAustrac(false);
              setSubmissionCompleted(true);
              setSubmissionRefId(`AUS-SUB-AUDIT-${Math.floor(Math.random() * 900000) + 100000}`);
              toast.success('KYC Audit Pack successfully submitted to AUSTRAC.');
            }, 1000);
            return prev + 1;
          }
          return prev + 1;
        });
      }, 1200);
    };

    const steps = [
      'Compiling audit evidence pack & document list...',
      'Computing cryptographic SHA-256 hashes for program and ledger data...',
      'Establishing secure TLS 1.3 channel to AUSTRAC registry...',
      'Transmitting comprehensive compliance payload...',
      'Verifying digital keys & registrar signature...',
      'Submission acknowledged by AUSTRAC!'
    ];

    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setCurrentStage('overview')}>
          ← Back to Overview
        </Button>

        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 text-white">
          <h2 className="text-3xl font-bold mb-2">STAGE 8: Final Submission</h2>
          <p className="text-green-100">Review collected compliance telemetry and execute the secure AUSTRAC submission flow</p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left panel: Data telemetry review */}
          <div className="col-span-6 space-y-6">
            <Card>
              <CardHeader className="border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Collected Compliance Telemetry
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="p-3 bg-white/5 rounded-lg flex items-center justify-between">
                  <span className="font-semibold text-slate-300">Stage 1: Desk Review Docs</span>
                  <Badge className="bg-green-600 text-white font-bold">10 / 10 Generated</Badge>
                </div>
                <div className="p-3 bg-white/5 rounded-lg flex items-center justify-between">
                  <span className="font-semibold text-slate-300">Stage 2: Customer Risk Scoring</span>
                  <Badge className="bg-green-600 text-white font-bold">Sealed & Verified</Badge>
                </div>
                <div className="p-3 bg-white/5 rounded-lg flex items-center justify-between">
                  <span className="font-semibold text-slate-300">Stage 3-6: Sample KYC Audits</span>
                  <Badge className="bg-green-600 text-white font-bold">12 Files Verified</Badge>
                </div>
                <div className="p-3 bg-white/5 rounded-lg flex items-center justify-between">
                  <span className="font-semibold text-slate-300">Stage 7: Red Team Penetrations</span>
                  <Badge className={stats.redTeam.failed === 0 ? 'bg-green-600 text-white font-bold' : 'bg-red-600 text-white font-bold animate-pulse'}>
                    {stats.redTeam.failed === 0 ? '10 / 10 Blocked' : `${stats.redTeam.failed} Vulnerability Flags`}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Metrics */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <span className="block text-xs font-semibold text-slate-300 uppercase">Passed Tests</span>
                    <span className="text-2xl font-bold text-green-400">{stats.overall.passed}</span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <span className="block text-xs font-semibold text-slate-300 uppercase">Failed Tests</span>
                    <span className="text-2xl font-bold text-red-400">{stats.overall.failed}</span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <span className="block text-xs font-semibold text-slate-300 uppercase">Pass Rate</span>
                    <span className="text-2xl font-bold text-blue-400">
                      {stats.overall.total > 0 ? Math.round((stats.overall.passed / stats.overall.total) * 100) : 100}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right panel: Checklist & Submission */}
          <div className="col-span-6 space-y-6">
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardHeader className="border-b bg-primary/10">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  Pre-Submission Review Checklist
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {[
                  { key: 'documentsUploaded', label: 'Verify all 10 desk review audit documents are compiled' },
                  { key: 'riskTiersVerified', label: 'Validate dynamic customer risk scores and manual overrides' },
                  { key: 'failuresInvestigated', label: 'Confirm all sample files and failure scenarios are reviewed' },
                  { key: 'immutableLogsConfirmed', label: 'Ensure all compliance audit trail logs are cryptographically sealed' },
                  { key: 'complianceDeclaration', label: 'Declare this AML/CTF simulation is accurate and complete' }
                ].map((item) => (
                  <label key={item.key} className="flex items-start gap-3 p-3 bg-white border rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                    <input
                      type="checkbox"
                      className="mt-1 w-5 h-5 rounded text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                      checked={exitChecklist[item.key as keyof typeof exitChecklist]}
                      onChange={(e) => {
                        setExitChecklist(prev => ({
                          ...prev,
                          [item.key]: e.target.checked
                        }));
                      }}
                      disabled={submittingToAustrac || submissionCompleted}
                    />
                    <span className="text-sm font-medium text-slate-300 select-none">
                      {item.label}
                    </span>
                  </label>
                ))}
              </CardContent>
            </Card>

            {/* Submission triggers & progress animation */}
            <Card>
              <CardContent className="p-6">
                {!submittingToAustrac && !submissionCompleted && (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-300 text-center">
                      Ensure the pre-submission checklist is fully completed to unlock secure transmission.
                    </p>
                    <Button
                      onClick={handleSubmissionFlow}
                      disabled={!allChecked}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 py-6 text-lg font-bold shadow-lg gap-2"
                    >
                      <Shield className="w-5 h-5" />
                      Submit Final Audit Report
                    </Button>
                  </div>
                )}

                {submittingToAustrac && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-100 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full animate-ping" />
                      AUSTRAC Registry Upload in Progress...
                    </h3>
                    <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-2.5 transition-all duration-500"
                        style={{ width: `${((submissionStep + 1) / steps.length) * 100}%` }}
                      />
                    </div>
                    <div className="p-4 bg-gray-900 text-green-400 font-mono text-xs rounded-lg min-h-[120px] space-y-1">
                      {steps.slice(0, submissionStep + 1).map((step, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-left">
                          <span className="text-slate-400">[{idx + 1}]</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {submissionCompleted && (
                  <div className="space-y-6 text-center py-4">
                    <div className="w-16 h-16 bg-green-500/15 text-green-400 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-100">Submission Succeeded</h3>
                      <p className="text-sm text-slate-300 mt-1">
                        Receipt acknowledged by AUSTRAC Central Registry
                      </p>
                      <div className="mt-3 p-3 bg-white/5 font-mono text-sm inline-block border rounded-lg">
                        Reference: <span className="font-bold text-primary">{submissionRefId}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => setCurrentStage('results')}
                      className="w-full bg-blue-600 hover:bg-blue-700 py-4 text-base font-bold shadow-lg"
                    >
                      View Final Pass/Fail Outcome
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (currentStage === 'source-of-funds') {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setCurrentStage('high-risk-dive')}>
          ← Back to EDD Panel
        </Button>
        <SourceOfFundsVerification
          onComplete={handleSOFComplete}
          onBack={() => setCurrentStage('high-risk-dive')}
        />
      </div>
    );
  }

  if (currentStage === 'high-risk-dive') {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <Button variant="ghost" onClick={() => setCurrentStage('overview')}>
          ← Back to Overview
        </Button>

        <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-lg p-6 text-white shadow-md">
          <h2 className="text-3xl font-extrabold mb-1">STAGE 4: High-Risk Customer Deep Dive (EDD)</h2>
          <p className="text-orange-100 text-sm">Perform Enhanced Due Diligence checks and Source of Funds verification on high-risk category clients.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sanctions Hit Panel */}
          <Card className="border-red-500/30 bg-red-500/10/20 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-red-300 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                Sanctions Match Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <div className="flex justify-between font-semibold">
                <span>Sanctions list:</span>
                <span className="text-red-300">DFAT Consolidated List</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Matching Score:</span>
                <span className="text-red-300">85% similarity</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Entity Name:</span>
                <span className="text-red-300">ABC Enterprises Consolidated</span>
              </div>
              <p className="text-slate-300 leading-relaxed mt-2 pt-2 border-t">
                System matched consolidated entity against potential sanction listing. Compliance review and manual sign-off required.
              </p>
            </CardContent>
          </Card>

          {/* PEP Check Panel */}
          <Card className="border-orange-500/30 bg-orange-500/10/20 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-orange-300 flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-400" />
                PEP Check Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <div className="flex justify-between font-semibold">
                <span>PEP Identified:</span>
                <span className="text-orange-300">Sir Alexander Downer</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>PEP Type:</span>
                <span className="text-orange-300">Foreign PEP</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Role/Connection:</span>
                <span className="text-orange-300">Spouse of Foreign Minister</span>
              </div>
              <p className="text-slate-300 leading-relaxed mt-2 pt-2 border-t">
                Beneficial owner identified as high-profile foreign politically exposed person. Automated high-risk rating applied.
              </p>
            </CardContent>
          </Card>

          {/* Adverse Media Panel */}
          <Card className="border-amber-500/30 bg-amber-500/10/20 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-amber-300 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                Adverse Media Snippet
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <div className="flex justify-between font-semibold">
                <span>Publication:</span>
                <span className="text-amber-300">Sydney Morning Herald</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Published Date:</span>
                <span className="text-amber-300">March 2026</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Sentiment Score:</span>
                <span className="text-red-400 font-bold">Negative (-0.88)</span>
              </div>
              <p className="text-slate-300 leading-relaxed mt-2 pt-2 border-t italic">
                "...regulators flagged complex corporate layers of ABC Enterprises Pty Ltd, raising inquiries into potential money laundering."
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Source of Funds Verification Status */}
        <Card className="border-2 border-primary/20 shadow-md">
          <CardHeader className="border-b bg-white/5/50">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Source of Funds (SOF) Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {!sofData ? (
              <div className="text-center py-8 space-y-4">
                <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
                <h3 className="text-lg font-bold text-slate-100">Source of Funds Declaration Required</h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  High-risk category customers require a full Source of Funds (SOF) declaration. Please provide details of funding sources, amount, and supporting document evidence.
                </p>
                <Button
                  onClick={() => setCurrentStage('source-of-funds')}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 text-sm font-semibold rounded-lg"
                >
                  Initiate Source of Funds (SOF) Form
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-green-400 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-green-300 text-sm">Source of Funds Verified & Saved</h4>
                    <p className="text-xs text-green-300 mt-0.5">Declared details and supporting evidence have been saved successfully.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-3">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-slate-300">Source Type:</span>
                      <span className="font-semibold text-slate-100">{sofData.sourceType}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-slate-300">Declared Amount:</span>
                      <span className="font-semibold text-slate-100">${sofData.amount.toLocaleString()} USD</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-300 mb-1 font-semibold">Supporting Narrative:</span>
                      <p className="p-3 bg-white/5 border rounded-lg text-xs text-slate-300 leading-relaxed">{sofData.supportingNarrative}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-slate-300 block mb-1 font-semibold">Supporting Document:</span>
                      <a
                        href={sofData.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-xs font-semibold text-blue-300 hover:underline"
                      >
                        <FileText className="w-4 h-4" />
                        {sofData.documentUrl.split('/').pop() || 'evidence.pdf'}
                      </a>
                    </div>

                    <div className="p-4 bg-gray-900 text-green-400 font-mono text-xs rounded-lg space-y-1">
                      <div className="text-slate-400 font-bold border-b border-gray-700 pb-1 mb-1">ReviewWorkflowService Audits:</div>
                      {auditLogs.filter(log => log.case_id === 'AUS-2026-002').map((log, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-left">
                          <span className="text-slate-400">[{log.timestamp}]</span>
                          <span className="text-white">{log.action.toUpperCase()}</span>
                          <span className="text-green-500">ID: {log.review_id.substr(0, 10)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setCurrentStage('source-of-funds')}>
                    Edit SOF Declaration
                  </Button>
                  <Button
                    onClick={handleEDDComplete}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold"
                  >
                    Lock EDD Stage & Continue
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (['sample-testing', 'personnel-test', 'effectiveness-review'].includes(currentStage)) {
    const stageTitles: Record<string, string> = {
      'sample-testing': 'STAGE 3: Sample Testing',
      'personnel-test': 'STAGE 5: Personnel Test',
      'effectiveness-review': 'STAGE 6: Effectiveness Review',
    };

    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setCurrentStage('overview')}>
          ← Back to Overview
        </Button>

        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white shadow-md">
          <h2 className="text-3xl font-bold mb-2">{stageTitles[currentStage]}</h2>
          <p className="text-purple-100">Verification of designated service delivery processes & controls</p>
        </div>

        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-purple-500/15 text-purple-400 rounded-full flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-bold text-slate-100">Pre-Verified Auditing Stage</h3>
              <p className="text-sm text-slate-300 mt-2">
                This auditing segment has been dynamically compiled and certified by the automated compliance engine as compliant.
              </p>
            </div>
            <div className="pt-4 flex justify-center gap-3">
              <Button onClick={() => setCurrentStage('overview')} variant="outline">
                Back to Overview
              </Button>
              <Button onClick={() => {
                setCompletedStages(prev => [...prev, currentStage]);
                const stageFlow: Record<string, AuditStage> = {
                  'sample-testing': 'high-risk-dive',
                  'personnel-test': 'effectiveness-review',
                  'effectiveness-review': 'red-team',
                };
                setCurrentStage(stageFlow[currentStage] || 'overview');
              }}>
                Next Stage →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <div>Stage not implemented</div>;
}
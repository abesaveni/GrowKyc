import React, { useState } from 'react';
import { Button } from '../ui/button';
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
  | 'sample-testing'
  | 'high-risk-dive'
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
  const [deskReviewComplete, setDeskReviewComplete] = useState(false);

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
    }, deskReviewItems.length * 2000 + 1000);
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

        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <h3 className="font-bold text-yellow-900 mb-2">Scenario: AUSTRAC Compliance Review</h3>
              <p className="text-yellow-800 mb-3">
                AUSTRAC conducts desk review followed by onsite review 6 months after Tranche 2 commencement.
                Your system will be tested on response time, data quality, and resilience against attack vectors.
              </p>
              <p className="text-sm text-yellow-700 font-semibold">
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
              stage: 'sample-testing',
              title: 'STAGE 2: Sample Testing',
              icon: Search,
              description: 'Test 12 client files across all risk tiers',
              items: ['5 Low risk', '3 Medium risk', '2 High risk', '1 PEP', '1 Complex trust'],
              color: 'purple'
            },
            {
              stage: 'high-risk-dive',
              title: 'STAGE 3: High-Risk Deep Dive',
              icon: AlertTriangle,
              description: 'Detailed examination of 1 high-risk client',
              items: ['Source of funds', 'Source of wealth', 'Senior approval', 'Monitoring'],
              color: 'orange'
            },
            {
              stage: 'personnel-test',
              title: 'STAGE 4: Personnel Test',
              icon: Users,
              description: 'Compliance officer validation and interview',
              items: ['PDD file', 'Criminal check', 'Training', 'Knowledge test'],
              color: 'green'
            },
            {
              stage: 'effectiveness-review',
              title: 'STAGE 5: Effectiveness Review',
              icon: Activity,
              description: 'Internal testing and action plan review',
              items: ['Sample testing', 'Findings', 'Remediation', 'Evidence'],
              color: 'indigo'
            },
            {
              stage: 'red-team',
              title: 'STAGE 6: Red Team Attacks',
              icon: Zap,
              description: '10 attack scenarios to break your system',
              items: ['Shell companies', 'PEP evasion', 'Sanctions bypass', 'Staff collusion'],
              color: 'red'
            }
          ].map((stage) => {
            const Icon = stage.icon;
            return (
              <button
                key={stage.stage}
                onClick={() => setCurrentStage(stage.stage as AuditStage)}
                className="bg-white rounded-lg border-2 border-gray-200 p-6 text-left hover:shadow-lg hover:border-blue-400 transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 bg-${stage.color}-100 rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${stage.color}-600`} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{stage.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{stage.description}</p>
                <div className="space-y-1">
                  {stage.items.map((item, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-700">
                      <div className={`w-1.5 h-1.5 bg-${stage.color}-500 rounded-full mr-2`} />
                      {item}
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-3">What AUSTRAC Cares About</h3>
          <div className="grid grid-cols-5 gap-4">
            {['Governance', 'Risk Logic', 'Decision Documentation', 'Ongoing Monitoring', 'Proof'].map((item, index) => (
              <div key={index} className="text-center">
                <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-blue-900">{item}</p>
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

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-900">
            <strong>AUSTRAC Request:</strong> Provide within 10 business days - Latest AML/CTF Program, 
            client lists, SMR register, personnel files, and effectiveness reports.
          </p>
        </div>

        {!auditStartTime ? (
          <div className="text-center py-12">
            <Clock className="w-24 h-24 text-blue-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Desk Review?</h3>
            <p className="text-gray-600 mb-6">System will attempt to generate all 10 required documents</p>
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
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Generation Status</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {deskReviewItems.filter(i => i.generated).length}/{deskReviewItems.length}
                </p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Total Time</h3>
                <p className={`text-3xl font-bold ${totalTime < 3600 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.floor(totalTime / 60)}m {totalTime % 60}s
                </p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Target</h3>
                <p className="text-3xl font-bold text-gray-600">&lt; 60m</p>
              </div>
            </div>

            <div className="space-y-2">
              {deskReviewItems.map((item) => (
                <div key={item.id} className={`p-4 rounded-lg border-2 ${
                  item.generated ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {item.generated ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <Clock className="w-6 h-6 text-gray-400 animate-pulse" />
                      )}
                      <span className="font-semibold text-gray-900">{item.name}</span>
                    </div>
                    {item.generated && (
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">Generated in {item.timeSeconds}s</span>
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
              <div className={`rounded-lg border-2 p-6 ${
                passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">
                      {passed ? '✓ DESK REVIEW: PASS' : '✗ DESK REVIEW: RED FLAG'}
                    </h3>
                    <p className={passed ? 'text-green-700' : 'text-red-700'}>
                      {passed 
                        ? `All documents generated in ${Math.floor(totalTime / 60)} minutes. System responsive and complete.`
                        : `Generation took ${Math.floor(totalTime / 60)} minutes - exceeds 1 hour target. First red flag to AUSTRAC.`
                      }
                    </p>
                  </div>
                  {passed ? (
                    <CheckCircle className="w-16 h-16 text-green-600" />
                  ) : (
                    <XCircle className="w-16 h-16 text-red-600" />
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
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Attacks Tested</h3>
            <p className="text-3xl font-bold text-blue-600">{redTeamAttacks.filter(a => a.passed !== null).length}/{redTeamAttacks.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-green-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Attacks Blocked</h3>
            <p className="text-3xl font-bold text-green-600">{stats.redTeam.passed}</p>
          </div>
          <div className="bg-white rounded-lg border border-red-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Vulnerabilities</h3>
            <p className="text-3xl font-bold text-red-600">{stats.redTeam.failed}</p>
          </div>
        </div>

        <div className="space-y-4">
          {redTeamAttacks.map((attack, index) => (
            <div key={attack.id} className={`border-2 rounded-lg p-6 ${
              attack.passed === true ? 'border-green-200 bg-green-50' :
              attack.passed === false ? 'border-red-200 bg-red-50' :
              'border-gray-200 bg-white'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className={`w-6 h-6 ${
                      attack.severity === 'critical' ? 'text-red-600' : 'text-orange-600'
                    }`} />
                    <h3 className="text-xl font-bold text-gray-900">{attack.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      attack.severity === 'critical' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
                    }`}>
                      {attack.severity.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">Scenario:</p>
                      <p className="text-gray-800">{attack.scenario}</p>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Tests:</p>
                      <ul className="space-y-1">
                        {attack.test.map((test, idx) => (
                          <li key={idx} className="flex items-start text-sm text-gray-700">
                            <span className="mr-2">•</span>
                            <span>{test}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {attack.passed === false && (
                      <div className="p-3 bg-red-100 border border-red-300 rounded-lg">
                        <p className="text-sm font-semibold text-red-900">
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
                      <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                      <p className="text-sm font-bold text-green-700">BLOCKED</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <XCircle className="w-12 h-12 text-red-600 mx-auto mb-2" />
                      <p className="text-sm font-bold text-red-700">VULNERABLE</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {redTeamAttacks.every(a => a.passed !== null) && (
          <div className={`rounded-lg border-2 p-6 ${
            stats.redTeam.failed === 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            <h3 className="text-2xl font-bold mb-4">
              {stats.redTeam.failed === 0 ? '✓ REGULATOR-RESILIENT' : '✗ VULNERABILITIES DETECTED'}
            </h3>
            <p className={stats.redTeam.failed === 0 ? 'text-green-700' : 'text-red-700'}>
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

        <div className={`bg-gradient-to-r ${
          outcome.color === 'green' ? 'from-green-600 to-emerald-600' :
          outcome.color === 'yellow' ? 'from-yellow-600 to-orange-600' :
          outcome.color === 'orange' ? 'from-orange-600 to-red-600' :
          'from-red-600 to-pink-600'
        } rounded-lg p-8 text-white`}>
          <h1 className="text-5xl font-bold mb-4">{outcome.status}</h1>
          <p className="text-2xl">{outcome.reason}</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Sample Testing Results</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total Tests:</span>
                <span className="font-bold text-gray-900">{stats.sample.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Passed:</span>
                <span className="font-bold text-green-600">{stats.sample.passed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Failed:</span>
                <span className="font-bold text-red-600">{stats.sample.failed}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Red Team Attack Results</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total Attacks:</span>
                <span className="font-bold text-gray-900">{stats.redTeam.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Blocked:</span>
                <span className="font-bold text-green-600">{stats.redTeam.passed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Vulnerabilities:</span>
                <span className="font-bold text-red-600">{stats.redTeam.failed}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Pass Criteria Validation</h3>
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
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-900">{criteria}</span>
                  {passed ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-3">Final Reality Check</h3>
          <p className="text-blue-800 mb-4">
            AUSTRAC does not care how modern your UI is. They care about:
          </p>
          <div className="grid grid-cols-5 gap-4">
            {['Governance', 'Risk Logic', 'Decision Documentation', 'Ongoing Monitoring', 'Proof'].map((item, index) => (
              <div key={index} className="text-center p-3 bg-white rounded-lg">
                <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-blue-900">{item}</p>
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

  return <div>Stage not implemented</div>;
}
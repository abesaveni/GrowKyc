import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  PlayCircle,
  Download,
  TrendingUp,
  Clock,
  FileText,
  Users,
  Search,
  Eye,
  Lock,
  Activity
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  category: string;
  requirement: string;
  completed: boolean;
  evidence?: string;
  stressTest?: string;
  stressTestPassed?: boolean;
  priority: 'critical' | 'high' | 'medium';
}

interface ReadinessScore {
  governance: number;
  riskClarity: number;
  operationalDiscipline: number;
  monitoringResponsiveness: number;
  documentationQuality: number;
}

export function AUSTRACReviewTesting() {
  const [activeSection, setActiveSection] = useState<'checklist' | 'stress-tests' | 'gaps' | 'readiness' | 'report'>('checklist');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showStressTestModal, setShowStressTestModal] = useState(false);
  const [selectedStressTest, setSelectedStressTest] = useState<ChecklistItem | null>(null);

  const [readinessScores, setReadinessScores] = useState<ReadinessScore>({
    governance: 0,
    riskClarity: 0,
    operationalDiscipline: 0,
    monitoringResponsiveness: 0,
    documentationQuality: 0
  });

  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    // A. GOVERNANCE & ACCOUNTABILITY
    {
      id: 'A1-1',
      category: 'Governance',
      requirement: 'Governing body formally appointed',
      completed: false,
      priority: 'critical',
      stressTest: 'Show appointment documentation with dates and roles clearly defined'
    },
    {
      id: 'A1-2',
      category: 'Governance',
      requirement: 'Senior manager formally appointed',
      completed: false,
      priority: 'critical',
      stressTest: 'Show written appointment and delegation of authority'
    },
    {
      id: 'A1-3',
      category: 'Governance',
      requirement: 'AML/CTF Compliance Officer appointed',
      completed: false,
      priority: 'critical',
      stressTest: 'Ask random staff: "Who is the AML/CTF compliance officer?" - If they hesitate, you fail governance clarity'
    },
    {
      id: 'A1-4',
      category: 'Governance',
      requirement: 'AUSTRAC notified of compliance officer within timeframe',
      completed: false,
      priority: 'critical',
      stressTest: 'Show AUSTRAC notification confirmation within 14 days of appointment'
    },
    {
      id: 'A1-5',
      category: 'Governance',
      requirement: 'Responsibilities documented and not duplicated without clarity',
      completed: false,
      priority: 'high',
      stressTest: 'Show role descriptions with clear accountability and no overlaps'
    },
    {
      id: 'A1-6',
      category: 'Governance',
      requirement: 'Delegations recorded in writing',
      completed: false,
      priority: 'high',
      stressTest: 'Show written delegation register with limits and approvals'
    },
    {
      id: 'A2-1',
      category: 'Governance',
      requirement: 'Senior manager approved the AML/CTF program',
      completed: false,
      priority: 'critical',
      stressTest: 'Show approval records with date, version, and signature'
    },
    {
      id: 'A2-2',
      category: 'Governance',
      requirement: 'Approval records stored with date and version',
      completed: false,
      priority: 'critical',
      stressTest: 'Show version control history with all approval dates'
    },
    {
      id: 'A2-3',
      category: 'Governance',
      requirement: 'Material changes re-approved within 14 days',
      completed: false,
      priority: 'critical',
      stressTest: 'Show last program change, approval record, and 14-day compliance'
    },
    {
      id: 'A2-4',
      category: 'Governance',
      requirement: 'Board minutes reflect AML oversight',
      completed: false,
      priority: 'high',
      stressTest: 'Show board minutes with AML discussion and decisions'
    },

    // B. RISK ASSESSMENT
    {
      id: 'B3-1',
      category: 'Risk Assessment',
      requirement: 'All designated services mapped',
      completed: false,
      priority: 'critical',
      stressTest: 'Pick a service. Show how risk was assessed and why it is acceptable under your risk appetite'
    },
    {
      id: 'B3-2',
      category: 'Risk Assessment',
      requirement: 'Services not provided are clearly excluded',
      completed: false,
      priority: 'high',
      stressTest: 'Show excluded services list with reasoning'
    },
    {
      id: 'B3-3',
      category: 'Risk Assessment',
      requirement: 'Risk ratings documented with rationale',
      completed: false,
      priority: 'critical',
      stressTest: 'Show detailed reasoning for each service risk rating'
    },
    {
      id: 'B4-1',
      category: 'Risk Assessment',
      requirement: 'FATF list integrated',
      completed: false,
      priority: 'critical',
      stressTest: 'Show FATF list in system with auto-HIGH risk logic'
    },
    {
      id: 'B4-2',
      category: 'Risk Assessment',
      requirement: 'DFAT sanctions override logic',
      completed: false,
      priority: 'critical',
      stressTest: 'Show DFAT sanctions list with auto-override to HIGH risk'
    },
    {
      id: 'B4-3',
      category: 'Risk Assessment',
      requirement: 'Basel AML score captured',
      completed: false,
      priority: 'high',
      stressTest: 'Show Basel AML Index scores for all countries in risk assessment'
    },
    {
      id: 'B4-4',
      category: 'Risk Assessment',
      requirement: 'Risk appetite per country documented',
      completed: false,
      priority: 'critical',
      stressTest: 'Test: What happens if a client becomes resident in a high-risk country tomorrow? Does the system trigger review?'
    },
    {
      id: 'B5-1',
      category: 'Risk Assessment',
      requirement: '"Do Not Accept" categories block onboarding',
      completed: false,
      priority: 'critical',
      stressTest: 'Attempt to onboard a client from a prohibited country. System must block.'
    },
    {
      id: 'B5-2',
      category: 'Risk Assessment',
      requirement: 'Controls required where risk accepted with conditions',
      completed: false,
      priority: 'critical',
      stressTest: 'Show control statements for all conditional acceptances'
    },
    {
      id: 'B5-3',
      category: 'Risk Assessment',
      requirement: 'System enforces escalation when risk outside appetite',
      completed: false,
      priority: 'critical',
      stressTest: 'Test: Attempt high-risk onboarding. System must force compliance officer escalation.'
    },

    // C. PERSONNEL CONTROLS
    {
      id: 'C6-1',
      category: 'Personnel',
      requirement: 'Identity verified',
      completed: false,
      priority: 'critical',
      stressTest: 'Pull compliance officer file. Show ID verification evidence.'
    },
    {
      id: 'C6-2',
      category: 'Personnel',
      requirement: 'Criminal history check (compliance officer)',
      completed: false,
      priority: 'critical',
      stressTest: 'Show national criminal history check dated within last 12 months'
    },
    {
      id: 'C6-3',
      category: 'Personnel',
      requirement: 'Bankruptcy check',
      completed: false,
      priority: 'critical',
      stressTest: 'Show NPII bankruptcy search results'
    },
    {
      id: 'C6-4',
      category: 'Personnel',
      requirement: 'Professional body verification',
      completed: false,
      priority: 'high',
      stressTest: 'Show professional membership verification (CPA/CA/IPA)'
    },
    {
      id: 'C6-5',
      category: 'Personnel',
      requirement: 'Suitability assessment recorded',
      completed: false,
      priority: 'critical',
      stressTest: 'Show completed suitability assessment with decision rationale'
    },
    {
      id: 'C6-6',
      category: 'Personnel',
      requirement: '7-year retention applied',
      completed: false,
      priority: 'critical',
      stressTest: 'Attempt to delete personnel file. System must block for 7 years after role ends.'
    },
    {
      id: 'C7-1',
      category: 'Personnel',
      requirement: 'Trigger-based reassessment defined',
      completed: false,
      priority: 'high',
      stressTest: 'Test: If compliance officer is charged with an offence, what happens? Show process.'
    },
    {
      id: 'C7-2',
      category: 'Personnel',
      requirement: 'Conflicts documented',
      completed: false,
      priority: 'medium',
      stressTest: 'Show conflict of interest register and assessment process'
    },
    {
      id: 'C7-3',
      category: 'Personnel',
      requirement: 'Removal process documented',
      completed: false,
      priority: 'high',
      stressTest: 'Show procedure for removing staff from AML roles'
    },
    {
      id: 'C8-1',
      category: 'Personnel',
      requirement: 'Initial AML training completed',
      completed: false,
      priority: 'critical',
      stressTest: 'Select random client manager. Show training record with completion date.'
    },
    {
      id: 'C8-2',
      category: 'Personnel',
      requirement: 'Role-based training documented',
      completed: false,
      priority: 'high',
      stressTest: 'Show training matrix with role-specific modules'
    },
    {
      id: 'C8-3',
      category: 'Personnel',
      requirement: 'Refresher schedule active',
      completed: false,
      priority: 'high',
      stressTest: 'Show training calendar with upcoming refreshers'
    },
    {
      id: 'C8-4',
      category: 'Personnel',
      requirement: 'Evidence stored',
      completed: false,
      priority: 'high',
      stressTest: 'Show training certificates and assessment results'
    },

    // D. CLIENT CDD
    {
      id: 'D9-1',
      category: 'Client CDD',
      requirement: 'Identity verified before designated service',
      completed: false,
      priority: 'critical',
      stressTest: 'Pick high-risk client. Show full onboarding trail with ID verification timestamp before first service.'
    },
    {
      id: 'D9-2',
      category: 'Client CDD',
      requirement: 'Beneficial ownership identified',
      completed: false,
      priority: 'critical',
      stressTest: 'Show beneficial ownership tree with verification evidence'
    },
    {
      id: 'D9-3',
      category: 'Client CDD',
      requirement: 'Representatives screened',
      completed: false,
      priority: 'high',
      stressTest: 'Show representative screening results (ID + sanctions)'
    },
    {
      id: 'D9-4',
      category: 'Client CDD',
      requirement: 'Sanctions screening completed',
      completed: false,
      priority: 'critical',
      stressTest: 'Show sanctions screening results with date and provider'
    },
    {
      id: 'D9-5',
      category: 'Client CDD',
      requirement: 'PEP screening completed',
      completed: false,
      priority: 'critical',
      stressTest: 'Show PEP screening results with match confidence scores'
    },
    {
      id: 'D9-6',
      category: 'Client CDD',
      requirement: 'Risk rating recorded',
      completed: false,
      priority: 'critical',
      stressTest: 'Show risk rating with auto-calculation factors'
    },
    {
      id: 'D9-7',
      category: 'Client CDD',
      requirement: 'Decision rationale stored',
      completed: false,
      priority: 'critical',
      stressTest: 'Show approval decision with detailed reasoning'
    },
    {
      id: 'D10-1',
      category: 'Client CDD',
      requirement: 'Ownership tree documented',
      completed: false,
      priority: 'critical',
      stressTest: 'Select trust client. Show how beneficiaries and trustees were screened.'
    },
    {
      id: 'D10-2',
      category: 'Client CDD',
      requirement: 'Control persons identified',
      completed: false,
      priority: 'critical',
      stressTest: 'Show control person identification (>25% or control rights)'
    },
    {
      id: 'D10-3',
      category: 'Client CDD',
      requirement: 'Trust structures fully mapped',
      completed: false,
      priority: 'critical',
      stressTest: 'Show trust deed analysis and beneficial owner identification'
    },
    {
      id: 'D10-4',
      category: 'Client CDD',
      requirement: 'Complex structures escalated',
      completed: false,
      priority: 'critical',
      stressTest: 'Show escalation record for complex ownership structures'
    },
    {
      id: 'D11-1',
      category: 'Client CDD',
      requirement: 'Trigger conditions defined',
      completed: false,
      priority: 'critical',
      stressTest: 'Show enhanced CDD file for one high-risk client with all triggers documented'
    },
    {
      id: 'D11-2',
      category: 'Client CDD',
      requirement: 'Source of funds captured',
      completed: false,
      priority: 'critical',
      stressTest: 'Show source of funds documentation and verification'
    },
    {
      id: 'D11-3',
      category: 'Client CDD',
      requirement: 'Source of wealth captured',
      completed: false,
      priority: 'critical',
      stressTest: 'Show source of wealth statement with supporting evidence'
    },
    {
      id: 'D11-4',
      category: 'Client CDD',
      requirement: 'Senior manager approval recorded',
      completed: false,
      priority: 'critical',
      stressTest: 'Show senior manager approval with date, signature, and decision'
    },

    // E. ONGOING MONITORING
    {
      id: 'E12-1',
      category: 'Monitoring',
      requirement: 'Monitoring rules defined',
      completed: false,
      priority: 'critical',
      stressTest: 'Show last 10 monitoring alerts. Show how many were escalated and why.'
    },
    {
      id: 'E12-2',
      category: 'Monitoring',
      requirement: 'Ownership change triggers review',
      completed: false,
      priority: 'critical',
      stressTest: 'Show ownership change alert with triggered review'
    },
    {
      id: 'E12-3',
      category: 'Monitoring',
      requirement: 'PEP changes trigger review',
      completed: false,
      priority: 'critical',
      stressTest: 'Show PEP status change alert with review'
    },
    {
      id: 'E12-4',
      category: 'Monitoring',
      requirement: 'Sanctions re-screening active',
      completed: false,
      priority: 'critical',
      stressTest: 'Show sanctions screening frequency and last run date'
    },
    {
      id: 'E12-5',
      category: 'Monitoring',
      requirement: 'Unusual behaviour review process defined',
      completed: false,
      priority: 'high',
      stressTest: 'Show unusual behaviour alert with investigation and outcome'
    },
    {
      id: 'E13-1',
      category: 'Monitoring',
      requirement: 'High risk reviewed at least annually',
      completed: false,
      priority: 'critical',
      stressTest: 'Show list of overdue reviews. Must be zero for high-risk clients.'
    },
    {
      id: 'E13-2',
      category: 'Monitoring',
      requirement: 'Medium reviewed within set cycle',
      completed: false,
      priority: 'high',
      stressTest: 'Show review cycle compliance report'
    },
    {
      id: 'E13-3',
      category: 'Monitoring',
      requirement: 'Low reviewed within set cycle',
      completed: false,
      priority: 'medium',
      stressTest: 'Show low-risk review completion rate'
    },
    {
      id: 'E13-4',
      category: 'Monitoring',
      requirement: 'Overdue reviews flagged',
      completed: false,
      priority: 'critical',
      stressTest: 'Show automated overdue review alerts and escalation'
    },

    // F. REPORTING
    {
      id: 'F14-1',
      category: 'Reporting',
      requirement: 'SMR decision process documented',
      completed: false,
      priority: 'critical',
      stressTest: 'Show SMR decision matrix and escalation workflow'
    },
    {
      id: 'F14-2',
      category: 'Reporting',
      requirement: 'Escalation documented',
      completed: false,
      priority: 'critical',
      stressTest: 'Show SMR escalation trail to senior manager'
    },
    {
      id: 'F14-3',
      category: 'Reporting',
      requirement: 'Access restricted',
      completed: false,
      priority: 'critical',
      stressTest: 'Show restricted access model. Who can view SMRs? Test access control.'
    },
    {
      id: 'F14-4',
      category: 'Reporting',
      requirement: 'Timers enforced',
      completed: false,
      priority: 'critical',
      stressTest: 'Show 24h terrorism and 3 business day timers with alerts'
    },
    {
      id: 'F14-5',
      category: 'Reporting',
      requirement: 'Tipping-off controls in place',
      completed: false,
      priority: 'critical',
      stressTest: 'Show tipping-off prevention controls and staff training'
    },
    {
      id: 'F15-1',
      category: 'Reporting',
      requirement: 'Cash trigger defined',
      completed: false,
      priority: 'critical',
      stressTest: 'Show $10,000+ physical currency trigger'
    },
    {
      id: 'F15-2',
      category: 'Reporting',
      requirement: '10-day timer tracked',
      completed: false,
      priority: 'critical',
      stressTest: 'Show TTR 10-day timer with alerts'
    },
    {
      id: 'F16-1',
      category: 'Reporting',
      requirement: 'System tracks due date',
      completed: false,
      priority: 'high',
      stressTest: 'Show annual compliance report due date (31 March)'
    },
    {
      id: 'F16-2',
      category: 'Reporting',
      requirement: 'Data compiled automatically',
      completed: false,
      priority: 'high',
      stressTest: 'Show automated data compilation for annual report'
    },
    {
      id: 'F16-3',
      category: 'Reporting',
      requirement: 'Submission evidence retained',
      completed: false,
      priority: 'high',
      stressTest: 'Show submission confirmation and retention'
    },

    // G. RECORD KEEPING
    {
      id: 'G17-1',
      category: 'Record Keeping',
      requirement: '7-year post relationship rule enforced',
      completed: false,
      priority: 'critical',
      stressTest: 'Attempt to delete a CDD record. System must block for 7 years post-relationship.'
    },
    {
      id: 'G17-2',
      category: 'Record Keeping',
      requirement: 'Personnel PDD retention enforced',
      completed: false,
      priority: 'critical',
      stressTest: 'Test personnel file deletion. Must block for 7 years after role ends.'
    },
    {
      id: 'G17-3',
      category: 'Record Keeping',
      requirement: 'Program version retention enforced',
      completed: false,
      priority: 'high',
      stressTest: 'Show all program versions with 7-year retention'
    },
    {
      id: 'G18-1',
      category: 'Record Keeping',
      requirement: 'All changes logged',
      completed: false,
      priority: 'critical',
      stressTest: 'Show complete timeline for one client from onboarding to present'
    },
    {
      id: 'G18-2',
      category: 'Record Keeping',
      requirement: 'Approval timestamps immutable',
      completed: false,
      priority: 'critical',
      stressTest: 'Show approval timestamps cannot be modified'
    },
    {
      id: 'G18-3',
      category: 'Record Keeping',
      requirement: 'Evidence files hashed',
      completed: false,
      priority: 'high',
      stressTest: 'Show SHA-256 hash for evidence file integrity'
    },
    {
      id: 'G18-4',
      category: 'Record Keeping',
      requirement: 'Access logs stored',
      completed: false,
      priority: 'high',
      stressTest: 'Show access log for sensitive records'
    },

    // H. PROGRAM MAINTENANCE
    {
      id: 'H19-1',
      category: 'Program Maintenance',
      requirement: 'Regulatory change triggers review',
      completed: false,
      priority: 'critical',
      stressTest: 'Show regulatory change log and triggered program updates'
    },
    {
      id: 'H19-2',
      category: 'Program Maintenance',
      requirement: 'New service triggers review',
      completed: false,
      priority: 'critical',
      stressTest: 'Show new service addition with risk assessment and program update'
    },
    {
      id: 'H19-3',
      category: 'Program Maintenance',
      requirement: 'Independent review findings trigger update',
      completed: false,
      priority: 'critical',
      stressTest: 'Show independent review findings with remediation plan'
    },
    {
      id: 'H19-4',
      category: 'Program Maintenance',
      requirement: 'Significant compliance issue triggers update',
      completed: false,
      priority: 'critical',
      stressTest: 'Show compliance issue register with program updates'
    },
    {
      id: 'H20-1',
      category: 'Program Maintenance',
      requirement: 'Sampling performed',
      completed: false,
      priority: 'high',
      stressTest: 'Show quarterly sampling report with methodology'
    },
    {
      id: 'H20-2',
      category: 'Program Maintenance',
      requirement: 'Findings recorded',
      completed: false,
      priority: 'high',
      stressTest: 'Show effectiveness testing findings with severity ratings'
    },
    {
      id: 'H20-3',
      category: 'Program Maintenance',
      requirement: 'Action plan tracked',
      completed: false,
      priority: 'high',
      stressTest: 'Show remediation action plan with completion tracking'
    },
    {
      id: 'H20-4',
      category: 'Program Maintenance',
      requirement: 'Governing body informed',
      completed: false,
      priority: 'critical',
      stressTest: 'Show governing body report on effectiveness testing'
    },
    {
      id: 'H21-1',
      category: 'Program Maintenance',
      requirement: 'Scheduled within required timeframe',
      completed: false,
      priority: 'critical',
      stressTest: 'Show independent evaluation schedule (every 3 years minimum)'
    },
    {
      id: 'H21-2',
      category: 'Program Maintenance',
      requirement: 'Evaluator independence documented',
      completed: false,
      priority: 'critical',
      stressTest: 'Show evaluator independence declaration and qualifications'
    },
    {
      id: 'H21-3',
      category: 'Program Maintenance',
      requirement: 'Findings uploaded',
      completed: false,
      priority: 'critical',
      stressTest: 'Show independent evaluation report in system'
    },
    {
      id: 'H21-4',
      category: 'Program Maintenance',
      requirement: 'Remediation tracked',
      completed: false,
      priority: 'critical',
      stressTest: 'Show remediation action tracker with completion dates'
    }
  ]);

  const categories = ['all', 'Governance', 'Risk Assessment', 'Personnel', 'Client CDD', 'Monitoring', 'Reporting', 'Record Keeping', 'Program Maintenance'];
  
  const filteredChecklist = filterCategory === 'all' 
    ? checklist 
    : checklist.filter(item => item.category === filterCategory);

  const completionStats = {
    total: checklist.length,
    completed: checklist.filter(i => i.completed).length,
    critical: checklist.filter(i => i.priority === 'critical').length,
    criticalComplete: checklist.filter(i => i.priority === 'critical' && i.completed).length
  };

  const completionPercentage = Math.round((completionStats.completed / completionStats.total) * 100);
  const criticalPercentage = Math.round((completionStats.criticalComplete / completionStats.critical) * 100);

  const calculateReadiness = () => {
    const governanceItems = checklist.filter(i => i.category === 'Governance');
    const governance = (governanceItems.filter(i => i.completed).length / governanceItems.length) * 5;

    const riskItems = checklist.filter(i => i.category === 'Risk Assessment');
    const riskClarity = (riskItems.filter(i => i.completed).length / riskItems.length) * 5;

    const operationalItems = checklist.filter(i => ['Client CDD', 'Monitoring'].includes(i.category));
    const operationalDiscipline = (operationalItems.filter(i => i.completed).length / operationalItems.length) * 5;

    const monitoringItems = checklist.filter(i => i.category === 'Monitoring');
    const monitoringResponsiveness = (monitoringItems.filter(i => i.completed).length / monitoringItems.length) * 5;

    const recordItems = checklist.filter(i => i.category === 'Record Keeping');
    const documentationQuality = (recordItems.filter(i => i.completed).length / recordItems.length) * 5;

    setReadinessScores({
      governance,
      riskClarity,
      operationalDiscipline,
      monitoringResponsiveness,
      documentationQuality
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-600';
    if (score >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 4) return 'PASS';
    if (score >= 3) return 'NEEDS IMPROVEMENT';
    return 'MATERIAL WEAKNESS';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">AUSTRAC Review Testing & Readiness</h1>
        <p className="text-red-100">Test your system before an independent evaluation</p>
      </div>

      {/* Completion Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">Overall Progress</h3>
            <Activity className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-2">{completionPercentage}%</div>
          <div className="text-sm text-gray-600">{completionStats.completed}/{completionStats.total} items</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${completionPercentage}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">Critical Items</h3>
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div className="text-3xl font-bold text-red-600 mb-2">{criticalPercentage}%</div>
          <div className="text-sm text-gray-600">{completionStats.criticalComplete}/{completionStats.critical} critical</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div className="bg-red-600 h-2 rounded-full" style={{ width: `${criticalPercentage}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">Readiness Score</h3>
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">
            {Object.values(readinessScores).reduce((a, b) => a + b, 0) > 0 
              ? (Object.values(readinessScores).reduce((a, b) => a + b, 0) / 5).toFixed(1)
              : 'N/A'
            }
          </div>
          <div className="text-sm text-gray-600">Out of 5.0</div>
          <Button size="sm" className="w-full mt-2" onClick={calculateReadiness}>
            Calculate
          </Button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">Review Status</h3>
            {criticalPercentage === 100 ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <XCircle className="w-6 h-6 text-red-600" />
            )}
          </div>
          <div className={`text-3xl font-bold mb-2 ${criticalPercentage === 100 ? 'text-green-600' : 'text-red-600'}`}>
            {criticalPercentage === 100 ? 'READY' : 'NOT READY'}
          </div>
          <div className="text-sm text-gray-600">
            {criticalPercentage === 100 ? 'All critical items complete' : `${completionStats.critical - completionStats.criticalComplete} critical remaining`}
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-2">
          {[
            { id: 'checklist', label: 'Compliance Checklist', icon: CheckCircle },
            { id: 'stress-tests', label: 'Stress Tests', icon: PlayCircle },
            { id: 'gaps', label: 'Gap Analysis', icon: AlertTriangle },
            { id: 'readiness', label: 'Readiness Scores', icon: TrendingUp },
            { id: 'report', label: 'Final Report', icon: FileText }
          ].map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as any)}
                className={`px-6 py-3 font-semibold flex items-center gap-2 transition-colors ${
                  activeSection === section.id
                    ? 'border-b-2 border-red-600 text-red-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {section.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Checklist View */}
      {activeSection === 'checklist' && (
        <div className="space-y-4">
          {/* Category Filter */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-gray-900">Filter by Category:</span>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filterCategory === cat
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Checklist Items */}
          <div className="space-y-2">
            {filteredChecklist.map((item, index) => (
              <div key={item.id} className={`bg-white rounded-lg border-2 p-4 ${
                item.completed ? 'border-green-200 bg-green-50' :
                item.priority === 'critical' ? 'border-red-200 bg-red-50' :
                'border-gray-200'
              }`}>
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => {
                      const updated = [...checklist];
                      const idx = checklist.findIndex(i => i.id === item.id);
                      updated[idx].completed = !updated[idx].completed;
                      setChecklist(updated);
                    }}
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                      item.completed 
                        ? 'bg-green-600 border-green-600' 
                        : 'border-gray-300 hover:border-green-500'
                    }`}
                  >
                    {item.completed && <CheckCircle className="w-5 h-5 text-white" />}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-sm text-gray-500">{item.id}</span>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            item.priority === 'critical' ? 'bg-red-500 text-white' :
                            item.priority === 'high' ? 'bg-orange-500 text-white' :
                            'bg-blue-500 text-white'
                          }`}>
                            {item.priority.toUpperCase()}
                          </span>
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-700">
                            {item.category}
                          </span>
                        </div>
                        <p className="font-semibold text-gray-900 mb-2">{item.requirement}</p>
                        {item.stressTest && (
                          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm font-semibold text-yellow-900 mb-1">
                              <PlayCircle className="w-4 h-4 inline mr-2" />
                              Stress Test:
                            </p>
                            <p className="text-sm text-yellow-800">{item.stressTest}</p>
                          </div>
                        )}
                      </div>

                      {item.stressTest && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedStressTest(item);
                            setShowStressTestModal(true);
                          }}
                        >
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Run Test
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Readiness Scores View */}
      {activeSection === 'readiness' && (
        <div className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-bold text-yellow-900 mb-2">Scoring Criteria</h3>
            <p className="text-sm text-yellow-800">
              Each area is scored 1-5. Score below 4 indicates material weakness that independent review will identify.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[
              { key: 'governance', label: 'Governance Strength', icon: Shield },
              { key: 'riskClarity', label: 'Risk Clarity', icon: Scale },
              { key: 'operationalDiscipline', label: 'Operational Discipline', icon: Activity },
              { key: 'monitoringResponsiveness', label: 'Monitoring Responsiveness', icon: Eye },
              { key: 'documentationQuality', label: 'Documentation Quality', icon: FileText }
            ].map((area) => {
              const Icon = area.icon;
              const score = readinessScores[area.key as keyof ReadinessScore];
              return (
                <div key={area.key} className="bg-white rounded-lg border-2 border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Icon className="w-6 h-6 text-gray-600" />
                      <h3 className="text-xl font-bold text-gray-900">{area.label}</h3>
                    </div>
                    <div className="text-right">
                      <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
                        {score.toFixed(1)}
                      </div>
                      <div className={`text-sm font-semibold ${getScoreColor(score)}`}>
                        {getScoreLabel(score)}
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className={`h-4 rounded-full ${
                        score >= 4 ? 'bg-green-600' : score >= 3 ? 'bg-yellow-600' : 'bg-red-600'
                      }`}
                      style={{ width: `${(score / 5) * 100}%` }}
                    />
                  </div>
                  {score < 4 && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm font-semibold text-red-900">⚠️ Material Weakness Detected</p>
                      <p className="text-sm text-red-700">Independent review will likely identify gaps in this area</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Overall Assessment */}
          <div className={`rounded-lg border-2 p-6 ${
            Object.values(readinessScores).every(s => s >= 4)
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <h3 className="text-2xl font-bold mb-4">
              {Object.values(readinessScores).every(s => s >= 4)
                ? '✓ System Ready for AUSTRAC Review'
                : '✗ System Not Ready - Material Weaknesses Present'
              }
            </h3>
            <p className={`${
              Object.values(readinessScores).every(s => s >= 4)
                ? 'text-green-700'
                : 'text-red-700'
            }`}>
              {Object.values(readinessScores).every(s => s >= 4)
                ? 'All areas score 4.0 or above. You have strong structural compliance and evidence quality.'
                : 'One or more areas score below 4.0. Address these weaknesses before independent evaluation.'
              }
            </p>
          </div>
        </div>
      )}

      {/* Final Report */}
      {activeSection === 'report' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">AUSTRAC Readiness Report</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Executive Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Overall Completion</p>
                    <p className="text-3xl font-bold text-blue-600">{completionPercentage}%</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-sm text-gray-600">Critical Items</p>
                    <p className="text-3xl font-bold text-red-600">{criticalPercentage}%</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Three Key Tests</h3>
                <div className="space-y-3">
                  <div className="p-4 border-l-4 border-blue-600 bg-blue-50 rounded-r-lg">
                    <p className="font-bold text-blue-900">1. Do you understand your risk?</p>
                    <p className="text-sm text-blue-700">
                      Risk Assessment: {Math.round((checklist.filter(i => i.category === 'Risk Assessment' && i.completed).length / checklist.filter(i => i.category === 'Risk Assessment').length) * 100)}% complete
                    </p>
                  </div>
                  <div className="p-4 border-l-4 border-purple-600 bg-purple-50 rounded-r-lg">
                    <p className="font-bold text-purple-900">2. Do you follow your own rules?</p>
                    <p className="text-sm text-purple-700">
                      Operational Compliance: {Math.round((checklist.filter(i => ['Client CDD', 'Monitoring'].includes(i.category) && i.completed).length / checklist.filter(i => ['Client CDD', 'Monitoring'].includes(i.category)).length) * 100)}% complete
                    </p>
                  </div>
                  <div className="p-4 border-l-4 border-green-600 bg-green-50 rounded-r-lg">
                    <p className="font-bold text-green-900">3. Can you prove it?</p>
                    <p className="text-sm text-green-700">
                      Record Keeping: {Math.round((checklist.filter(i => i.category === 'Record Keeping' && i.completed).length / checklist.filter(i => i.category === 'Record Keeping').length) * 100)}% complete
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg">
                  <Download className="w-5 h-5 mr-2" />
                  Download Complete Readiness Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
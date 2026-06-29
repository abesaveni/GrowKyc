import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  FileText,
  Shield,
  Users,
  Activity,
  Lock,
  Database,
  ArrowLeft,
  Download
} from 'lucide-react';

interface RegulatoryGapAnalysisProps {
  onBack: () => void;
}

/**
 * REGULATORY GAP ANALYSIS & UPGRADE ROADMAP
 * 
 * This component maps existing KYC module capabilities against regulatory requirements
 * for AUSTRAC Tranche 2, NCCP, ASIC RG78, ASIC RG271, SOC 2, and ISO 27001.
 * 
 * Status Legend:
 * ✅ COMPLETE - Fully implemented
 * 🟡 PARTIAL - Exists but needs enhancement
 * ❌ MISSING - Not implemented, needs to be built
 */

const gapAnalysis = {
  'AML/AUSTRAC Tranche 2': {
    items: [
      {
        requirement: 'AML/CTF Program Management (Part A & Part B)',
        status: 'partial',
        existing: 'Basic AML program status shown in SentinelAMLDashboard',
        gap: 'Need full program versioning, approval workflow, board sign-off, policy owner tracking, procedure links',
        priority: 'HIGH',
        component: 'Create: AMLProgramManagement.tsx'
      },
      {
        requirement: 'Customer Risk Scoring Engine',
        status: 'partial',
        existing: 'Generic risk scores in CaseDashboard, basic risk flags',
        gap: 'Need structured 10-factor scoring (jurisdiction, entity type, ownership complexity, PEP, sanctions, SOF, service, delivery channel, adverse media, weighted score), risk override workflow',
        priority: 'HIGH',
        component: 'Create: CustomerRiskScoringEngine.tsx'
      },
      {
        requirement: 'Ongoing Due Diligence (ODD)',
        status: 'partial',
        existing: 'TransactionMonitoring exists, basic monitoring',
        gap: 'Need ODD review queue, review checklists, re-verification flows, trigger event management, completed review evidence log',
        priority: 'HIGH',
        component: 'Create: OngoingDueDiligenceHub.tsx'
      },
      {
        requirement: 'Screening & Monitoring Center',
        status: 'partial',
        existing: 'Individual bots: SanctionsBot, PEPScreeningBot, AdverseMediaBot',
        gap: 'Need centralized alert queue, false positive resolution workflow, rescreening frequency settings, evidence snapshot storage',
        priority: 'MEDIUM',
        component: 'Enhance: ScreeningAlertCenter.tsx'
      },
      {
        requirement: 'Suspicious Matter Reporting (SMR)',
        status: 'missing',
        existing: 'CaseManagement exists for general cases',
        gap: 'Need dedicated SMR workflow: case creation, internal investigation notes, linked transactions, lodge/not lodge decision, lodgement record, reporting officer log, full audit trail',
        priority: 'HIGH',
        component: 'Create: SuspiciousMatterReporting.tsx'
      }
    ]
  },
  'NCCP Compliance': {
    items: [
      {
        requirement: 'Consumer Profile & Loan Purpose',
        status: 'partial',
        existing: 'ResponsibleLendingAssessment exists with basic fields',
        gap: 'Need structured borrower objectives (short/long term), dependants, employment type, consumer vs business purpose flag',
        priority: 'MEDIUM',
        component: 'Enhance: ConsumerProfileCapture.tsx'
      },
      {
        requirement: 'Verification Hub (Field-to-Document Evidence)',
        status: 'partial',
        existing: 'EvidenceVault exists, DocumentUploadSystem exists',
        gap: 'Need explicit field-to-document linking, verification completeness widget, missing evidence alerts, verified by/date tracking',
        priority: 'HIGH',
        component: 'Enhance: VerificationEvidenceHub.tsx'
      },
      {
        requirement: 'Unsuitability Assessment Calculator',
        status: 'complete',
        existing: 'ResponsibleLendingAssessment has full calculator with servicing ratio, buffer, surplus/unsuitable output',
        gap: 'None - already includes income, expenses, liabilities, benchmarks, assumptions log, reviewer sign-off',
        priority: 'N/A',
        component: 'Existing: ResponsibleLendingAssessment.tsx ✅'
      },
      {
        requirement: 'Disclosure Tracking',
        status: 'partial',
        existing: 'DisclosureRequirements component exists',
        gap: 'Need disclosure register, version tracking, acknowledgment timestamps, document issue history',
        priority: 'MEDIUM',
        component: 'Enhance: DisclosureRegister.tsx'
      }
    ]
  },
  'ASIC RG78 Breach Reporting': {
    items: [
      {
        requirement: 'Breach Register & Management',
        status: 'complete',
        existing: 'BreachModule.tsx exists with full workflow',
        gap: 'Already includes: breach ID, date identified, severity, significance assessment, client/financial impact, systemic flag, remediation, ASIC reporting logic, deadline tracking',
        priority: 'N/A',
        component: 'Existing: BreachModule.tsx ✅'
      },
      {
        requirement: 'Significance Assessment Form',
        status: 'complete',
        existing: 'Built into BreachModule with structured questionnaire',
        gap: 'None',
        priority: 'N/A',
        component: 'Existing: BreachModule.tsx ✅'
      },
      {
        requirement: 'Remediation Tracker',
        status: 'complete',
        existing: 'Part of BreachModule',
        gap: 'None',
        priority: 'N/A',
        component: 'Existing: BreachModule.tsx ✅'
      }
    ]
  },
  'ASIC RG271 Complaints': {
    items: [
      {
        requirement: 'Complaints Register & Workflow',
        status: 'missing',
        existing: 'General case management exists, AFCA mentions in disclosure docs',
        gap: 'Need full complaints module: intake (portal/email/phone/manual), category, complainant details, related client/loan, urgent/hardship flags, acknowledgment tracking, 24hr/30day SLA timers, assigned officer, investigation notes, outcome, resolution, AFCA referral, IDR data fields',
        priority: 'HIGH',
        component: 'Create: ComplaintsModule.tsx'
      },
      {
        requirement: 'Complaints Dashboard & SLA Tracking',
        status: 'missing',
        existing: 'None',
        gap: 'Need complaints inbox, SLA dashboard, overdue widgets, resolution workflow, outcome letter generator, management reporting',
        priority: 'HIGH',
        component: 'Create: ComplaintsDashboard.tsx'
      },
      {
        requirement: 'Complaint Statuses & Timers',
        status: 'missing',
        existing: 'None',
        gap: 'Need statuses: New, Acknowledged, Investigating, Waiting on Client, Escalated, Resolved, Closed + 24hr acknowledgment timer, 30 day resolution timer, urgent escalation alerts',
        priority: 'HIGH',
        component: 'Part of ComplaintsModule.tsx'
      }
    ]
  },
  'SOC 2 / ISO 27001': {
    items: [
      {
        requirement: 'Access Control & Permissions',
        status: 'complete',
        existing: 'RoleAccessControl.tsx exists with RBAC, permission matrix, MFA enforcement',
        gap: 'None - already includes role-based access, least privilege, session tracking',
        priority: 'N/A',
        component: 'Existing: RoleAccessControl.tsx ✅'
      },
      {
        requirement: 'Audit Logs',
        status: 'partial',
        existing: 'AuditDashboard.tsx exists',
        gap: 'Need immutable audit trail for: login/logout, file view/download, KYC edit, risk score change, manual override, report gen, permission change, complaint/breach status change, data export - with searchable filters by user/client/action/module/date, exportable logs',
        priority: 'MEDIUM',
        component: 'Enhance: AuditLogViewer.tsx'
      },
      {
        requirement: 'Data Protection & Retention Controls',
        status: 'partial',
        existing: 'ComprehensiveSettings has retention policies',
        gap: 'Need encryption status indicators, field-level protection tags (ID, TFN, passport, license), archive status, deletion request workflow, legal hold flags',
        priority: 'MEDIUM',
        component: 'Enhance: DataProtectionControls.tsx'
      },
      {
        requirement: 'Security Incident Register',
        status: 'missing',
        existing: 'BreachModule covers regulatory breaches',
        gap: 'Need separate security incident register: incident type, date detected, severity, affected system/data, containment action, investigation owner, regulator notification required, customer notification required, closure summary, lessons learned',
        priority: 'HIGH',
        component: 'Create: SecurityIncidentRegister.tsx'
      },
      {
        requirement: 'Vendor & Integration Register',
        status: 'partial',
        existing: 'IntegrationHub shows integrations, ComprehensiveSettings has provider credentials',
        gap: 'Need vendor risk module: vendor name, integration type, data shared, owner, risk rating, contract status, review date, security review outcome, ISO/SOC evidence, subprocessor notes',
        priority: 'MEDIUM',
        component: 'Create: VendorRiskRegister.tsx'
      }
    ]
  },
  'Cross-Module Controls': {
    items: [
      {
        requirement: 'Version History & Approval Tracking',
        status: 'partial',
        existing: 'Some components have modified by/date fields',
        gap: 'Need consistent version history, approved by, last modified by/date, comments/notes across all modules',
        priority: 'LOW',
        component: 'Add to all modules'
      },
      {
        requirement: 'Document Attachments & Linked Records',
        status: 'partial',
        existing: 'DocumentUploadSystem exists, some linking in EvidenceVault',
        gap: 'Need consistent document attachment UI and linked records panel across all modules',
        priority: 'LOW',
        component: 'Standardize across modules'
      },
      {
        requirement: 'Task Creation & Escalation',
        status: 'partial',
        existing: 'ActionItemsCenter exists for tasks',
        gap: 'Need task creation from any module, escalation owner assignment, due dates, reminder notifications',
        priority: 'LOW',
        component: 'Enhance task creation'
      },
      {
        requirement: 'Export to PDF/CSV',
        status: 'partial',
        existing: 'Some components have download buttons',
        gap: 'Need consistent PDF and CSV export across all registers and reports',
        priority: 'LOW',
        component: 'Add export functionality'
      }
    ]
  },
  'Dashboards': {
    items: [
      {
        requirement: 'Compliance Operations Dashboard',
        status: 'partial',
        existing: 'PersonalizedDashboard, ComplianceOfficerDashboard exist',
        gap: 'Need consolidated view: high risk clients, pending reviews, unresolved screening hits, overdue complaints, open breaches, unresolved incidents, upcoming AML policy reviews',
        priority: 'MEDIUM',
        component: 'Create: ComplianceOperationsDashboard.tsx'
      },
      {
        requirement: 'Management Dashboard',
        status: 'partial',
        existing: 'PartnerDashboard exists with some metrics',
        gap: 'Need: client risk distribution, complaint aging, breach aging, review completion rates, verification completion, unresolved escalations, user access exceptions',
        priority: 'MEDIUM',
        component: 'Enhance: ManagementReportingDashboard.tsx'
      },
      {
        requirement: 'Security Dashboard',
        status: 'missing',
        existing: 'AuditDashboard has some security elements',
        gap: 'Need: failed logins, MFA status, privileged access users, audit log anomalies, open incidents, vendor review due dates',
        priority: 'MEDIUM',
        component: 'Create: SecurityDashboard.tsx'
      }
    ]
  }
};

export function RegulatoryGapAnalysis({ onBack }: RegulatoryGapAnalysisProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const getCategoryStats = (category: typeof gapAnalysis[keyof typeof gapAnalysis]) => {
    const complete = category.items.filter(i => i.status === 'complete').length;
    const partial = category.items.filter(i => i.status === 'partial').length;
    const missing = category.items.filter(i => i.status === 'missing').length;
    const total = category.items.length;
    
    return { complete, partial, missing, total };
  };

  const overallStats = Object.values(gapAnalysis).reduce((acc, category) => {
    const stats = getCategoryStats(category);
    return {
      complete: acc.complete + stats.complete,
      partial: acc.partial + stats.partial,
      missing: acc.missing + stats.missing,
      total: acc.total + stats.total
    };
  }, { complete: 0, partial: 0, missing: 0, total: 0 });

  const completionPercentage = Math.round(
    ((overallStats.complete + (overallStats.partial * 0.5)) / overallStats.total) * 100
  );

  return (
    <div className="min-h-screen bg-[#0a0e17]">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="h-6 w-px bg-white/30" />
            <Shield className="w-10 h-10" />
            <div>
              <h1 className="text-3xl font-bold">Regulatory Gap Analysis</h1>
              <p className="text-indigo-100 text-sm">
                System Readiness Assessment for AUSTRAC, NCCP, ASIC RG78/271, SOC 2 & ISO 27001
              </p>
            </div>
          </div>
          <Button className="bg-[#0d121d] text-indigo-600 hover:bg-indigo-50">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Overall Progress */}
        <Card className="bg-white/10 border-white/20 backdrop-blur">
          <CardContent className="p-6">
            <div className="grid grid-cols-4 gap-6">
              <div>
                <div className="text-4xl font-bold">{completionPercentage}%</div>
                <div className="text-indigo-100 text-sm mt-1">Overall Completion</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-300">{overallStats.complete}</div>
                <div className="text-indigo-100 text-sm mt-1">Complete</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-amber-300">{overallStats.partial}</div>
                <div className="text-indigo-100 text-sm mt-1">Partial</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-red-300">{overallStats.missing}</div>
                <div className="text-indigo-100 text-sm mt-1">Missing</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid gap-6">
          {Object.entries(gapAnalysis).map(([categoryName, category]) => {
            const stats = getCategoryStats(category);
            const categoryCompletion = Math.round(
              ((stats.complete + (stats.partial * 0.5)) / stats.total) * 100
            );

            return (
              <Card key={categoryName} className="border-2">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        {categoryName === 'AML/AUSTRAC Tranche 2' && <Shield className="w-6 h-6 text-blue-600" />}
                        {categoryName === 'NCCP Compliance' && <FileText className="w-6 h-6 text-purple-600" />}
                        {categoryName === 'ASIC RG78 Breach Reporting' && <AlertTriangle className="w-6 h-6 text-orange-600" />}
                        {categoryName === 'ASIC RG271 Complaints' && <Users className="w-6 h-6 text-teal-600" />}
                        {categoryName === 'SOC 2 / ISO 27001' && <Lock className="w-6 h-6 text-red-600" />}
                        {categoryName === 'Cross-Module Controls' && <Activity className="w-6 h-6 text-green-600" />}
                        {categoryName === 'Dashboards' && <Database className="w-6 h-6 text-indigo-600" />}
                        {categoryName}
                      </CardTitle>
                      <CardDescription>
                        {stats.complete} complete • {stats.partial} partial • {stats.missing} missing
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-indigo-600">{categoryCompletion}%</div>
                      <div className="text-xs text-slate-400">Completion</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {category.items.map((item, idx) => (
                      <div 
                        key={idx}
                        className={`p-4 rounded-lg border-2 ${
                          item.status === 'complete' ? 'bg-green-50 border-green-300' :
                          item.status === 'partial' ? 'bg-amber-50 border-amber-300' :
                          'bg-red-50 border-red-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {item.status === 'complete' && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />}
                          {item.status === 'partial' && <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />}
                          {item.status === 'missing' && <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />}
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-bold text-white">{item.requirement}</h4>
                              {item.priority && item.priority !== 'N/A' && (
                                <Badge className={
                                  item.priority === 'HIGH' ? 'bg-red-600' :
                                  item.priority === 'MEDIUM' ? 'bg-amber-600' :
                                  'bg-blue-600'
                                }>
                                  {item.priority}
                                </Badge>
                              )}
                            </div>
                            
                            {item.existing && (
                              <div className="mb-2">
                                <span className="text-xs font-semibold text-green-700">✅ Existing: </span>
                                <span className="text-xs text-slate-300">{item.existing}</span>
                              </div>
                            )}
                            
                            {item.gap && item.gap !== 'None' && (
                              <div className="mb-2">
                                <span className="text-xs font-semibold text-red-700">❌ Gap: </span>
                                <span className="text-xs text-slate-300">{item.gap}</span>
                              </div>
                            )}
                            
                            <div className="mt-2 p-2 bg-white/80 rounded border border-white/10">
                              <span className="text-xs font-semibold text-indigo-700">📦 Component: </span>
                              <code className="text-xs text-indigo-900 font-mono">{item.component}</code>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Implementation Roadmap */}
        <Card className="mt-6 border-2 border-purple-200">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="text-xl">📋 Implementation Roadmap - Priority Sequence</CardTitle>
            <CardDescription>Recommended order for closing regulatory gaps</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg border-2 border-red-300">
                <h3 className="font-bold text-red-900 mb-2">🔴 PHASE 1: HIGH PRIORITY (Regulatory Risk)</h3>
                <ul className="text-sm text-red-800 space-y-1 ml-4">
                  <li>1. <strong>AMLProgramManagement.tsx</strong> - AUSTRAC Part A/B program compliance</li>
                  <li>2. <strong>CustomerRiskScoringEngine.tsx</strong> - Structured AML risk scoring</li>
                  <li>3. <strong>OngoingDueDiligenceHub.tsx</strong> - ODD review management</li>
                  <li>4. <strong>SuspiciousMatterReporting.tsx</strong> - SMR workflow for AUSTRAC</li>
                  <li>5. <strong>ComplaintsModule.tsx</strong> - ASIC RG271 complaints handling</li>
                  <li>6. <strong>SecurityIncidentRegister.tsx</strong> - ISO 27001 incident management</li>
                  <li>7. <strong>VerificationEvidenceHub.tsx</strong> - NCCP evidence linking</li>
                </ul>
              </div>

              <div className="p-4 bg-amber-50 rounded-lg border-2 border-amber-300">
                <h3 className="font-bold text-amber-900 mb-2">🟡 PHASE 2: MEDIUM PRIORITY (Operational Excellence)</h3>
                <ul className="text-sm text-amber-800 space-y-1 ml-4">
                  <li>8. <strong>ScreeningAlertCenter.tsx</strong> - Centralized screening alerts</li>
                  <li>9. <strong>ConsumerProfileCapture.tsx</strong> - Enhanced NCCP borrower data</li>
                  <li>10. <strong>DisclosureRegister.tsx</strong> - Disclosure tracking</li>
                  <li>11. <strong>VendorRiskRegister.tsx</strong> - Third-party risk management</li>
                  <li>12. <strong>ComplianceOperationsDashboard.tsx</strong> - Operations overview</li>
                  <li>13. <strong>ManagementReportingDashboard.tsx</strong> - Executive reporting</li>
                  <li>14. <strong>SecurityDashboard.tsx</strong> - Security metrics</li>
                  <li>15. <strong>AuditLogViewer.tsx</strong> - Enhanced audit trails</li>
                </ul>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-300">
                <h3 className="font-bold text-blue-900 mb-2">🔵 PHASE 3: LOW PRIORITY (Polish & Standardization)</h3>
                <ul className="text-sm text-blue-800 space-y-1 ml-4">
                  <li>16. Cross-module version history standardization</li>
                  <li>17. Consistent document attachment UI</li>
                  <li>18. Enhanced task creation from all modules</li>
                  <li>19. PDF/CSV export standardization</li>
                  <li>20. Data protection field-level indicators</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

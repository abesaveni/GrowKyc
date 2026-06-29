// Practice Assessment & Client Acceptance Component
import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle, AlertCircle, Shield, XCircle, Users, Briefcase, Scale, FileText, AlertTriangle, Clock } from 'lucide-react';
import { PrimaryButton, SecondaryButton, StatusBadge } from './DesignSystem';
import { toast } from 'sonner';

interface PracticeAssessmentProps {
  entities: any[];
  onBack: () => void;
  onContinue: () => void;
  canProgress: boolean;
}

export function PracticeAssessment({ entities, onBack, onContinue, canProgress }: PracticeAssessmentProps) {
  const [assessmentData, setAssessmentData] = useState({
    // Conflict of Interest
    conflictCheck: false,
    conflictDetails: '',
    conflictResult: 'pending' as 'clear' | 'conflict' | 'pending',
    
    // Skill Set & Capability
    hasRequiredSkills: false,
    skillGaps: [] as string[],
    specialistRequired: false,
    specialistDetails: '',
    
    // Capacity Assessment
    hasCapacity: false,
    capacityNotes: '',
    estimatedHours: '',
    resourceAllocation: '',
    
    // Independence Check
    independenceCheck: false,
    independenceIssues: '',
    independenceResult: 'pending' as 'independent' | 'issues' | 'pending',
    
    // Risk Assessment (Practice Perspective)
    practiceRiskLevel: 'not-assessed' as 'low' | 'medium' | 'high' | 'not-assessed',
    riskFactors: [] as string[],
    mitigationPlan: '',
    
    // Professional Standards
    ethicsCompliant: false,
    regulatoryCompliant: false,
    insuranceCover: false,
    
    // Services Assessment
    servicesApproved: [] as string[],
    servicesRejected: [] as string[],
    servicesNotes: '',
    
    // Fee Assessment
    feesAcceptable: false,
    feeAdjustments: '',
    proposedFees: 0,
    
    // Final Decision
    decision: 'pending' as 'accept' | 'reject' | 'conditional' | 'pending',
    decisionReason: '',
    conditions: '',
    assessedBy: '',
    assessedAt: '',
    
    // AUSTRAC Compliance
    austracRiskRating: 'not-assessed' as 'low' | 'medium' | 'high' | 'not-assessed',
    policyExceptions: [] as string[],
    seniorApprovalRequired: false,
    seniorApprovalReceived: false,
    
    // Audit Trail
    assessmentLog: [] as any[]
  });

  const [currentTab, setCurrentTab] = useState<'conflicts' | 'capability' | 'risk' | 'compliance' | 'decision'>('conflicts');

  const updateAssessment = (field: string, value: any) => {
    const updated = {
      ...assessmentData,
      [field]: value,
      assessmentLog: [
        ...(assessmentData.assessmentLog || []),
        {
          timestamp: new Date().toISOString(),
          field,
          value,
          user: 'Practice Manager'
        }
      ]
    };
    setAssessmentData(updated);
  };

  const calculatePracticeRisk = () => {
    let score = 0;
    
    // Conflict of interest
    if (assessmentData.conflictResult === 'conflict') score += 3;
    
    // Capacity issues
    if (!assessmentData.hasCapacity) score += 2;
    
    // Skill gaps
    if (assessmentData.skillGaps.length > 0) score += 1;
    if (assessmentData.specialistRequired) score += 2;
    
    // Independence issues
    if (assessmentData.independenceResult === 'issues') score += 3;
    
    // Complex services
    const allServices = entities.flatMap(e => e.services);
    if (allServices.some(s => s.includes('Advisory') || s.includes('SMSF') || s.includes('Audit'))) score += 1;
    
    // Multiple entities
    if (entities.length > 3) score += 1;
    
    if (score >= 6) return 'high';
    if (score >= 3) return 'medium';
    return 'low';
  };

  const performAutomaticChecks = () => {
    // Auto-calculate risk
    const risk = calculatePracticeRisk();
    updateAssessment('practiceRiskLevel', risk);
    
    // Auto-flag senior approval if high risk
    if (risk === 'high') {
      updateAssessment('seniorApprovalRequired', true);
    }
    
    toast.info('Automatic risk assessment complete');
  };

  const handleFinalDecision = (decision: 'accept' | 'reject' | 'conditional') => {
    if (!assessmentData.assessedBy) {
      toast.error('Please enter your name as assessor');
      return;
    }

    if (!assessmentData.decisionReason) {
      toast.error('Please provide reason for decision');
      return;
    }

    if (decision === 'accept' && assessmentData.practiceRiskLevel === 'high' && !assessmentData.seniorApprovalReceived) {
      toast.error('High risk clients require senior partner approval');
      return;
    }

    const finalData = {
      ...assessmentData,
      decision,
      assessedAt: new Date().toISOString()
    };

    setAssessmentData(finalData);

    if (decision === 'accept') {
      toast.success('✓ Client accepted - Proceeding to engagement');
      setTimeout(() => onContinue(), 1500);
    } else if (decision === 'reject') {
      toast.error('Client engagement declined');
    } else {
      toast.warning('Client accepted with conditions');
      setTimeout(() => onContinue(), 1500);
    }
  };

  const totalAnnual = entities.reduce((sum, e) => sum + e.pricing, 0);
  const allServices = entities.flatMap(e => e.services);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Practice Assessment & Client Acceptance</h2>
        <p className="text-gray-600">Evaluate if the practice can service this client and meet all compliance requirements</p>
      </div>

      {/* Client Summary */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-4">Client Request Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-blue-700 font-semibold">Entities</p>
            <p className="text-2xl font-bold text-blue-900">{entities.length}</p>
            <p className="text-xs text-blue-600">{entities.map(e => e.type).join(', ')}</p>
          </div>
          <div>
            <p className="text-sm text-blue-700 font-semibold">Services</p>
            <p className="text-2xl font-bold text-blue-900">{allServices.length}</p>
            <p className="text-xs text-blue-600">{allServices.slice(0, 3).join(', ')}{allServices.length > 3 ? '...' : ''}</p>
          </div>
          <div>
            <p className="text-sm text-blue-700 font-semibold">Annual Fees</p>
            <p className="text-2xl font-bold text-blue-900">${totalAnnual.toLocaleString()}</p>
            <p className="text-xs text-blue-600">${Math.round(totalAnnual / 12).toLocaleString()}/month</p>
          </div>
        </div>
      </div>

      {/* Assessment Tabs */}
      <div className="bg-white border-2 border-gray-200 rounded-lg">
        <div className="border-b-2 border-gray-200 flex overflow-x-auto">
          {[
            { id: 'conflicts', label: 'Conflicts', icon: AlertTriangle },
            { id: 'capability', label: 'Capability', icon: Briefcase },
            { id: 'risk', label: 'Risk Assessment', icon: Shield },
            { id: 'compliance', label: 'Compliance', icon: Scale },
            { id: 'decision', label: 'Final Decision', icon: CheckCircle }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id as any)}
                className={`px-6 py-3 font-semibold flex items-center gap-2 whitespace-nowrap ${
                  currentTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* Conflicts Tab */}
          {currentTab === 'conflicts' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
                Conflict of Interest Check
              </h3>

              <div className="space-y-4">
                <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={assessmentData.conflictCheck}
                    onChange={(e) => updateAssessment('conflictCheck', e.target.checked)}
                    className="mt-1 w-5 h-5"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Conflict of Interest Check Completed</p>
                    <p className="text-sm text-gray-600">Checked all existing clients, matters, and relationships</p>
                  </div>
                </label>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Conflict Check Details
                  </label>
                  <textarea
                    value={assessmentData.conflictDetails}
                    onChange={(e) => updateAssessment('conflictDetails', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    rows={3}
                    placeholder="Document any conflicts identified, related parties checked, databases searched..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Conflict Result
                  </label>
                  <select
                    value={assessmentData.conflictResult}
                    onChange={(e) => updateAssessment('conflictResult', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="pending">Pending</option>
                    <option value="clear">No Conflicts - Clear to Proceed</option>
                    <option value="conflict">Conflict Identified - Cannot Proceed</option>
                  </select>
                </div>

                {assessmentData.conflictResult === 'conflict' && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                    <p className="text-red-900 font-semibold flex items-center gap-2">
                      <XCircle className="w-5 h-5" />
                      Conflict of Interest Identified
                    </p>
                    <p className="text-sm text-red-700 mt-1">
                      This engagement cannot proceed due to conflicts. Document fully and reject client.
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Independence Check
                  </label>
                  <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={assessmentData.independenceCheck}
                      onChange={(e) => updateAssessment('independenceCheck', e.target.checked)}
                      className="mt-1 w-5 h-5"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Independence Verified</p>
                      <p className="text-sm text-gray-600">No independence threats identified (self-interest, self-review, advocacy, familiarity, intimidation)</p>
                    </div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Independence Notes
                  </label>
                  <textarea
                    value={assessmentData.independenceIssues}
                    onChange={(e) => updateAssessment('independenceIssues', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    rows={2}
                    placeholder="Document independence assessment and any safeguards..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Capability Tab */}
          {currentTab === 'capability' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-purple-600" />
                Capability & Capacity Assessment
              </h3>

              <div className="space-y-4">
                <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={assessmentData.hasRequiredSkills}
                    onChange={(e) => updateAssessment('hasRequiredSkills', e.target.checked)}
                    className="mt-1 w-5 h-5"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Practice Has Required Skills & Expertise</p>
                    <p className="text-sm text-gray-600">Staff qualified and experienced in all requested services</p>
                  </div>
                </label>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Skill Gaps or Specialist Requirements
                  </label>
                  <div className="space-y-2">
                    {['SMSF Expertise', 'International Tax', 'Complex Trusts', 'Forensic Accounting', 'Business Valuation'].map(skill => (
                      <label key={skill} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={assessmentData.skillGaps.includes(skill)}
                          onChange={(e) => {
                            const gaps = e.target.checked
                              ? [...assessmentData.skillGaps, skill]
                              : assessmentData.skillGaps.filter(s => s !== skill);
                            updateAssessment('skillGaps', gaps);
                          }}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={assessmentData.specialistRequired}
                    onChange={(e) => updateAssessment('specialistRequired', e.target.checked)}
                    className="mt-1 w-5 h-5"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">External Specialist Required</p>
                    <p className="text-sm text-gray-600">Need to engage external consultant or refer specific services</p>
                  </div>
                </label>

                {assessmentData.specialistRequired && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Specialist Details
                    </label>
                    <textarea
                      value={assessmentData.specialistDetails}
                      onChange={(e) => updateAssessment('specialistDetails', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      rows={2}
                      placeholder="Which specialists, estimated cost, availability..."
                    />
                  </div>
                )}

                <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={assessmentData.hasCapacity}
                    onChange={(e) => updateAssessment('hasCapacity', e.target.checked)}
                    className="mt-1 w-5 h-5"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Practice Has Capacity</p>
                    <p className="text-sm text-gray-600">Sufficient resources and time to service this client properly</p>
                  </div>
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Estimated Annual Hours
                    </label>
                    <input
                      type="number"
                      value={assessmentData.estimatedHours}
                      onChange={(e) => updateAssessment('estimatedHours', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="e.g. 120"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Resource Allocation
                    </label>
                    <input
                      type="text"
                      value={assessmentData.resourceAllocation}
                      onChange={(e) => updateAssessment('resourceAllocation', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="e.g. Sarah (Senior), Tom (Associate)"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Capacity Notes
                  </label>
                  <textarea
                    value={assessmentData.capacityNotes}
                    onChange={(e) => updateAssessment('capacityNotes', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    rows={2}
                    placeholder="Timing considerations, workload impacts, resourcing plan..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Risk Assessment Tab */}
          {currentTab === 'risk' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-red-600" />
                  Practice Risk Assessment (AUSTRAC Compliant)
                </h3>
                <SecondaryButton onClick={performAutomaticChecks}>
                  Auto-Calculate Risk
                </SecondaryButton>
              </div>

              <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-3">
                  <strong>Current Risk Rating:</strong>
                </p>
                <span className={`px-4 py-2 text-lg font-bold rounded ${
                  assessmentData.practiceRiskLevel === 'low' ? 'bg-green-100 text-green-700' :
                  assessmentData.practiceRiskLevel === 'medium' ? 'bg-amber-100 text-amber-700' :
                  assessmentData.practiceRiskLevel === 'high' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {assessmentData.practiceRiskLevel.toUpperCase()}
                </span>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Practice Risk Factors (Select all that apply)
                </label>
                <div className="space-y-2">
                  {[
                    'Reputational Risk',
                    'Legal/Regulatory Risk',
                    'Professional Liability Risk',
                    'Client Credibility Issues',
                    'Complex Structures',
                    'High-Profile Client',
                    'Litigation Involved',
                    'Fee Collection Concerns',
                    'Unclear Scope',
                    'Time Pressure'
                  ].map(factor => (
                    <label key={factor} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={assessmentData.riskFactors.includes(factor)}
                        onChange={(e) => {
                          const factors = e.target.checked
                            ? [...assessmentData.riskFactors, factor]
                            : assessmentData.riskFactors.filter(f => f !== factor);
                          updateAssessment('riskFactors', factors);
                        }}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-700">{factor}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  AUSTRAC Risk Rating
                </label>
                <select
                  value={assessmentData.austracRiskRating}
                  onChange={(e) => updateAssessment('austracRiskRating', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="not-assessed">Not Assessed</option>
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Risk Mitigation Plan
                </label>
                <textarea
                  value={assessmentData.mitigationPlan}
                  onChange={(e) => updateAssessment('mitigationPlan', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows={4}
                  placeholder="Document risk mitigation strategies: enhanced monitoring, senior review, scope limitations, insurance review, etc."
                />
              </div>

              {(assessmentData.practiceRiskLevel === 'high' || assessmentData.austracRiskRating === 'high') && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                  <p className="text-red-900 font-semibold flex items-center gap-2 mb-3">
                    <AlertCircle className="w-5 h-5" />
                    High Risk Client - Senior Approval Required
                  </p>
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={assessmentData.seniorApprovalReceived}
                      onChange={(e) => updateAssessment('seniorApprovalReceived', e.target.checked)}
                      className="mt-1 w-5 h-5"
                    />
                    <div>
                      <p className="font-semibold text-red-900">Senior Partner Approval Received</p>
                      <p className="text-sm text-red-700">Managing partner has reviewed and approved this engagement</p>
                    </div>
                  </label>
                </div>
              )}
            </div>
          )}

          {/* Compliance Tab */}
          {currentTab === 'compliance' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Scale className="w-6 h-6 text-indigo-600" />
                Professional Standards & Compliance
              </h3>

              <div className="space-y-4">
                <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={assessmentData.ethicsCompliant}
                    onChange={(e) => updateAssessment('ethicsCompliant', e.target.checked)}
                    className="mt-1 w-5 h-5"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Ethics Compliance</p>
                    <p className="text-sm text-gray-600">Engagement complies with APES 110 Code of Ethics and professional standards</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={assessmentData.regulatoryCompliant}
                    onChange={(e) => updateAssessment('regulatoryCompliant', e.target.checked)}
                    className="mt-1 w-5 h-5"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Regulatory Compliance</p>
                    <p className="text-sm text-gray-600">Complies with TPB, ASIC, ATO, and AUSTRAC requirements</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={assessmentData.insuranceCover}
                    onChange={(e) => updateAssessment('insuranceCover', e.target.checked)}
                    className="mt-1 w-5 h-5"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Professional Indemnity Insurance</p>
                    <p className="text-sm text-gray-600">Current PI insurance covers scope and risk of this engagement</p>
                  </div>
                </label>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Services Assessment
                  </label>
                  <p className="text-sm text-gray-600 mb-3">Review each requested service</p>
                  <div className="space-y-2">
                    {allServices.map(service => (
                      <div key={service} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-semibold text-gray-900">{service}</span>
                        <select
                          value={
                            assessmentData.servicesApproved.includes(service) ? 'approved' :
                            assessmentData.servicesRejected.includes(service) ? 'rejected' :
                            'pending'
                          }
                          onChange={(e) => {
                            if (e.target.value === 'approved') {
                              updateAssessment('servicesApproved', [...assessmentData.servicesApproved, service]);
                              updateAssessment('servicesRejected', assessmentData.servicesRejected.filter(s => s !== service));
                            } else if (e.target.value === 'rejected') {
                              updateAssessment('servicesRejected', [...assessmentData.servicesRejected, service]);
                              updateAssessment('servicesApproved', assessmentData.servicesApproved.filter(s => s !== service));
                            }
                          }}
                          className="px-3 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Services Notes
                  </label>
                  <textarea
                    value={assessmentData.servicesNotes}
                    onChange={(e) => updateAssessment('servicesNotes', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    rows={2}
                    placeholder="Notes on service scope, limitations, or concerns..."
                  />
                </div>

                <div>
                  <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={assessmentData.feesAcceptable}
                      onChange={(e) => updateAssessment('feesAcceptable', e.target.checked)}
                      className="mt-1 w-5 h-5"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Proposed Fees Acceptable</p>
                      <p className="text-sm text-gray-600">Client's proposed fees are acceptable for scope and risk</p>
                    </div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fee Adjustments or Alternative Proposal
                  </label>
                  <textarea
                    value={assessmentData.feeAdjustments}
                    onChange={(e) => updateAssessment('feeAdjustments', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    rows={2}
                    placeholder="Document any fee adjustments needed, payment terms, retainers..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Final Decision Tab */}
          {currentTab === 'decision' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                Final Decision
              </h3>

              {/* Decision Summary */}
              <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6">
                <h4 className="font-bold text-gray-900 mb-4">Assessment Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Conflict Check:</p>
                    <p className="font-semibold">{assessmentData.conflictResult.toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Skills & Capacity:</p>
                    <p className="font-semibold">{assessmentData.hasRequiredSkills && assessmentData.hasCapacity ? 'ADEQUATE' : 'CONCERNS'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Practice Risk:</p>
                    <p className={`font-semibold ${
                      assessmentData.practiceRiskLevel === 'high' ? 'text-red-700' :
                      assessmentData.practiceRiskLevel === 'medium' ? 'text-amber-700' :
                      'text-green-700'
                    }`}>{assessmentData.practiceRiskLevel.toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Compliance:</p>
                    <p className="font-semibold">{assessmentData.ethicsCompliant && assessmentData.regulatoryCompliant ? 'COMPLIANT' : 'REVIEW NEEDED'}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Assessed By <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={assessmentData.assessedBy}
                  onChange={(e) => updateAssessment('assessedBy', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Your name and role"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Decision Rationale <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={assessmentData.decisionReason}
                  onChange={(e) => updateAssessment('decisionReason', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows={4}
                  placeholder="Document full rationale for decision, key considerations, risk factors addressed..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Conditions or Special Requirements
                </label>
                <textarea
                  value={assessmentData.conditions}
                  onChange={(e) => updateAssessment('conditions', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                  placeholder="Any conditions for acceptance: enhanced monitoring, scope limitations, reporting requirements, etc."
                />
              </div>

              {/* Decision Buttons */}
              <div className="border-t-2 border-gray-300 pt-6 mt-6">
                <p className="text-sm text-gray-700 mb-4 font-semibold">Make Your Decision:</p>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => handleFinalDecision('accept')}
                    className="p-6 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition-colors text-center"
                  >
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="font-bold text-green-900">ACCEPT</p>
                    <p className="text-xs text-green-700 mt-1">Proceed to engagement</p>
                  </button>
                  
                  <button
                    onClick={() => handleFinalDecision('conditional')}
                    className="p-6 bg-amber-50 border-2 border-amber-200 rounded-lg hover:bg-amber-100 transition-colors text-center"
                  >
                    <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                    <p className="font-bold text-amber-900">CONDITIONAL</p>
                    <p className="text-xs text-amber-700 mt-1">Accept with conditions</p>
                  </button>
                  
                  <button
                    onClick={() => handleFinalDecision('reject')}
                    className="p-6 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 transition-colors text-center"
                  >
                    <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <p className="font-bold text-red-900">DECLINE</p>
                    <p className="text-xs text-red-700 mt-1">Reject engagement</p>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <SecondaryButton onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Services
        </SecondaryButton>
        
        {assessmentData.decision !== 'pending' && (
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-2">Assessment Complete</p>
            <StatusBadge
              status={
                assessmentData.decision === 'accept' ? 'approved' :
                assessmentData.decision === 'conditional' ? 'pending' :
                'rejected'
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Shield,
  Users,
  FileText,
  Settings,
  CheckCircle,
  AlertTriangle,
  Scale,
  Clock,
  Archive,
  TrendingUp,
  ArrowLeft,
  ChevronRight,
  Lock
} from 'lucide-react';

// Import all modules
import { RiskAssessmentMaster } from './accounting-modules/RiskAssessmentMaster';

// Mock components for modules that do not exist
const PersonnelPolicyMaster = ({ onComplete }: { onComplete: (data: any) => void }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6">
    <h3 className="text-xl font-bold mb-4">Personnel Policy Master</h3>
    <Button onClick={() => onComplete(null)}>Complete Module</Button>
  </div>
);

const ClientPolicyMaster = ({ onComplete }: { onComplete: (data: any) => void }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6">
    <h3 className="text-xl font-bold mb-4">Client Policy Master</h3>
    <Button onClick={() => onComplete(null)}>Complete Module</Button>
  </div>
);

const MaintainProgramMaster = ({ onComplete }: { onComplete: (data: any) => void }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6">
    <h3 className="text-xl font-bold mb-4">Maintain Program Master</h3>
    <Button onClick={() => onComplete(null)}>Complete Module</Button>
  </div>
);

const ProcessesAndForms = () => (
  <div className="bg-white border border-gray-200 rounded-lg p-6">
    <h3 className="text-xl font-bold mb-4">Processes & Forms</h3>
  </div>
);

const DocumentApprovalLayer = ({ programStatus, onApprove }: { programStatus: any; onApprove: () => void }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6">
    <h3 className="text-xl font-bold mb-4">Document & Approve Layer</h3>
    <Button onClick={onApprove}>Approve Program</Button>
  </div>
);

type MasterView = 
  | 'navigation'
  | 'risk_assessment'
  | 'personnel_policy'
  | 'client_policy'
  | 'maintain_program'
  | 'processes_forms'
  | 'document_approval';

interface AccountingAMLMasterProps {
  onBack?: () => void;
}

export function AccountingAMLMaster({ onBack }: AccountingAMLMasterProps) {
  const [currentView, setCurrentView] = useState<MasterView>('navigation');
  const [programStatus, setProgramStatus] = useState({
    riskAssessmentComplete: false,
    personnelPolicyComplete: false,
    clientPolicyComplete: false,
    maintainProgramComplete: false,
    seniorManagerApproval: false,
    austracEnrolled: false
  });

  // Navigation View - Master Structure
  if (currentView === 'navigation') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center">
                  <Shield className="w-12 h-12" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold mb-2">Accounting Industry AML/CTF</h1>
                  <p className="text-xl text-green-100">AUSTRAC Designated Services Compliance System</p>
                  <p className="text-sm text-green-200 mt-2">Based on: Risk Assessment, Policy Document, Customise Guide (January 2026)</p>
                </div>
              </div>
              {programStatus.seniorManagerApproval && (
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 mx-auto mb-2" />
                  <p className="font-bold">PROGRAM APPROVED</p>
                </div>
              )}
            </div>
          </div>

          {/* Critical Notice */}
          {!programStatus.seniorManagerApproval && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-8">
              <div className="flex items-start">
                <AlertTriangle className="w-6 h-6 text-red-600 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-bold text-red-900 mb-2">PROGRAM ACTIVATION BLOCKED</h3>
                  <p className="text-red-700 mb-3">
                    Cannot provide designated services until ALL modules are complete and Senior Manager approval obtained.
                  </p>
                  <div className="space-y-1 text-sm">
                    {!programStatus.riskAssessmentComplete && (
                      <p className="text-red-700">• Risk Assessment incomplete</p>
                    )}
                    {!programStatus.personnelPolicyComplete && (
                      <p className="text-red-700">• Personnel Policy incomplete</p>
                    )}
                    {!programStatus.clientPolicyComplete && (
                      <p className="text-red-700">• Client Policy incomplete</p>
                    )}
                    {!programStatus.maintainProgramComplete && (
                      <p className="text-red-700">• Maintain Program incomplete</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Program Status Overview */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900">Program Status</h3>
                {programStatus.seniorManagerApproval ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <Lock className="w-6 h-6 text-red-600" />
                )}
              </div>
              <p className={`text-2xl font-bold ${programStatus.seniorManagerApproval ? 'text-green-600' : 'text-red-600'}`}>
                {programStatus.seniorManagerApproval ? 'ACTIVE' : 'PENDING'}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {programStatus.seniorManagerApproval ? 'Designated services permitted' : 'Services blocked until approval'}
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900">AUSTRAC Enrolment</h3>
                {programStatus.austracEnrolled ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                )}
              </div>
              <p className={`text-2xl font-bold ${programStatus.austracEnrolled ? 'text-green-600' : 'text-orange-600'}`}>
                {programStatus.austracEnrolled ? 'ENROLLED' : 'REQUIRED'}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {programStatus.austracEnrolled ? 'Updates within 14 days' : 'Must enrol before services'}
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900">Completion Status</h3>
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {Object.values(programStatus).filter(Boolean).length}/6
              </p>
              <p className="text-sm text-gray-600 mt-2">Modules completed</p>
            </div>
          </div>

          {/* Master Structure - Exact Hierarchy */}
          <div className="bg-white rounded-lg border-2 border-gray-300 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Scale className="w-6 h-6 text-green-600 mr-3" />
              AUSTRAC AML/CTF Program Structure
            </h2>
            <div className="space-y-3">
              {[
                {
                  id: 'risk_assessment',
                  title: '1. Risk Assessment',
                  description: 'Designated services, client types, delivery channels, risk factors, country risk',
                  complete: programStatus.riskAssessmentComplete,
                  critical: true
                },
                {
                  id: 'personnel_policy',
                  title: '2. Policy – Personnel',
                  description: 'Role register, PDD workflows, training tracker, ongoing assessment',
                  complete: programStatus.personnelPolicyComplete,
                  critical: true
                },
                {
                  id: 'client_policy',
                  title: '3. Policy – Clients',
                  description: 'Initial CDD, Enhanced CDD, Ongoing CDD, escalation engine, offboarding',
                  complete: programStatus.clientPolicyComplete,
                  critical: true
                },
                {
                  id: 'maintain_program',
                  title: '4. Policy – Maintain Program',
                  description: 'Update triggers, effectiveness checks, independent evaluation, record keeping',
                  complete: programStatus.maintainProgramComplete,
                  critical: true
                },
                {
                  id: 'processes_forms',
                  title: '5. Processes & Forms',
                  description: 'SMR/TTR/CBM reporting, tipping off controls, AUSTRAC enrolment',
                  complete: false,
                  critical: false
                },
                {
                  id: 'document_approval',
                  title: '6. Document & Approve Layer',
                  description: 'Senior manager approval workflow, version control, audit trail',
                  complete: programStatus.seniorManagerApproval,
                  critical: true
                }
              ].map((module) => (
                <button
                  key={module.id}
                  onClick={() => setCurrentView(module.id as MasterView)}
                  className={`w-full p-6 rounded-lg border-2 text-left transition-all hover:shadow-lg ${
                    module.complete
                      ? 'border-green-500 bg-green-50'
                      : module.critical
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{module.title}</h3>
                        {module.critical && !module.complete && (
                          <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                            CRITICAL
                          </span>
                        )}
                        {module.complete && (
                          <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                            COMPLETE
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600">{module.description}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      {module.complete ? (
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      ) : module.critical ? (
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                      ) : (
                        <Clock className="w-8 h-8 text-gray-400" />
                      )}
                      <ChevronRight className="w-6 h-6 text-gray-400" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Compliance Checklist */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-bold text-blue-900 mb-4">Final Compliance Check</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                'Risk module with appetite enforcement',
                'Country risk engine',
                'Personnel PDD workflows',
                'Role assignment register',
                'Training tracker',
                'Initial CDD hard gate',
                'Enhanced CDD approval gate',
                'Monitoring and trigger engine',
                'SMR/TTR/CBM reporting engine',
                'Tipping-off restriction layer',
                'Offboarding with documentation',
                'Program maintenance workflow',
                'Effectiveness check module',
                'Independent review tracker',
                'Record retention enforcement',
                'AUSTRAC enrolment tracker',
                'Senior manager approval workflow'
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-blue-900">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Module Views
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => setCurrentView('navigation')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Master Structure
        </Button>

        {currentView === 'risk_assessment' && (
          <RiskAssessmentMaster 
            onComplete={(data) => {
              setProgramStatus(prev => ({ ...prev, riskAssessmentComplete: true }));
              setCurrentView('navigation');
            }}
          />
        )}

        {currentView === 'personnel_policy' && (
          <PersonnelPolicyMaster 
            onComplete={(data: any) => {
              setProgramStatus(prev => ({ ...prev, personnelPolicyComplete: true }));
              setCurrentView('navigation');
            }}
          />
        )}

        {currentView === 'client_policy' && (
          <ClientPolicyMaster 
            onComplete={(data: any) => {
              setProgramStatus(prev => ({ ...prev, clientPolicyComplete: true }));
              setCurrentView('navigation');
            }}
          />
        )}

        {currentView === 'maintain_program' && (
          <MaintainProgramMaster 
            onComplete={(data: any) => {
              setProgramStatus(prev => ({ ...prev, maintainProgramComplete: true }));
              setCurrentView('navigation');
            }}
          />
        )}

        {currentView === 'processes_forms' && (
          <ProcessesAndForms />
        )}

        {currentView === 'document_approval' && (
          <DocumentApprovalLayer 
            programStatus={programStatus}
            onApprove={() => {
              setProgramStatus(prev => ({ ...prev, seniorManagerApproval: true }));
              setCurrentView('navigation');
            }}
          />
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import {
  Users,
  Building2,
  FileText,
  Shield,
  CheckCircle,
  AlertTriangle,
  Plus,
  Trash2,
  Edit,
  DollarSign,
  Calendar,
  Upload,
  Search,
  Clock,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Save,
  AlertCircle,
  Lock
} from 'lucide-react';
import { PrimaryButton, SecondaryButton, StatusBadge } from './DesignSystem';
import { toast } from 'sonner';
import { ServiceSelection } from './ServiceSelection';
import { CDDDataCapture } from './CDDDataCapture';
import { EngagementLetter, InternalReviewAndApproval, ClientActivation } from './OnboardingComponents';
import { PracticeAssessment } from './PracticeAssessment';
import { PaymentStep } from './PaymentStep';

type OnboardingPhase = 'structure' | 'services' | 'payment' | 'engagement' | 'cdd' | 'review' | 'submit' | 'activation';
type EntityType = 'individual' | 'sole-trader' | 'company' | 'partnership' | 'trust' | 'government' | 'smsf';
type ComplianceStatus = 'pending' | 'in-progress' | 'complete' | 'blocked';
type RiskLevel = 'low' | 'medium' | 'high' | 'not-assessed';

interface Entity {
  id: string;
  name: string;
  type: EntityType;
  complianceStatus: ComplianceStatus;
  riskStatus: RiskLevel;
  services: string[];
  pricing: number;
  turnover?: number;
  employees?: number;
  data: {
    // Personal Details
    fullLegalName?: string;
    formerNames?: string;
    dateOfBirth?: string;
    residentialAddress?: string;
    postalAddress?: string;
    email?: string;
    phone?: string;
    occupation?: string;
    employer?: string;
    
    // Tax
    tfn?: string;
    taxResidenceCountry?: string;
    foreignTaxId?: string;
    
    // Company
    acn?: string;
    abn?: string;
    registeredOffice?: string;
    principalPlace?: string;
    industry?: string;
    dateIncorporated?: string;
    
    // Trust
    trustName?: string;
    trustType?: string;
    governingState?: string;
    dateEstablished?: string;
    
    // Government
    officialName?: string;
    legislationAuthority?: string;
    governmentLevel?: string;
    
    // Risk Flags
    cashInvolvement?: boolean;
    cryptoInvolvement?: boolean;
    pepStatus?: boolean;
    relatedPartyPep?: boolean;
    unexplainedWealth?: boolean;
    charityNpo?: boolean;
    
    // Source
    sourceOfFunds?: string;
    sourceOfWealth?: string;
    
    // Ownership
    shareholders?: any[];
    directors?: any[];
    beneficialOwners?: any[];
    trustees?: any[];
    appointors?: any[];
    beneficiaries?: any[];
    
    // Sanctions & Screening
    sanctionsScreened?: boolean;
    sanctionsResult?: 'clear' | 'hit' | 'pending';
    pepScreened?: boolean;
    pepResult?: 'clear' | 'hit' | 'pending';
    
    // Approval
    approvalStatus?: 'pending' | 'approved' | 'rejected';
    approvedBy?: string;
    approvedAt?: string;
    approvalComments?: string;
    rejectedBy?: string;
    rejectedAt?: string;
    rejectionReason?: string;
    
    // Documents
    idDocuments?: any[];
    companyDocuments?: any[];
    trustDocuments?: any[];
    
    // Audit Trail
    auditLog?: any[];
  };
}

export function ClientOnboarding({ onComplete }: { onComplete?: () => void }) {
  const [currentPhase, setCurrentPhase] = useState<OnboardingPhase>('structure');
  const [entities, setEntities] = useState<Entity[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [showAddEntity, setShowAddEntity] = useState(false);
  const [declaration, setDeclaration] = useState(false);

  const phases = [
    { id: 'structure', label: 'Build Structure', icon: Building2, color: 'blue' },
    { id: 'services', label: 'Select Services', icon: FileText, color: 'green' },
    { id: 'engagement', label: 'Engagement', icon: CheckCircle, color: 'purple' },
    { id: 'payment', label: 'Payment Setup', icon: DollarSign, color: 'emerald' },
    { id: 'cdd', label: 'AML/CDD', icon: Shield, color: 'red' },
    { id: 'review', label: 'Review', icon: Search, color: 'orange' },
    { id: 'submit', label: 'Submit', icon: CheckCircle, color: 'emerald' }
  ];

  const entityTypes = [
    { id: 'individual', label: 'Individual', icon: Users, description: 'Personal tax and advisory' },
    { id: 'sole-trader', label: 'Sole Trader', icon: Users, description: 'Individual business' },
    { id: 'company', label: 'Company', icon: Building2, description: 'Pty Ltd, Public Company' },
    { id: 'partnership', label: 'Partnership', icon: Users, description: 'Business partnership' },
    { id: 'trust', label: 'Trust', icon: Shield, description: 'Family, Unit, Discretionary' },
    { id: 'government', label: 'Government Body', icon: Building2, description: 'Government entity' },
    { id: 'smsf', label: 'SMSF', icon: DollarSign, description: 'Self-managed super fund' }
  ];

  const addEntity = (type: EntityType) => {
    const newEntity: Entity = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      type,
      complianceStatus: 'pending',
      riskStatus: 'not-assessed',
      services: [],
      pricing: 0,
      data: {
        auditLog: [{
          timestamp: new Date().toISOString(),
          action: 'Entity Created',
          user: 'Client',
          details: `${type} entity created`
        }]
      }
    };
    setEntities([...entities, newEntity]);
    setSelectedEntity(newEntity);
    setShowAddEntity(false);
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} entity added`);
  };

  const removeEntity = (id: string) => {
    setEntities(entities.filter(e => e.id !== id));
    toast.success('Entity removed');
  };

  const updateEntity = (id: string, updates: Partial<Entity>) => {
    setEntities(entities.map(e => {
      if (e.id === id) {
        const auditLog = e.data.auditLog || [];
        auditLog.push({
          timestamp: new Date().toISOString(),
          action: 'Entity Updated',
          user: 'Client',
          details: JSON.stringify(updates)
        });
        return { 
          ...e, 
          ...updates,
          data: {
            ...e.data,
            ...updates.data,
            auditLog
          }
        };
      }
      return e;
    }));
  };

  // Risk Scoring Engine
  const calculateRiskScore = (entity: Entity): RiskLevel => {
    let score = 0;

    // Service Risk
    if (entity.services.includes('Cash') || entity.data.cashInvolvement) score += 2;
    if (entity.data.cryptoInvolvement) score += 3;

    // Client Risk
    if (entity.data.pepStatus || entity.data.relatedPartyPep) score += 3;
    if (entity.data.unexplainedWealth) score += 2;
    if (entity.data.charityNpo) score += 1;

    // Country Risk
    if (entity.data.taxResidenceCountry && entity.data.taxResidenceCountry !== 'Australia') score += 1;

    // Structure Risk
    if (entity.type === 'trust' && entity.data.trustees?.some((t: any) => t.type === 'corporate')) score += 2;
    if (entity.data.beneficialOwners && entity.data.beneficialOwners.length > 5) score += 1;

    // Transaction Risk
    if (entity.turnover && entity.turnover > 10000000) score += 1;

    if (score >= 6) return 'high';
    if (score >= 3) return 'medium';
    return 'low';
  };

  // Sanctions Screening Simulation
  const performSanctionsScreening = async (entity: Entity) => {
    // Simulate screening delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Random result for demo (in production, this would call actual sanctions API)
    const result = Math.random() > 0.95 ? 'hit' : 'clear';

    updateEntity(entity.id, {
      data: {
        ...entity.data,
        sanctionsScreened: true,
        sanctionsResult: result,
        auditLog: [
          ...(entity.data.auditLog || []),
          {
            timestamp: new Date().toISOString(),
            action: 'Sanctions Screening',
            user: 'System',
            details: `Result: ${result}`
          }
        ]
      }
    });

    if (result === 'hit') {
      updateEntity(entity.id, { complianceStatus: 'blocked' });
      toast.error('⚠️ Sanctions hit detected - Onboarding frozen');
    }

    return result;
  };

  // PEP Screening
  const performPepScreening = async (entity: Entity) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const result = entity.data.pepStatus ? 'hit' : 'clear';

    updateEntity(entity.id, {
      data: {
        ...entity.data,
        pepScreened: true,
        pepResult: result,
        auditLog: [
          ...(entity.data.auditLog || []),
          {
            timestamp: new Date().toISOString(),
            action: 'PEP Screening',
            user: 'System',
            details: `Result: ${result}`
          }
        ]
      }
    });

    if (result === 'hit' && entity.data.taxResidenceCountry !== 'Australia') {
      const newRisk = 'high';
      updateEntity(entity.id, { riskStatus: newRisk });
      toast.warning('Foreign PEP detected - Auto assigned High Risk');
    }

    return result;
  };

  // Validation Functions
  const canProgressFromStructure = () => {
    // For testing: Allow progression with at least one entity (name optional)
    return entities.length > 0;
  };

  const canProgressFromServices = () => {
    // For testing: Always allow progression
    return true;
  };

  const canProgressFromCDD = () => {
    // For testing: Always allow progression
    return true;
  };

  const canProgressFromReview = () => {
    // For testing: Always allow progression
    return true;
  };

  const canProgressFromPracticeAssessment = () => {
    // For testing: Always allow progression
    return true;
  };

  const renderPhaseIndicator = () => (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between">
        {phases.map((phase, idx) => {
          const Icon = phase.icon;
          const isActive = phase.id === currentPhase;
          const isPast = phases.findIndex(p => p.id === currentPhase) > idx;
          
          return (
            <div key={phase.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  isActive ? 'bg-blue-600' : isPast ? 'bg-green-600' : 'bg-gray-300'
                }`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className={`text-xs font-semibold text-center ${
                  isActive ? 'text-blue-900' : isPast ? 'text-green-900' : 'text-gray-600'
                }`}>
                  {phase.label}
                </p>
              </div>
              {idx < phases.length - 1 && (
                <div className={`flex-1 h-1 mx-2 ${isPast ? 'bg-green-600' : 'bg-gray-300'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderPhase1Structure = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Phase 1: Build Your Structure</h2>
          <p className="text-gray-600">Add all entities that will be using our services</p>
        </div>
        <PrimaryButton onClick={() => setShowAddEntity(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Entity
        </PrimaryButton>
      </div>

      {/* Entity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {entities.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-white border-2 border-dashed border-gray-300 rounded-lg">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Entities Added Yet</h3>
            <p className="text-gray-600 mb-6">Click "Add Entity" to start building your structure</p>
            <SecondaryButton onClick={() => setShowAddEntity(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Entity
            </SecondaryButton>
          </div>
        ) : (
          entities.map((entity) => {
            const entityType = entityTypes.find(t => t.id === entity.type);
            const Icon = entityType?.icon || Building2;
            const isNameEmpty = !entity.name || entity.name.trim() === '';
            
            return (
              <div key={entity.id} className={`bg-white border-2 rounded-lg p-6 transition-colors ${
                isNameEmpty ? 'border-amber-400 shadow-amber-100 shadow-lg' : 'border-gray-200 hover:border-blue-300'
              }`}>
                {isNameEmpty && (
                  <div className="mb-3 flex items-center gap-2 text-amber-600 text-sm font-semibold">
                    <AlertCircle className="w-4 h-4" />
                    Enter entity name to continue
                  </div>
                )}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={entity.name}
                        onChange={(e) => updateEntity(entity.id, { name: e.target.value })}
                        placeholder="Enter entity name *"
                        className={`w-full font-bold text-gray-900 border-b focus:border-blue-600 outline-none ${
                          isNameEmpty ? 'border-amber-400 placeholder-amber-500' : 'border-gray-300'
                        }`}
                      />
                      <p className="text-xs text-gray-600 mt-1">{entityType?.label}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeEntity(entity.id)}
                    className="p-1 hover:bg-red-100 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Compliance</span>
                    <StatusBadge status={entity.complianceStatus === 'complete' ? 'approved' : 
                                        entity.complianceStatus === 'blocked' ? 'blocked' : 'pending'} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Risk Level</span>
                    <span className={`px-2 py-1 text-xs font-bold rounded ${
                      entity.riskStatus === 'low' ? 'bg-green-100 text-green-700' :
                      entity.riskStatus === 'medium' ? 'bg-amber-100 text-amber-700' :
                      entity.riskStatus === 'high' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {entity.riskStatus === 'not-assessed' ? 'Not Assessed' : entity.riskStatus.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Entity Modal */}
      {showAddEntity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Select Entity Type</h2>
              <button onClick={() => setShowAddEntity(false)}>
                <XCircle className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {entityTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => addEntity(type.id as EntityType)}
                    className="p-6 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-300 text-left transition-colors"
                  >
                    <Icon className="w-8 h-8 text-blue-600 mb-3" />
                    <h3 className="font-bold text-gray-900 mb-1">{type.label}</h3>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 mt-8">
        {!canProgressFromStructure() && (
          <div className="flex items-center gap-2 text-amber-600 mr-4">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-semibold">Please add and name at least one entity</span>
          </div>
        )}
        <PrimaryButton
          onClick={() => setCurrentPhase('services')}
          disabled={!canProgressFromStructure()}
        >
          Continue to Services
          <ArrowRight className="w-4 h-4 ml-2" />
        </PrimaryButton>
      </div>
    </div>
  );

  const renderPhase2Services = () => (
    <ServiceSelection
      entities={entities}
      onUpdate={(id, services, pricing, turnover, employees) => {
        updateEntity(id, { services, pricing, turnover, employees });
      }}
      onBack={() => setCurrentPhase('structure')}
      onContinue={() => setCurrentPhase('engagement')}
      canProgress={canProgressFromServices()}
    />
  );

  const renderPhase3Engagement = () => (
    <EngagementLetter
      entities={entities}
      onBack={() => setCurrentPhase('services')}
      onContinue={() => setCurrentPhase('payment')}
    />
  );

  const renderPhase4Payment = () => (
    <PaymentStep 
      entities={entities} 
      onBack={() => setCurrentPhase('engagement')} 
      onContinue={() => setCurrentPhase('cdd')} 
    />
  );

  const renderPhase5CDD = () => (
    <CDDDataCapture
      entities={entities}
      onUpdate={(id, data, complianceStatus, riskStatus) => {
        const entity = entities.find(e => e.id === id);
        if (entity) {
          // Perform screenings
          const updatedEntity = {
            ...entity,
            data: { ...entity.data, ...data },
            complianceStatus,
            riskStatus
          };
          
          updateEntity(id, { data, complianceStatus, riskStatus });
          
          // Auto-calculate risk
          const calculatedRisk = calculateRiskScore(updatedEntity);
          updateEntity(id, { riskStatus: calculatedRisk });
          
          // Perform screenings
          performSanctionsScreening(updatedEntity);
          performPepScreening(updatedEntity);
        }
      }}
      onBack={() => setCurrentPhase('payment')}
      onContinue={() => {
        if (canProgressFromCDD()) {
          setCurrentPhase('review');
        } else {
          toast.error('⚠️ Cannot proceed - Complete all mandatory fields and clear sanctions screening');
        }
      }}
      canProgress={canProgressFromCDD()}
    />
  );

  const renderPhase6Review = () => (
    <InternalReviewAndApproval
      entities={entities}
      onApprove={(entityId, comments, role) => {
        const entity = entities.find(e => e.id === entityId);
        if (entity) {
          updateEntity(entityId, {
            complianceStatus: 'complete',
            data: {
              ...entity.data,
              approvalStatus: 'approved',
              approvedBy: role,
              approvedAt: new Date().toISOString(),
              approvalComments: comments
            }
          });
          toast.success('✓ Client approved successfully');
        }
      }}
      onReject={(entityId, reason, role) => {
        const entity = entities.find(e => e.id === entityId);
        if (entity) {
          updateEntity(entityId, {
            complianceStatus: 'blocked',
            data: {
              ...entity.data,
              approvalStatus: 'rejected',
              rejectedBy: role,
              rejectedAt: new Date().toISOString(),
              rejectionReason: reason
            }
          });
          toast.error('✗ Client rejected');
        }
      }}
      onBack={() => setCurrentPhase('cdd')}
      onContinue={() => {
        if (canProgressFromReview()) {
          toast.success('✓ AML/CTF compliance complete - Proceeding to practice assessment');
          setTimeout(() => setCurrentPhase('submit'), 800);
        } else {
          toast.error('⚠️ All entities must be approved before practice assessment');
        }
      }}
      canProgress={canProgressFromReview()}
    />
  );

  const renderPhase7Submit = () => {
    return (
      <div className="space-y-6">
        {/* All Checks Complete Banner */}
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="font-bold text-green-900 text-lg">All Onboarding Steps Complete</h3>
          </div>
          <p className="text-green-800 mb-4">
            You have successfully completed all required onboarding steps. Please review the summary below and submit for manager approval.
          </p>
          <div className="bg-white rounded-lg p-4 border border-green-300">
            <p className="text-sm text-gray-700 mb-2"><strong>Onboarding Summary:</strong></p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• {entities.length} {entities.length === 1 ? 'entity' : 'entities'} added</li>
              <li>• ${entities.reduce((sum, e) => sum + e.pricing, 0).toLocaleString()}/year in services</li>
              <li>• {entities.flatMap(e => e.services).length} services selected</li>
              <li>• Engagement letter: ✓ Complete</li>
              <li>• Payment setup: ✓ Complete</li>
              <li>• AML/CTF checks: ✓ Complete</li>
              <li>• Sanctions screening: {entities.every(e => e.data.sanctionsResult === 'clear') ? '✓ CLEAR' : '⚠️ PENDING REVIEW'}</li>
              <li>• PEP screening: {entities.every(e => e.data.pepResult === 'clear') ? '✓ CLEAR' : '⚠️ PENDING REVIEW'}</li>
              <li>• Internal approval: ✓ Complete</li>
            </ul>
          </div>
        </div>

        {/* Entity Summary Cards */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <h3 className="font-bold text-gray-900 mb-4">Entity Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entities.map((entity) => {
              const entityType = entityTypes.find(t => t.id === entity.type);
              const Icon = entityType?.icon || Building2;
              
              return (
                <div key={entity.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{entity.name}</h4>
                      <p className="text-xs text-gray-600">{entityType?.label}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Services:</span>
                      <span className="font-semibold text-gray-900">{entity.services.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Annual Value:</span>
                      <span className="font-semibold text-gray-900">${entity.pricing.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Risk Level:</span>
                      <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                        entity.riskStatus === 'low' ? 'bg-green-100 text-green-700' :
                        entity.riskStatus === 'medium' ? 'bg-amber-100 text-amber-700' :
                        entity.riskStatus === 'high' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {entity.riskStatus.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <StatusBadge status={entity.complianceStatus === 'complete' ? 'approved' : 'pending'} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Declaration */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <h3 className="font-bold text-gray-900 mb-4">Declaration</h3>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-amber-900 font-semibold mb-2">Please Read Carefully:</p>
            <p className="text-sm text-amber-800">
              By submitting this onboarding application, I declare that all information provided is true, complete, and accurate to the best of my knowledge. 
              I understand that providing false or misleading information may result in rejection of this application and potential legal consequences. 
              I authorize the practice to conduct necessary verification checks and acknowledge that final approval is subject to manager review and practice assessment.
            </p>
          </div>

          <label className="flex items-start gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
            <input
              type="checkbox"
              checked={declaration}
              onChange={(e) => setDeclaration(e.target.checked)}
              className="w-5 h-5 mt-1"
            />
            <span className="text-sm text-gray-700">
              <strong>I acknowledge and agree</strong> that I have read and understood the declaration above. 
              All information provided is accurate and complete. I understand this application will be reviewed 
              by a manager who will complete the final practice assessment and activation steps.
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4">
          <SecondaryButton onClick={() => setCurrentPhase('review')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Review
          </SecondaryButton>
          
          <div className="flex items-center gap-3">
            {!declaration && (
              <div className="flex items-center gap-2 text-amber-600">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-semibold">Please accept the declaration to submit</span>
              </div>
            )}
            <PrimaryButton
              onClick={() => {
                if (declaration) {
                  toast.success('✓ Application submitted successfully! A manager will review your onboarding.');
                  setTimeout(() => {
                    if (onComplete) onComplete();
                  }, 1500);
                } else {
                  toast.error('Please accept the declaration before submitting');
                }
              }}
              disabled={!declaration}
            >
              Submit for Manager Approval
              <ArrowRight className="w-4 h-4 ml-2" />
            </PrimaryButton>
          </div>
        </div>
      </div>
    );
  };

  const renderPhase8Activation = () => (
    <ClientActivation
      entities={entities}
      onComplete={onComplete}
    />
  );

  const renderCurrentPhase = () => {
    switch (currentPhase) {
      case 'structure':
        return renderPhase1Structure();
      case 'services':
        return renderPhase2Services();
      case 'engagement':
        return renderPhase3Engagement();
      case 'payment':
        return renderPhase4Payment();
      case 'cdd':
        return renderPhase5CDD();
      case 'review':
        return renderPhase6Review();
      case 'submit':
        return renderPhase7Submit();
      case 'activation':
        return renderPhase8Activation();
      default:
        return renderPhase1Structure();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Onboarding</h1>
          <p className="text-gray-600">AUSTRAC-compliant AML/CTF onboarding process</p>
        </div>

        {renderPhaseIndicator()}
        {renderCurrentPhase()}
      </div>
    </div>
  );
}

// Component imports will be created in separate messages due to length
export default ClientOnboarding;
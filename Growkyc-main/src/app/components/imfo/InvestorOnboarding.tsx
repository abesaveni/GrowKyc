import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  User,
  Building2,
  Shield,
  FileText,
  CheckCircle,
  AlertCircle,
  Upload,
  X,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  Award,
  DollarSign,
  Clock,
  Target,
  Users,
  BookOpen,
  Scale,
  AlertTriangle,
  Check,
  Eye,
  Download,
  MessageSquare,
  Zap,
  Info
} from 'lucide-react';

type EntityType = 'individual' | 'company' | 'trust' | 'fund';
type OnboardingStep = 'entity' | 'details' | 'questionnaire' | 'kyc' | 'wholesale' | 'review' | 'approval';
type LegalClassification = 'wholesale' | 'professional' | 'institutional' | 'pending';
type InternalTier = 'tier-a' | 'tier-b' | 'tier-c' | 'tier-d' | 'tier-e';

interface QuestionnaireAnswers {
  entityType: string;
  annualRevenue?: string;
  netAssets?: string;
  privateMarketsExperience: string;
  yearsInvestingExperience: string;
  riskTolerance: string;
  liquidityTolerance: string;
  strategyPreferences: string[];
  governanceStrength: string;
  declarations: boolean[];
}

interface InvestorOnboardingProps {
  role: string;
  onNavigate: (page: string) => void;
}

export function InvestorOnboarding({ role, onNavigate }: InvestorOnboardingProps) {
  const [view, setView] = useState<'list' | 'new' | 'detail'>('list');
  const [selectedInvestor, setSelectedInvestor] = useState<any>(null);

  // Mock data for existing applications
  const mockApplications = [
    {
      id: 'INV-2024-147',
      name: 'Meridian Capital Pty Ltd',
      entityType: 'company',
      submittedDate: '2024-02-10',
      status: 'pending-cfo-approval',
      recommendedTier: 'tier-a',
      kycStatus: 'approved',
      wholesaleStatus: 'approved',
      assignedTo: 'Sarah Mitchell'
    },
    {
      id: 'INV-2024-146',
      name: 'John Smith Family Trust',
      entityType: 'trust',
      submittedDate: '2024-02-09',
      status: 'pending-compliance',
      recommendedTier: 'tier-c',
      kycStatus: 'under-review',
      wholesaleStatus: 'pending',
      assignedTo: 'Michael Chen'
    },
    {
      id: 'INV-2024-145',
      name: 'Apex Investment Fund',
      entityType: 'fund',
      submittedDate: '2024-02-08',
      status: 'approved',
      recommendedTier: 'tier-a',
      kycStatus: 'approved',
      wholesaleStatus: 'approved',
      finalTier: 'tier-a',
      approvedBy: 'CFO',
      approvedDate: '2024-02-12'
    },
    {
      id: 'INV-2024-144',
      name: 'Emma Wilson',
      entityType: 'individual',
      submittedDate: '2024-02-07',
      status: 'pending-documents',
      recommendedTier: 'tier-d',
      kycStatus: 'incomplete',
      wholesaleStatus: 'pending',
      assignedTo: 'Sarah Mitchell'
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { label: string; className: string; icon: any } } = {
      'pending-cfo-approval': { 
        label: 'Pending CFO Approval', 
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Clock 
      },
      'pending-compliance': { 
        label: 'Pending Compliance Review', 
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: Shield 
      },
      'approved': { 
        label: 'Approved', 
        className: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle 
      },
      'pending-documents': { 
        label: 'Pending Documents', 
        className: 'bg-orange-100 text-orange-800 border-orange-200',
        icon: Upload 
      },
      'rejected': { 
        label: 'Rejected', 
        className: 'bg-red-100 text-red-800 border-red-200',
        icon: X 
      }
    };

    const config = statusConfig[status] || statusConfig['pending-documents'];
    const Icon = config.icon;

    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${config.className}`}>
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </div>
    );
  };

  const getTierBadge = (tier: string) => {
    const tierConfig: { [key: string]: { label: string; className: string } } = {
      'tier-a': { label: 'Tier A - Institutional Strategic', className: 'bg-purple-100 text-purple-800 border-purple-200' },
      'tier-b': { label: 'Tier B - Institutional Standard', className: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
      'tier-c': { label: 'Tier C - HNW Premium', className: 'bg-blue-100 text-blue-800 border-blue-200' },
      'tier-d': { label: 'Tier D - Conservative', className: 'bg-gray-100 text-gray-800 border-gray-200' },
      'tier-e': { label: 'Tier E - Pending/Observation', className: 'bg-gray-100 text-gray-600 border-gray-200' }
    };

    const config = tierConfig[tier] || tierConfig['tier-e'];

    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${config.className}`}>
        <Award className="w-3.5 h-3.5" />
        {config.label}
      </div>
    );
  };

  if (view === 'new') {
    return <NewInvestorOnboardingFlow onBack={() => setView('list')} role={role} />;
  }

  if (view === 'detail' && selectedInvestor) {
    return <InvestorApplicationDetail investor={selectedInvestor} onBack={() => setView('list')} role={role} />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Investor Onboarding</h1>
          <p className="text-gray-600 mt-1">Automated onboarding with tier classification and compliance workflows</p>
        </div>
        <Button onClick={() => setView('new')} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <User className="w-4 h-4 mr-2" />
          New Application
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            <p className="text-sm text-gray-600">Pending Review</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">8</p>
        </div>
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-gray-600">In Compliance Review</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">3</p>
        </div>
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600">Approved This Month</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">12</p>
        </div>
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <p className="text-sm text-gray-600">Total Active</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">147</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-300 rounded-lg p-4">
        <div className="flex items-center gap-4">
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>All Statuses</option>
            <option>Pending CFO Approval</option>
            <option>Pending Compliance</option>
            <option>Pending Documents</option>
            <option>Approved</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>All Entity Types</option>
            <option>Individual</option>
            <option>Company</option>
            <option>Trust</option>
            <option>Fund</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>All Tiers</option>
            <option>Tier A</option>
            <option>Tier B</option>
            <option>Tier C</option>
            <option>Tier D</option>
          </select>
          <div className="flex-1"></div>
          <input
            type="search"
            placeholder="Search by name or ID..."
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-300">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Investor
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Entity Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Submitted
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Recommended Tier
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                KYC
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Wholesale
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockApplications.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">{app.name}</p>
                    <p className="text-sm text-gray-500">{app.id}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {app.entityType === 'company' && <Building2 className="w-4 h-4 text-blue-600" />}
                    {app.entityType === 'trust' && <Shield className="w-4 h-4 text-purple-600" />}
                    {app.entityType === 'fund' && <TrendingUp className="w-4 h-4 text-green-600" />}
                    {app.entityType === 'individual' && <User className="w-4 h-4 text-gray-600" />}
                    <span className="text-sm capitalize">{app.entityType}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-900">{app.submittedDate}</p>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(app.status)}
                </td>
                <td className="px-6 py-4">
                  {getTierBadge(app.recommendedTier)}
                </td>
                <td className="px-6 py-4">
                  {app.kycStatus === 'approved' && (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Approved</span>
                    </div>
                  )}
                  {app.kycStatus === 'under-review' && (
                    <div className="flex items-center gap-1 text-blue-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Review</span>
                    </div>
                  )}
                  {app.kycStatus === 'incomplete' && (
                    <div className="flex items-center gap-1 text-orange-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">Incomplete</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  {app.wholesaleStatus === 'approved' && (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Valid</span>
                    </div>
                  )}
                  {app.wholesaleStatus === 'pending' && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Pending</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedInvestor(app);
                      setView('detail');
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Review
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// New Investor Onboarding Flow
function NewInvestorOnboardingFlow({ onBack, role }: { onBack: () => void; role: string }) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('entity');
  const [entityType, setEntityType] = useState<EntityType | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<Partial<QuestionnaireAnswers>>({
    strategyPreferences: [],
    declarations: []
  });
  const [tierRecommendation, setTierRecommendation] = useState<any>(null);

  const steps: { id: OnboardingStep; label: string; icon: any }[] = [
    { id: 'entity', label: 'Entity Type', icon: Building2 },
    { id: 'details', label: 'Details', icon: FileText },
    { id: 'questionnaire', label: 'Questionnaire', icon: BookOpen },
    { id: 'kyc', label: 'KYC Documents', icon: Shield },
    { id: 'wholesale', label: 'Wholesale Evidence', icon: Award },
    { id: 'review', label: 'Review & Submit', icon: CheckCircle }
  ];

  const getCurrentStepIndex = () => steps.findIndex(s => s.id === currentStep);

  const goToNextStep = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const goToPreviousStep = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const calculateTierRecommendation = () => {
    // Complex scoring logic based on questionnaire
    let riskCapacityScore = 0;
    let governanceScore = 0;
    let experienceScore = 0;

    // Financial Capacity
    if (questionnaireAnswers.annualRevenue === '>$50M' || questionnaireAnswers.netAssets === '>$50M') {
      riskCapacityScore += 30;
    } else if (questionnaireAnswers.annualRevenue === '$10M-$50M' || questionnaireAnswers.netAssets === '$10M-$50M') {
      riskCapacityScore += 20;
    } else {
      riskCapacityScore += 10;
    }

    // Experience
    if (questionnaireAnswers.privateMarketsExperience === 'extensive') {
      experienceScore += 30;
    } else if (questionnaireAnswers.privateMarketsExperience === 'significant') {
      experienceScore += 20;
    } else {
      experienceScore += 10;
    }

    if (questionnaireAnswers.yearsInvestingExperience === '10+') {
      experienceScore += 20;
    } else if (questionnaireAnswers.yearsInvestingExperience === '5-10') {
      experienceScore += 15;
    } else {
      experienceScore += 5;
    }

    // Governance
    if (questionnaireAnswers.governanceStrength === 'strong') {
      governanceScore += 20;
    } else if (questionnaireAnswers.governanceStrength === 'adequate') {
      governanceScore += 10;
    } else {
      governanceScore += 5;
    }

    const totalScore = riskCapacityScore + governanceScore + experienceScore;

    // Determine tier
    let recommendedTier: InternalTier;
    let legalClassification: LegalClassification = 'wholesale';
    
    if (entityType === 'fund' || totalScore >= 75) {
      recommendedTier = 'tier-a';
      legalClassification = 'institutional';
    } else if (totalScore >= 60) {
      recommendedTier = 'tier-b';
      legalClassification = 'professional';
    } else if (totalScore >= 45) {
      recommendedTier = 'tier-c';
    } else if (totalScore >= 30) {
      recommendedTier = 'tier-d';
    } else {
      recommendedTier = 'tier-e';
      legalClassification = 'pending';
    }

    // Strategy flags based on preferences
    const strategyFlags = questionnaireAnswers.strategyPreferences || [];

    // Concentration limits
    const concentrationLimits = {
      perSPV: recommendedTier === 'tier-a' ? 15 : recommendedTier === 'tier-b' ? 10 : 5,
      perSector: recommendedTier === 'tier-a' ? 25 : recommendedTier === 'tier-b' ? 20 : 15,
      totalExposure: recommendedTier === 'tier-a' ? 50 : recommendedTier === 'tier-b' ? 35 : 20
    };

    setTierRecommendation({
      tier: recommendedTier,
      legalClassification,
      riskCapacityScore,
      governanceScore,
      experienceScore,
      totalScore,
      strategyFlags,
      concentrationLimits,
      requiresCFOApproval: recommendedTier === 'tier-a'
    });

    goToNextStep();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'entity':
        return <EntityTypeSelection entityType={entityType} setEntityType={setEntityType} onNext={goToNextStep} />;
      
      case 'details':
        return <EntityDetailsForm entityType={entityType!} formData={formData} setFormData={setFormData} onNext={goToNextStep} onBack={goToPreviousStep} />;
      
      case 'questionnaire':
        return <OnboardingQuestionnaire 
          entityType={entityType!}
          answers={questionnaireAnswers} 
          setAnswers={setQuestionnaireAnswers} 
          onNext={calculateTierRecommendation} 
          onBack={goToPreviousStep} 
        />;
      
      case 'kyc':
        return <KYCDocumentsUpload 
          entityType={entityType!}
          tierRecommendation={tierRecommendation}
          onNext={goToNextStep} 
          onBack={goToPreviousStep} 
        />;
      
      case 'wholesale':
        return <WholesaleEvidenceUpload 
          entityType={entityType!}
          tierRecommendation={tierRecommendation}
          onNext={goToNextStep} 
          onBack={goToPreviousStep} 
        />;
      
      case 'review':
        return <ReviewAndSubmit 
          entityType={entityType!}
          formData={formData}
          questionnaireAnswers={questionnaireAnswers}
          tierRecommendation={tierRecommendation}
          onBack={goToPreviousStep}
          onComplete={onBack}
        />;
      
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Investor Onboarding</h1>
          <p className="text-gray-600 mt-1">Complete all steps to submit application for review</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = getCurrentStepIndex() > index;
            
            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isCompleted ? 'bg-green-500 border-green-500' :
                    isActive ? 'bg-indigo-600 border-indigo-600' :
                    'bg-white border-gray-300'
                  }`}>
                    {isCompleted ? (
                      <Check className="w-6 h-6 text-white" />
                    ) : (
                      <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    )}
                  </div>
                  <p className={`text-xs mt-2 text-center font-medium ${
                    isActive ? 'text-indigo-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      {renderStepContent()}
    </div>
  );
}

// Entity Type Selection
function EntityTypeSelection({ entityType, setEntityType, onNext }: any) {
  const entityTypes = [
    { 
      id: 'individual' as EntityType, 
      label: 'Individual', 
      icon: User, 
      description: 'Individual investor',
      examples: 'Natural person, sole trader'
    },
    { 
      id: 'company' as EntityType, 
      label: 'Company', 
      icon: Building2, 
      description: 'Corporate entity',
      examples: 'Pty Ltd, Limited, proprietary company'
    },
    { 
      id: 'trust' as EntityType, 
      label: 'Trust', 
      icon: Shield, 
      description: 'Trust structure',
      examples: 'Family trust, unit trust, discretionary trust'
    },
    { 
      id: 'fund' as EntityType, 
      label: 'Fund', 
      icon: TrendingUp, 
      description: 'Investment fund or SMSF',
      examples: 'Superannuation fund, managed fund, investment vehicle'
    }
  ];

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Select Entity Type</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        {entityTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = entityType === type.id;
          
          return (
            <button
              key={type.id}
              onClick={() => setEntityType(type.id)}
              className={`p-6 border-2 rounded-lg text-left transition-all hover:border-indigo-500 ${
                isSelected ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 bg-white'
              }`}
            >
              <Icon className={`w-8 h-8 mb-3 ${isSelected ? 'text-indigo-600' : 'text-gray-600'}`} />
              <h3 className="font-semibold text-gray-900 mb-1">{type.label}</h3>
              <p className="text-sm text-gray-600 mb-2">{type.description}</p>
              <p className="text-xs text-gray-500">{type.examples}</p>
            </button>
          );
        })}
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={onNext}
          disabled={!entityType}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Continue
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

// Entity Details Form
function EntityDetailsForm({ entityType, formData, setFormData, onNext, onBack }: any) {
  const updateField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Entity Details</h2>
      
      <div className="space-y-6">
        {entityType === 'individual' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.firstName || ''}
                  onChange={(e) => updateField('firstName', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.lastName || ''}
                  onChange={(e) => updateField('lastName', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.dob || ''}
                onChange={(e) => updateField('dob', e.target.value)}
              />
            </div>
          </>
        )}

        {(entityType === 'company' || entityType === 'trust' || entityType === 'fund') && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Legal Entity Name *</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.entityName || ''}
                onChange={(e) => updateField('entityName', e.target.value)}
                placeholder="e.g., Acme Capital Pty Ltd"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ABN *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.abn || ''}
                  onChange={(e) => updateField('abn', e.target.value)}
                  placeholder="11 222 333 444"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ACN {entityType === 'company' && '*'}</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.acn || ''}
                  onChange={(e) => updateField('acn', e.target.value)}
                  placeholder="123 456 789"
                />
              </div>
            </div>
          </>
        )}

        {/* Contact Information */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.email || ''}
                  onChange={(e) => updateField('email', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.phone || ''}
                  onChange={(e) => updateField('phone', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Residential Address *</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
                value={formData.addressLine1 || ''}
                onChange={(e) => updateField('addressLine1', e.target.value)}
                placeholder="Street address"
              />
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.suburb || ''}
                  onChange={(e) => updateField('suburb', e.target.value)}
                  placeholder="Suburb"
                />
                <input
                  type="text"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.state || ''}
                  onChange={(e) => updateField('state', e.target.value)}
                  placeholder="State"
                />
                <input
                  type="text"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.postcode || ''}
                  onChange={(e) => updateField('postcode', e.target.value)}
                  placeholder="Postcode"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tax Information */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="font-semibold text-gray-900 mb-4">Tax Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">TFN / Tax Identifier *</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.tfn || ''}
                onChange={(e) => updateField('tfn', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tax Residency *</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.taxResidency || ''}
                onChange={(e) => updateField('taxResidency', e.target.value)}
              >
                <option value="">Select...</option>
                <option value="AU">Australia</option>
                <option value="NZ">New Zealand</option>
                <option value="SG">Singapore</option>
                <option value="UK">United Kingdom</option>
                <option value="US">United States</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={onNext}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Continue
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

// Onboarding Questionnaire
function OnboardingQuestionnaire({ entityType, answers, setAnswers, onNext, onBack }: any) {
  const updateAnswer = (field: string, value: any) => {
    setAnswers({ ...answers, [field]: value });
  };

  const toggleStrategyPreference = (strategy: string) => {
    const current = answers.strategyPreferences || [];
    const updated = current.includes(strategy)
      ? current.filter((s: string) => s !== strategy)
      : [...current, strategy];
    updateAnswer('strategyPreferences', updated);
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Investment Questionnaire</h2>
        <p className="text-sm text-gray-600 mt-1">
          This questionnaire helps us recommend the appropriate investor tier and access level
        </p>
      </div>

      <div className="space-y-8">
        {/* Financial Capacity */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Financial Capacity
          </h3>
          
          {entityType !== 'individual' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Annual Revenue *</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={answers.annualRevenue || ''}
                onChange={(e) => updateAnswer('annualRevenue', e.target.value)}
              >
                <option value="">Select range...</option>
                <option value="<$2M">Less than $2M</option>
                <option value="$2M-$10M">$2M - $10M</option>
                <option value="$10M-$50M">$10M - $50M</option>
                <option value=">$50M">More than $50M</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Net Assets *</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={answers.netAssets || ''}
              onChange={(e) => updateAnswer('netAssets', e.target.value)}
            >
              <option value="">Select range...</option>
              <option value="<$2.5M">Less than $2.5M</option>
              <option value="$2.5M-$10M">$2.5M - $10M</option>
              <option value="$10M-$50M">$10M - $50M</option>
              <option value=">$50M">More than $50M</option>
            </select>
          </div>
        </div>

        {/* Private Markets Experience */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            Private Markets Experience
          </h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level *</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={answers.privateMarketsExperience || ''}
              onChange={(e) => updateAnswer('privateMarketsExperience', e.target.value)}
            >
              <option value="">Select...</option>
              <option value="none">No prior experience</option>
              <option value="limited">Limited (1-2 investments)</option>
              <option value="significant">Significant (3-10 investments)</option>
              <option value="extensive">Extensive (10+ investments)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Years Investing Experience *</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={answers.yearsInvestingExperience || ''}
              onChange={(e) => updateAnswer('yearsInvestingExperience', e.target.value)}
            >
              <option value="">Select...</option>
              <option value="<2">Less than 2 years</option>
              <option value="2-5">2-5 years</option>
              <option value="5-10">5-10 years</option>
              <option value="10+">More than 10 years</option>
            </select>
          </div>
        </div>

        {/* Risk and Liquidity Tolerance */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Risk & Liquidity Tolerance
          </h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Risk Tolerance *</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={answers.riskTolerance || ''}
              onChange={(e) => updateAnswer('riskTolerance', e.target.value)}
            >
              <option value="">Select...</option>
              <option value="conservative">Conservative - Capital preservation priority</option>
              <option value="moderate">Moderate - Balanced approach</option>
              <option value="growth">Growth - Higher returns acceptable</option>
              <option value="aggressive">Aggressive - Maximum returns, high risk acceptable</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Liquidity Needs *</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={answers.liquidityTolerance || ''}
              onChange={(e) => updateAnswer('liquidityTolerance', e.target.value)}
            >
              <option value="">Select...</option>
              <option value="immediate">Need immediate liquidity</option>
              <option value="short">Can lock up 1-2 years</option>
              <option value="medium">Can lock up 3-5 years</option>
              <option value="long">Can lock up 5+ years</option>
            </select>
          </div>
        </div>

        {/* Strategy Preferences */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Strategy Preferences
          </h3>
          <p className="text-sm text-gray-600 mb-4">Select all that interest you:</p>
          
          <div className="grid grid-cols-2 gap-3">
            {['Mortgage', 'SME', 'Asset Finance', 'High Yield', 'Short Duration', 'Long Duration', 'Mezzanine', 'Structured'].map((strategy) => (
              <label key={strategy} className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={answers.strategyPreferences?.includes(strategy) || false}
                  onChange={() => toggleStrategyPreference(strategy)}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">{strategy}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Governance Strength */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Scale className="w-5 h-5 text-purple-600" />
            Governance & Decision Making
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Governance Structure *</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={answers.governanceStrength || ''}
              onChange={(e) => updateAnswer('governanceStrength', e.target.value)}
            >
              <option value="">Select...</option>
              <option value="strong">Strong - Board, investment committee, documented policies</option>
              <option value="adequate">Adequate - Some processes and oversight</option>
              <option value="basic">Basic - Individual or simple trustee structure</option>
            </select>
          </div>
        </div>

        {/* Declarations */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Declarations</h3>
          
          <div className="space-y-3">
            <label className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg">
              <input
                type="checkbox"
                className="w-4 h-4 mt-1 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">
                I confirm all information provided is true and accurate to the best of my knowledge
              </span>
            </label>
            <label className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg">
              <input
                type="checkbox"
                className="w-4 h-4 mt-1 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">
                I understand private credit investments carry risks including potential loss of capital
              </span>
            </label>
            <label className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg">
              <input
                type="checkbox"
                className="w-4 h-4 mt-1 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">
                I have read and understood the privacy policy and terms of service
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={onNext}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Generate Tier Recommendation
          <Zap className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

// KYC Documents Upload
function KYCDocumentsUpload({ entityType, tierRecommendation, onNext, onBack }: any) {
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);

  const requiredDocuments = entityType === 'individual'
    ? ['Photo ID (Passport/Driver License)', 'Proof of Address (Utility Bill/Bank Statement)', 'Source of Funds Declaration']
    : ['Certificate of Incorporation/Registration', 'Company/Trust Deed', 'Directors/Trustees ID', 'Beneficial Owners Register', 'Source of Funds Declaration'];

  return (
    <div className="space-y-6">
      {/* Tier Recommendation Banner */}
      {tierRecommendation && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-600 rounded-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-indigo-900 mb-2">Recommended Tier Classification</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-indigo-600 mb-1">Internal Tier</p>
                  <p className="font-semibold text-indigo-900 capitalize">{tierRecommendation.tier.replace('-', ' ')}</p>
                </div>
                <div>
                  <p className="text-xs text-indigo-600 mb-1">Legal Classification</p>
                  <p className="font-semibold text-indigo-900 capitalize">{tierRecommendation.legalClassification}</p>
                </div>
                <div>
                  <p className="text-xs text-indigo-600 mb-1">Total Score</p>
                  <p className="font-semibold text-indigo-900">{tierRecommendation.totalScore}/100</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-indigo-600" />
                  <span className="text-indigo-700">Risk Capacity: {tierRecommendation.riskCapacityScore}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-indigo-600" />
                  <span className="text-indigo-700">Experience: {tierRecommendation.experienceScore}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-indigo-600" />
                  <span className="text-indigo-700">Governance: {tierRecommendation.governanceScore}</span>
                </div>
              </div>
              {tierRecommendation.requiresCFOApproval && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <AlertTriangle className="w-4 h-4" />
                    <p className="text-sm font-medium">Tier A requires CFO approval after compliance review</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* KYC Documents */}
      <div className="bg-white border border-gray-300 rounded-lg p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">KYC Documents</h2>
        
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">AML/CTF Compliance Required</p>
              <p className="text-sm text-blue-700">
                All documents must be certified copies less than 3 months old. We will conduct PEP and sanctions screening.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {requiredDocuments.map((doc, index) => (
            <div key={index} className="border border-gray-300 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">{doc}</p>
                    <p className="text-xs text-gray-500">PDF, JPG, or PNG (max 10MB)</p>
                  </div>
                </div>
                {uploadedDocs.includes(doc) ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Uploaded</span>
                  </div>
                ) : (
                  <span className="text-xs text-red-600 font-medium">Required</span>
                )}
              </div>
              
              {!uploadedDocs.includes(doc) ? (
                <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
                  <Upload className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Upload Document</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={() => setUploadedDocs([...uploadedDocs, doc])}
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-900">{doc.toLowerCase().replace(/\s+/g, '_')}.pdf</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setUploadedDocs(uploadedDocs.filter(d => d !== doc))}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={onNext}
          disabled={uploadedDocs.length < requiredDocuments.length}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Continue
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

// Wholesale Evidence Upload
function WholesaleEvidenceUpload({ tierRecommendation, onNext, onBack }: any) {
  const [evidenceType, setEvidenceType] = useState('');
  const [uploadedEvidence, setUploadedEvidence] = useState(false);

  const evidenceOptions = [
    { value: 'accountant', label: 'Accountant Certificate (section 708(8))', description: 'Certificate from qualified accountant' },
    { value: 'assets', label: 'Net Assets > $2.5M (section 708(8))', description: 'Financial statements and asset valuations' },
    { value: 'income', label: 'Gross Income > $250k (section 708(8))', description: 'Tax returns and income statements' },
    { value: 'professional', label: 'Professional Investor (section 708(11))', description: 'Evidence of professional investor status' },
    { value: 'sophisticated', label: 'Sophisticated Investor (section 708(10))', description: 'ASIC certificate or investment history' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-300 rounded-lg p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Wholesale Investor Evidence</h2>
        
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-900 mb-1">Wholesale Status Required</p>
              <p className="text-sm text-yellow-700">
                Under Corporations Act 2001, you must meet wholesale investor criteria. Evidence must be current and valid.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <label className="block text-sm font-medium text-gray-700">Select Evidence Type *</label>
          {evidenceOptions.map((option) => (
            <label
              key={option.value}
              className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                evidenceType === option.value ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 hover:border-indigo-300'
              }`}
            >
              <input
                type="radio"
                name="evidenceType"
                value={option.value}
                checked={evidenceType === option.value}
                onChange={(e) => setEvidenceType(e.target.value)}
                className="w-4 h-4 mt-1 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{option.label}</p>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
            </label>
          ))}
        </div>

        {evidenceType && (
          <div className="border border-gray-300 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Upload Evidence Document</p>
                  <p className="text-xs text-gray-500">Must be dated within last 6 months</p>
                </div>
              </div>
              {uploadedEvidence && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Uploaded</span>
                </div>
              )}
            </div>
            
            {!uploadedEvidence ? (
              <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
                <Upload className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Upload Evidence</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={() => setUploadedEvidence(true)}
                />
              </label>
            ) : (
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-900">wholesale_evidence_{evidenceType}.pdf</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setUploadedEvidence(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={onNext}
          disabled={!evidenceType || !uploadedEvidence}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Continue to Review
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

// Review and Submit
function ReviewAndSubmit({ entityType, formData, questionnaireAnswers, tierRecommendation, onBack, onComplete }: any) {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onComplete();
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-300 rounded-lg p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Review & Submit Application</h2>
        
        {/* Tier Recommendation Summary */}
        <div className="mb-8 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-600 rounded-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-indigo-900">Recommended Classification</h3>
              <p className="text-sm text-indigo-700">Based on your questionnaire responses</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-4 bg-white rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Internal Tier</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">{tierRecommendation?.tier.replace('-', ' ')}</p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Legal Classification</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">{tierRecommendation?.legalClassification}</p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg">
            <p className="text-xs text-gray-600 mb-2">Strategy Access</p>
            <div className="flex flex-wrap gap-2">
              {tierRecommendation?.strategyFlags.map((strategy: string) => (
                <span key={strategy} className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
                  {strategy}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 p-4 bg-white rounded-lg">
            <p className="text-xs text-gray-600 mb-2">Concentration Limits</p>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-gray-600">Per SPV</p>
                <p className="font-semibold text-gray-900">{tierRecommendation?.concentrationLimits.perSPV}%</p>
              </div>
              <div>
                <p className="text-gray-600">Per Sector</p>
                <p className="font-semibold text-gray-900">{tierRecommendation?.concentrationLimits.perSector}%</p>
              </div>
              <div>
                <p className="text-gray-600">Total Exposure</p>
                <p className="font-semibold text-gray-900">{tierRecommendation?.concentrationLimits.totalExposure}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Approval Workflow */}
        <div className="mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Approval Workflow</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">1</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-blue-900">Compliance Review</p>
                <p className="text-sm text-blue-700">KYC verification, PEP/sanctions screening, wholesale evidence</p>
              </div>
              <Shield className="w-5 h-5 text-blue-600" />
            </div>

            {tierRecommendation?.requiresCFOApproval && (
              <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-yellow-600 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">2</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-yellow-900">CFO Approval Required</p>
                  <p className="text-sm text-yellow-700">Tier A classification requires CFO sign-off</p>
                </div>
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
            )}

            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">{tierRecommendation?.requiresCFOApproval ? '3' : '2'}</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-green-900">Activation</p>
                <p className="text-sm text-green-700">Investor portal access granted, marketplace visibility activated</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        {/* Final Confirmations */}
        <div className="mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Final Confirmations</h3>
          <div className="space-y-3">
            <label className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg">
              <input
                type="checkbox"
                className="w-4 h-4 mt-1 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">
                I confirm all information and documents provided are true, accurate, and current
              </span>
            </label>
            <label className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg">
              <input
                type="checkbox"
                className="w-4 h-4 mt-1 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">
                I acknowledge this application will be reviewed by compliance and may require additional documentation
              </span>
            </label>
            <label className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg">
              <input
                type="checkbox"
                className="w-4 h-4 mt-1 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">
                I understand my tier classification may be adjusted based on compliance review
              </span>
            </label>
          </div>
        </div>

        {/* Notice */}
        <div className="p-4 bg-gray-50 border border-gray-300 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-gray-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">What happens next?</p>
              <p className="text-sm text-gray-600">
                Your application will enter the compliance review queue. You'll receive email notifications at each stage. 
                Typical review time is 2-5 business days. You can track progress in your dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {submitting ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Submit Application
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// Investor Application Detail View
function InvestorApplicationDetail({ investor, onBack, role }: any) {
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'compliance' | 'activity'>('overview');

  const canApprove = role === 'cfo' || role === 'compliance-officer';

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{investor.name}</h1>
            <p className="text-gray-600 mt-1">{investor.id} • Submitted {investor.submittedDate}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {canApprove && investor.status !== 'approved' && (
            <>
              <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                <X className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
            </>
          )}
          {investor.status === 'approved' && (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Approved</span>
            </div>
          )}
        </div>
      </div>

      {/* Status Banner */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {investor.status === 'pending-cfo-approval' && <Clock className="w-6 h-6 text-yellow-600" />}
            {investor.status === 'pending-compliance' && <Shield className="w-6 h-6 text-blue-600" />}
            {investor.status === 'approved' && <CheckCircle className="w-6 h-6 text-green-600" />}
            <div>
              <h3 className="font-semibold text-gray-900">Application Status</h3>
              <p className="text-sm text-gray-600">{investor.assignedTo && `Assigned to ${investor.assignedTo}`}</p>
            </div>
          </div>
          {investor.status === 'pending-cfo-approval' && investor.recommendedTier === 'tier-a' && (
            <div className="text-right">
              <p className="text-sm font-medium text-yellow-900">⚠️ CFO Approval Required</p>
              <p className="text-xs text-yellow-700">Tier A classification awaiting sign-off</p>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-8">
          <div>
            <p className="text-xs text-gray-600 mb-1">Recommended Tier</p>
            <p className="font-semibold text-gray-900 capitalize">{investor.recommendedTier.replace('-', ' ')}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">KYC Status</p>
            <p className="font-semibold text-gray-900 capitalize">{investor.kycStatus}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Wholesale Status</p>
            <p className="font-semibold text-gray-900 capitalize">{investor.wholesaleStatus}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
        <div className="border-b border-gray-300">
          <div className="flex">
            {[
              { id: 'overview', label: 'Overview', icon: FileText },
              { id: 'documents', label: 'Documents', icon: Upload },
              { id: 'compliance', label: 'Compliance', icon: Shield },
              { id: 'activity', label: 'Activity', icon: Clock }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-indigo-600 text-indigo-600 font-medium'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Entity Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Entity Type</p>
                    <p className="font-medium text-gray-900 capitalize">{investor.entityType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">ABN</p>
                    <p className="font-medium text-gray-900">12 345 678 901</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">contact@{investor.name.toLowerCase().replace(/\s+/g, '')}.com</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">+61 2 9876 5432</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Tier Recommendation</h3>
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-indigo-600 mb-1">Risk Capacity</p>
                      <p className="text-2xl font-bold text-indigo-900">28/30</p>
                    </div>
                    <div>
                      <p className="text-xs text-indigo-600 mb-1">Experience</p>
                      <p className="text-2xl font-bold text-indigo-900">45/50</p>
                    </div>
                    <div>
                      <p className="text-xs text-indigo-600 mb-1">Governance</p>
                      <p className="text-2xl font-bold text-indigo-900">18/20</p>
                    </div>
                    <div>
                      <p className="text-xs text-indigo-600 mb-1">Total Score</p>
                      <p className="text-2xl font-bold text-indigo-900">91/100</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Mortgage', 'SME', 'High Yield', 'Structured'].map((strategy) => (
                      <span key={strategy} className="px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded-full">
                        {strategy}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 mb-4">Uploaded Documents</h3>
              {[
                'Certificate of Incorporation',
                'Company Constitution',
                'Directors ID - John Smith',
                'Beneficial Owners Register',
                'Wholesale Evidence - Accountant Certificate'
              ].map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-300 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">{doc}</p>
                      <p className="text-xs text-gray-500">Uploaded {investor.submittedDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">KYC Verification</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900">Identity Verification</p>
                        <p className="text-sm text-green-700">All directors verified</p>
                      </div>
                    </div>
                    <span className="text-sm text-green-600">Completed</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900">PEP Screening</p>
                        <p className="text-sm text-green-700">No matches found</p>
                      </div>
                    </div>
                    <span className="text-sm text-green-600">Clear</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900">Sanctions Screening</p>
                        <p className="text-sm text-green-700">No matches found</p>
                      </div>
                    </div>
                    <span className="text-sm text-green-600">Clear</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Wholesale Status</h3>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <Award className="w-5 h-5 text-green-600" />
                    <p className="font-medium text-green-900">Accountant Certificate - Section 708(8)</p>
                  </div>
                  <p className="text-sm text-green-700 mb-2">Certificate dated 2024-02-05 • Valid until 2024-08-05</p>
                  <p className="text-sm text-green-700">Net assets exceed $2.5M AUD</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-3">
              {[
                { date: '2024-02-12 14:35', user: 'Sarah Mitchell', action: 'Assigned application for review', icon: User },
                { date: '2024-02-11 16:20', user: 'System', action: 'Completed PEP screening - No matches', icon: Shield },
                { date: '2024-02-11 16:18', user: 'System', action: 'Completed sanctions screening - Clear', icon: Shield },
                { date: '2024-02-10 11:45', user: investor.name, action: 'Uploaded wholesale evidence', icon: Upload },
                { date: '2024-02-10 11:42', user: investor.name, action: 'Uploaded KYC documents', icon: Upload },
                { date: '2024-02-10 11:30', user: investor.name, action: 'Submitted application', icon: CheckCircle }
              ].map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg">
                    <Icon className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.user} • {activity.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

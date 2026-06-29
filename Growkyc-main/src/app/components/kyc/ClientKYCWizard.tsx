import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  User,
  Building,
  Users,
  Shield,
  Upload,
  FileText,
  AlertTriangle,
  Lock,
  Camera,
  Download,
  Eye,
  Trash2,
  Check,
  XCircle
} from 'lucide-react';

type WizardStep = 'contact' | 'entity' | 'ownership' | 'verify' | 'uploads' | 'declarations';

interface FormData {
  // Contact Details
  firstName: string;
  lastName: string;
  dob: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  phone: string;
  email: string;
  actingOnBehalf: boolean;
  informationCorrect: boolean;

  // Entity Details
  entityType: 'company' | 'trust' | 'partnership' | 'individual';
  entityName: string;
  abn: string;
  acn: string;
  registeredAddress: string;
  businessActivities: string;
  countries: string[];
  sourceFundsCategory: string;

  // Ownership
  directors: Array<{ name: string; ownership: number }>;
  shareholders: Array<{ name: string; ownership: number }>;
  beneficialOwners: Array<{ name: string; relationship: string }>;
  trustees: Array<{ name: string; role: string }>;

  // Declarations
  amlDeclaration: boolean;
  beneficialOwnerAccuracy: boolean;
  screeningConsent: boolean;
  updateObligation: boolean;
  signature: string;
  signatureDate: string;
}

export function ClientKYCWizard() {
  const [currentStep, setCurrentStep] = useState<WizardStep>('contact');
  const [completedSteps, setCompletedSteps] = useState<WizardStep[]>([]);
  const [formData, setFormData] = useState<Partial<FormData>>({
    entityType: 'company',
    countries: [],
    directors: [],
    shareholders: [],
    beneficialOwners: [],
    trustees: []
  });

  const [greenIDStatus, setGreenIDStatus] = useState<'not-started' | 'in-progress' | 'success' | 'failed'>('not-started');
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ id: string; name: string; type: string; size: number; uploadedAt: Date }>>([]);

  const steps: Array<{ id: WizardStep; label: string; icon: any; description: string }> = [
    { id: 'contact', label: 'Contact Details', icon: User, description: 'Your personal information' },
    { id: 'entity', label: 'Entity Details', icon: Building, description: 'Business information' },
    { id: 'ownership', label: 'Ownership & Control', icon: Users, description: 'Who controls the entity' },
    { id: 'verify', label: 'ID Verification', icon: Shield, description: 'GreenID verification' },
    { id: 'uploads', label: 'Documents', icon: Upload, description: 'Required documentation' },
    { id: 'declarations', label: 'Declarations', icon: FileText, description: 'Sign and submit' }
  ];

  const getCurrentStepIndex = () => steps.findIndex(s => s.id === currentStep);
  const progress = ((getCurrentStepIndex() + 1) / steps.length) * 100;

  const canProceed = () => {
    switch (currentStep) {
      case 'contact':
        return formData.firstName && formData.lastName && formData.email && formData.informationCorrect;
      case 'entity':
        return formData.entityName && formData.abn && formData.businessActivities;
      case 'ownership':
        return true; // Basic validation
      case 'verify':
        return greenIDStatus === 'success';
      case 'uploads':
        return uploadedFiles.length >= 3; // At least 3 documents
      case 'declarations':
        return formData.amlDeclaration && formData.beneficialOwnerAccuracy && formData.screeningConsent && formData.signature;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!canProceed()) return;
    
    const currentIndex = getCurrentStepIndex();
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1].id;
      setCurrentStep(nextStep);
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
    }
  };

  const handleBack = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const handleSubmit = () => {
    if (!canProceed()) return;
    
    // Create submission
    alert('KYC Submission Complete! Your application is now under review. You will receive updates via email and in your portal.');
  };

  const requiredDocuments = {
    company: [
      'ASIC Company Extract',
      'Company Constitution (if available)',
      'Shareholder Register',
      'Director ID Documents',
      'Source of Funds Evidence (bank statements, financial records)',
      'Source of Wealth Evidence (tax returns, asset valuations)'
    ],
    trust: [
      'Trust Deed',
      'Trustee Company Documents',
      'Appointor Details',
      'Beneficiary Information',
      'Source of Funds Evidence',
      'Source of Wealth Evidence'
    ],
    partnership: [
      'Partnership Agreement',
      'Partner ID Documents',
      'Business Registration',
      'Source of Funds Evidence'
    ],
    individual: [
      'Government-issued ID (if GreenID failed)',
      'Proof of Address',
      'Source of Funds Evidence'
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your KYC</h1>
          <p className="text-gray-600 mb-6">
            Follow these steps to complete your verification. You can save and resume at any time.
          </p>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
              <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Step Indicators */}
          <div className="grid grid-cols-6 gap-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = completedSteps.includes(step.id);
              const isCurrent = currentStep === step.id;
              
              return (
                <button
                  key={step.id}
                  onClick={() => isCompleted && setCurrentStep(step.id)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    isCurrent ? 'border-blue-500 bg-blue-50' :
                    isCompleted ? 'border-green-500 bg-green-50 cursor-pointer hover:bg-green-100' :
                    'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      isCurrent ? 'bg-blue-600' :
                      isCompleted ? 'bg-green-600' :
                      'bg-gray-300'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : (
                        <Icon className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <p className={`text-xs font-semibold text-center ${
                      isCurrent ? 'text-blue-900' :
                      isCompleted ? 'text-green-900' :
                      'text-gray-600'
                    }`}>
                      {step.label}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
          {/* Step A: Contact Details */}
          {currentStep === 'contact' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Details</h2>
                <p className="text-gray-600">Please provide your personal information</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.firstName || ''}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lastName || ''}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dob || ''}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Residential Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Street address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.city || ''}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={formData.informationCorrect || false}
                    onChange={(e) => setFormData({ ...formData, informationCorrect: e.target.checked })}
                    className="w-5 h-5 text-blue-600 mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    <strong>I confirm that the information provided is correct and complete</strong> to the best of my knowledge.
                  </span>
                </label>

                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={formData.actingOnBehalf || false}
                    onChange={(e) => setFormData({ ...formData, actingOnBehalf: e.target.checked })}
                    className="w-5 h-5 text-blue-600 mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    I confirm that I am <strong>acting on behalf of the entity</strong> and have the authority to provide this information.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Step B: Entity Details */}
          {currentStep === 'entity' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Entity Details</h2>
                <p className="text-gray-600">Business and company information</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Entity Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.entityType}
                    onChange={(e) => setFormData({ ...formData, entityType: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="company">Company</option>
                    <option value="trust">Trust</option>
                    <option value="partnership">Partnership</option>
                    <option value="individual">Individual</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Entity Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.entityName || ''}
                    onChange={(e) => setFormData({ ...formData, entityName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ABN <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.abn || ''}
                    onChange={(e) => setFormData({ ...formData, abn: e.target.value })}
                    placeholder="12 345 678 901"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {formData.entityType === 'company' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ACN <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.acn || ''}
                      onChange={(e) => setFormData({ ...formData, acn: e.target.value })}
                      placeholder="123 456 789"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Registered Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.registeredAddress || ''}
                    onChange={(e) => setFormData({ ...formData, registeredAddress: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Activities <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.businessActivities || ''}
                    onChange={(e) => setFormData({ ...formData, businessActivities: e.target.value })}
                    rows={4}
                    placeholder="Describe your primary business activities..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Source of Funds Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.sourceFundsCategory || ''}
                    onChange={(e) => setFormData({ ...formData, sourceFundsCategory: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select category...</option>
                    <option value="business-revenue">Business Revenue</option>
                    <option value="investment-income">Investment Income</option>
                    <option value="employment">Employment/Salary</option>
                    <option value="asset-sale">Asset Sale</option>
                    <option value="inheritance">Inheritance</option>
                    <option value="loan">Loan/Financing</option>
                    <option value="other">Other (specify in documents)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step C: Ownership & Control */}
          {currentStep === 'ownership' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Ownership & Control</h2>
                <p className="text-gray-600">Identify all individuals who own or control the entity</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>What we need:</strong> All individuals who own more than 25% OR exercise control through other means 
                  (voting rights, director appointments, etc.)
                </p>
              </div>

              {formData.entityType === 'company' && (
                <>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">Directors</h3>
                    <div className="space-y-3">
                      {formData.directors && formData.directors.length > 0 ? (
                        formData.directors.map((director, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <User className="w-5 h-5 text-gray-600" />
                            <div className="flex-1">
                              <p className="font-semibold">{director.name}</p>
                              <p className="text-sm text-gray-600">{director.ownership}% ownership</p>
                            </div>
                            <Button size="sm" variant="outline">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-4">No directors added yet</p>
                      )}
                      <Button variant="outline" className="w-full">
                        + Add Director
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">Beneficial Owners (&gt;25%)</h3>
                    <div className="space-y-3">
                      {formData.beneficialOwners && formData.beneficialOwners.length > 0 ? (
                        formData.beneficialOwners.map((owner, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Shield className="w-5 h-5 text-gray-600" />
                            <div className="flex-1">
                              <p className="font-semibold">{owner.name}</p>
                              <p className="text-sm text-gray-600">{owner.relationship}</p>
                            </div>
                            <Button size="sm" variant="outline">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-4">No beneficial owners added yet</p>
                      )}
                      <Button variant="outline" className="w-full">
                        + Add Beneficial Owner
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {formData.entityType === 'trust' && (
                <>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">Trustees</h3>
                    <Button variant="outline" className="w-full">
                      + Add Trustee
                    </Button>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">Beneficiaries</h3>
                    <Button variant="outline" className="w-full">
                      + Add Beneficiary
                    </Button>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">Appointor</h3>
                    <Button variant="outline" className="w-full">
                      + Add Appointor
                    </Button>
                  </div>
                </>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-yellow-900 mb-1">Validation Check</p>
                    <p className="text-sm text-yellow-800">
                      System will validate that ownership totals 100% and all control persons are identified. 
                      Complex structures may trigger Enhanced CDD requirements.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step D: ID Verification */}
          {currentStep === 'verify' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Identity Verification</h2>
                <p className="text-gray-600">Verify your identity using GreenID</p>
              </div>

              {greenIDStatus === 'not-started' && (
                <div className="text-center py-12">
                  <Shield className="w-24 h-24 text-blue-600 mx-auto mb-6" />
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Start GreenID Verification</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    We use GreenID to verify your identity against government databases. 
                    The process takes about 2-3 minutes and requires your driver's license or passport.
                  </p>
                  <Button 
                    className="bg-green-600 hover:bg-green-700 px-8 py-4 text-lg"
                    onClick={() => setGreenIDStatus('success')} // Simulated
                  >
                    Start Verification
                  </Button>
                </div>
              )}

              {greenIDStatus === 'success' && (
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-8 text-center">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-green-900 mb-2">Verification Complete!</h3>
                  <p className="text-green-800 mb-4">Your identity has been successfully verified.</p>
                  <div className="bg-white rounded-lg p-4 inline-block">
                    <p className="text-sm text-gray-600 mb-1">Verification ID</p>
                    <p className="font-mono text-gray-900">GID-789456123</p>
                  </div>
                </div>
              )}

              {greenIDStatus === 'failed' && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8">
                  <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-red-900 mb-2 text-center">Verification Failed</h3>
                  <p className="text-red-800 mb-6 text-center">
                    We were unable to verify your identity automatically. You can upload documents manually.
                  </p>
                  <div className="space-y-3">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Try Again
                    </Button>
                    <Button variant="outline" className="w-full">
                      Upload Documents Manually
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step E: Document Uploads */}
          {currentStep === 'uploads' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Required Documents</h2>
                <p className="text-gray-600">Upload all required documentation</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-3">Required Documents for {formData.entityType}</h3>
                <ul className="space-y-1">
                  {requiredDocuments[formData.entityType || 'company'].map((doc, index) => (
                    <li key={index} className="text-sm text-blue-800 flex items-start">
                      <span className="mr-2">•</span>
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="font-semibold text-gray-900 mb-2">Drag & Drop Files Here</p>
                <p className="text-sm text-gray-600 mb-4">or click to browse</p>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Browse Files
                  </Button>
                  <Button variant="outline">
                    <Camera className="w-4 h-4 mr-2" />
                    Take Photo
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Accepted formats: PDF, JPG, PNG (Max 10MB per file)
                </p>
              </div>

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Uploaded Documents ({uploadedFiles.length})</h3>
                  <div className="space-y-2">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="font-semibold text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-600">
                              {(file.size / 1024 / 1024).toFixed(2)} MB • Uploaded {file.uploadedAt.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step F: Declarations */}
          {currentStep === 'declarations' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Declarations & Signature</h2>
                <p className="text-gray-600">Review and sign all declarations</p>
              </div>

              <div className="space-y-4">
                <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.amlDeclaration || false}
                    onChange={(e) => setFormData({ ...formData, amlDeclaration: e.target.checked })}
                    className="w-5 h-5 text-blue-600 mt-1"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">AML/CTF Declaration</p>
                    <p className="text-sm text-gray-600">
                      I understand and acknowledge that this information is collected under the Anti-Money Laundering and 
                      Counter-Terrorism Financing Act 2006 (Cth) and consent to verification checks.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.beneficialOwnerAccuracy || false}
                    onChange={(e) => setFormData({ ...formData, beneficialOwnerAccuracy: e.target.checked })}
                    className="w-5 h-5 text-blue-600 mt-1"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Beneficial Owner Accuracy</p>
                    <p className="text-sm text-gray-600">
                      I confirm that the beneficial ownership information provided is accurate and complete to the best of my knowledge.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.screeningConsent || false}
                    onChange={(e) => setFormData({ ...formData, screeningConsent: e.target.checked })}
                    className="w-5 h-5 text-blue-600 mt-1"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Screening & Monitoring Consent</p>
                    <p className="text-sm text-gray-600">
                      I consent to screening against sanctions, PEP, and adverse media databases, and ongoing monitoring 
                      for the duration of the business relationship.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.updateObligation || false}
                    onChange={(e) => setFormData({ ...formData, updateObligation: e.target.checked })}
                    className="w-5 h-5 text-blue-600 mt-1"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Update Obligations</p>
                    <p className="text-sm text-gray-600">
                      I understand that I must promptly notify you of any changes to ownership, control, address, 
                      or other material information.
                    </p>
                  </div>
                </label>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-bold text-gray-900 mb-4">Electronic Signature</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Type Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.signature || ''}
                      onChange={(e) => setFormData({ ...formData, signature: e.target.value, signatureDate: new Date().toISOString() })}
                      placeholder="John Smith"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-serif text-2xl"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      By typing your name, you agree that this constitutes your electronic signature.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Date:</strong> {new Date().toLocaleDateString()}
                      <br />
                      <strong>IP Address:</strong> 203.45.67.89 (logged for audit purposes)
                      <br />
                      <strong>Device:</strong> Chrome on Windows (logged for audit purposes)
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Lock className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-900 mb-1">Important: Submission Locks This Version</p>
                    <p className="text-sm text-red-800">
                      Once you submit, this submission will be locked and timestamped. You can make updates later, 
                      but each update creates a new version subject to review.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={getCurrentStepIndex() === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <Button variant="outline">
              Save & Resume Later
            </Button>

            {getCurrentStepIndex() < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed()}
                className="bg-green-600 hover:bg-green-700 px-8"
              >
                <Check className="w-4 h-4 mr-2" />
                Submit for Review
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
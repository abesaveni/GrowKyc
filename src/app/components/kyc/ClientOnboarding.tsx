import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  User,
  Upload,
  CheckCircle,
  CreditCard,
  Activity,
  Shield,
  AlertTriangle,
  Building,
  Users,
  FileText,
  Loader2,
  ChevronRight,
  Check,
  X,
  Eye,
  ArrowLeft,
  Info,
  Lock,
  Globe,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Flag
} from 'lucide-react';

type OnboardingStep = 'personal' | 'upload-id' | 'consent' | 'payment' | 'processing' | 'results';

interface OnboardingData {
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  email: string;
  mobile: string;
  residentialAddress: string;
  country: string;
  postalAddress: string;
  occupation: string;
  citizenship: string;
  actingForEntity: boolean;
  idType: string;
  idUploaded: boolean;
  consentIdentity: boolean;
  consentAML: boolean;
  consentMonitoring: boolean;
  confirmAccurate: boolean;
  paymentComplete: boolean;
}

interface CheckStatus {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'complete' | 'warning';
  provider?: string;
}

interface ClientOnboardingProps {
  onComplete?: () => void;
  onBack?: () => void;
}

export function ClientOnboarding({ onComplete, onBack }: ClientOnboardingProps = {}) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('personal');
  const [formData, setFormData] = useState<OnboardingData>({
    firstName: '',
    middleName: '',
    lastName: '',
    dob: '',
    email: '',
    mobile: '',
    residentialAddress: '',
    country: 'Australia',
    postalAddress: '',
    occupation: '',
    citizenship: '',
    actingForEntity: false,
    idType: '',
    idUploaded: false,
    consentIdentity: false,
    consentAML: false,
    consentMonitoring: false,
    confirmAccurate: false,
    paymentComplete: false
  });

  const [checks, setChecks] = useState<CheckStatus[]>([
    { id: 'identity', label: 'Verifying identity', status: 'pending', provider: 'Equifax' },
    { id: 'aml', label: 'Running AML screening', status: 'pending', provider: 'ComplyAdvantage' },
    { id: 'business', label: 'Checking business risk', status: 'pending', provider: 'Illion' },
    { id: 'entities', label: 'Reviewing linked entities', status: 'pending', provider: 'ASIC' },
    { id: 'associates', label: 'Searching for associated parties', status: 'pending' },
    { id: 'ownership', label: 'Analysing ownership and control', status: 'pending' },
    { id: 'results', label: 'Preparing results', status: 'pending' }
  ]);

  const [processingComplete, setProcessingComplete] = useState(false);
  const [verificationResult, setVerificationResult] = useState<'approved' | 'review' | 'additional-info'>('approved');

  // Simulate processing checks
  useEffect(() => {
    if (currentStep === 'processing' && formData.paymentComplete) {
      const runChecks = async () => {
        for (let i = 0; i < checks.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          setChecks(prev => prev.map((check, idx) => {
            if (idx === i) return { ...check, status: 'running' };
            return check;
          }));
          
          await new Promise(resolve => setTimeout(resolve, 1500));
          setChecks(prev => prev.map((check, idx) => {
            if (idx === i) {
              // Simulate occasional warnings
              const hasWarning = i === 3 && Math.random() > 0.5;
              return { ...check, status: hasWarning ? 'warning' : 'complete' };
            }
            return check;
          }));
        }
        
        // Processing complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProcessingComplete(true);
        setVerificationResult('approved'); // Can be changed based on logic
        setCurrentStep('results');
      };
      
      runChecks();
    }
  }, [currentStep, formData.paymentComplete]);

  const steps: Array<{ id: OnboardingStep; label: string; icon: any }> = [
    { id: 'personal', label: 'Personal Details', icon: User },
    { id: 'upload-id', label: 'Upload ID', icon: Upload },
    { id: 'consent', label: 'Consent', icon: CheckCircle },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'processing', label: 'Processing', icon: Activity },
    { id: 'results', label: 'Results', icon: Shield }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const updateFormData = (field: keyof OnboardingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'personal':
        return formData.firstName && formData.lastName && formData.dob && 
               formData.email && formData.mobile && formData.residentialAddress && 
               formData.country && formData.occupation && formData.citizenship;
      case 'upload-id':
        return formData.idType && formData.idUploaded;
      case 'consent':
        return formData.consentIdentity && formData.consentAML && 
               formData.consentMonitoring && formData.confirmAccurate;
      case 'payment':
        return formData.paymentComplete;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep === 'personal') setCurrentStep('upload-id');
    else if (currentStep === 'upload-id') setCurrentStep('consent');
    else if (currentStep === 'consent') setCurrentStep('payment');
    else if (currentStep === 'payment') {
      updateFormData('paymentComplete', true);
      setCurrentStep('processing');
    }
  };

  const handleBack = () => {
    if (currentStep === 'upload-id') setCurrentStep('personal');
    else if (currentStep === 'consent') setCurrentStep('upload-id');
    else if (currentStep === 'payment') setCurrentStep('consent');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Grow KYC Verification</h1>
          <p className="text-gray-600">Secure, fast, and compliant identity verification</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isComplete = idx < currentStepIndex;
              
              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                      isComplete ? 'bg-green-500 text-white' :
                      isActive ? 'bg-cyan-500 text-white' :
                      'bg-gray-200 text-gray-500'
                    }`}>
                      {isComplete ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                    </div>
                    <p className={`text-xs font-semibold hidden md:block ${
                      isActive ? 'text-cyan-600' : isComplete ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.label}
                    </p>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 rounded ${
                      idx < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Main Content Card */}
        <Card className="border-2 border-cyan-200 shadow-2xl">
          <CardContent className="p-8">
            {/* STEP 1: Personal Details */}
            {currentStep === 'personal' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete your identity verification</h2>
                  <p className="text-gray-600">We use this to verify who you are and discover any linked entities or associated parties.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => updateFormData('firstName', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:outline-none"
                      placeholder="Enter first name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Middle Name</label>
                    <input
                      type="text"
                      value={formData.middleName}
                      onChange={(e) => updateFormData('middleName', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:outline-none"
                      placeholder="Enter middle name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => updateFormData('lastName', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:outline-none"
                      placeholder="Enter last name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.dob}
                      onChange={(e) => updateFormData('dob', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:outline-none"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mobile <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => updateFormData('mobile', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:outline-none"
                      placeholder="+61 4XX XXX XXX"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Residential Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.residentialAddress}
                      onChange={(e) => updateFormData('residentialAddress', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:outline-none"
                      placeholder="Start typing your address..."
                    />
                    <p className="text-xs text-gray-500 mt-1">Address autocomplete enabled</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => updateFormData('country', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:outline-none"
                    >
                      <option value="Australia">Australia</option>
                      <option value="New Zealand">New Zealand</option>
                      <option value="Singapore">Singapore</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United States">United States</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Citizenship <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.citizenship}
                      onChange={(e) => updateFormData('citizenship', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:outline-none"
                      placeholder="e.g., Australian"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Postal Address (if different)</label>
                    <input
                      type="text"
                      value={formData.postalAddress}
                      onChange={(e) => updateFormData('postalAddress', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:outline-none"
                      placeholder="Leave blank if same as residential"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Occupation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.occupation}
                      onChange={(e) => updateFormData('occupation', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:outline-none"
                      placeholder="e.g., Software Engineer, Business Owner"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg border-2 border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.actingForEntity}
                        onChange={(e) => updateFormData('actingForEntity', e.target.checked)}
                        className="w-5 h-5"
                      />
                      <span className="text-sm font-semibold text-gray-900">
                        Are you acting for an entity (company, trust, partnership)?
                      </span>
                    </label>
                  </div>
                </div>

                <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                  <div className="flex gap-2">
                    <Lock className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-cyan-900">Your data is secure</p>
                      <p className="text-xs text-cyan-700 mt-1">
                        All information is encrypted and handled in accordance with Australian privacy laws.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Upload ID */}
            {currentStep === 'upload-id' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload your ID</h2>
                  <p className="text-gray-600">We accept passport, driver's license, or national ID card.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Select ID Type <span className="text-red-500">*</span>
                    </label>
                    <div className="grid md:grid-cols-3 gap-3">
                      {['Passport', 'Driver License', 'National ID'].map((type) => (
                        <button
                          key={type}
                          onClick={() => updateFormData('idType', type)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            formData.idType === type
                              ? 'border-cyan-500 bg-cyan-50'
                              : 'border-gray-300 hover:border-cyan-300'
                          }`}
                        >
                          <FileText className={`w-8 h-8 mx-auto mb-2 ${
                            formData.idType === type ? 'text-cyan-600' : 'text-gray-400'
                          }`} />
                          <p className="text-sm font-semibold text-gray-900">{type}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {formData.idType && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-cyan-400 transition-colors cursor-pointer">
                      <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-semibold text-gray-900 mb-2">
                        {formData.idUploaded ? 'Document Uploaded ✓' : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        Accepted formats: JPG, PNG, PDF (max 10MB)
                      </p>
                      {!formData.idUploaded && (
                        <Button
                          onClick={() => updateFormData('idUploaded', true)}
                          className="bg-cyan-500 hover:bg-cyan-600 text-white"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Select File
                        </Button>
                      )}
                      {formData.idUploaded && (
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200 inline-block">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-semibold text-green-900">
                              {formData.idType}_scan.pdf
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-sm font-semibold text-blue-900 mb-2">Tips for best results:</p>
                    <ul className="text-sm text-blue-800 space-y-1 ml-4">
                      <li>• Ensure all text is clearly visible</li>
                      <li>• Avoid glare and shadows</li>
                      <li>• Capture the entire document</li>
                      <li>• Use good lighting</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Consent */}
            {currentStep === 'consent' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Your consent</h2>
                  <p className="text-gray-600">Please review and accept the following:</p>
                </div>

                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border-2 border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.consentIdentity}
                      onChange={(e) => updateFormData('consentIdentity', e.target.checked)}
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">Consent to identity verification</p>
                      <p className="text-sm text-gray-600 mt-1">
                        I consent to Grow verifying my identity using trusted third-party providers including Equifax and InfoTrack.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border-2 border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.consentAML}
                      onChange={(e) => updateFormData('consentAML', e.target.checked)}
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">Consent to AML screening</p>
                      <p className="text-sm text-gray-600 mt-1">
                        I consent to Grow conducting AML/CTF checks including sanctions, PEP, and adverse media screening.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border-2 border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.consentMonitoring}
                      onChange={(e) => updateFormData('consentMonitoring', e.target.checked)}
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">Consent to ongoing monitoring</p>
                      <p className="text-sm text-gray-600 mt-1">
                        I consent to ongoing monitoring of my profile for compliance purposes during the course of our relationship.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border-2 border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.confirmAccurate}
                      onChange={(e) => updateFormData('confirmAccurate', e.target.checked)}
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">Confirm information is accurate</p>
                      <p className="text-sm text-gray-600 mt-1">
                        I confirm that all information provided is true, accurate, and complete to the best of my knowledge.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="space-y-2">
                  <button className="text-sm text-cyan-600 hover:text-cyan-700 font-semibold flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    View Privacy Policy
                  </button>
                  <button className="text-sm text-cyan-600 hover:text-cyan-700 font-semibold flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    View Terms & Conditions
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Payment */}
            {currentStep === 'payment' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment</h2>
                  <p className="text-gray-600">Complete your payment to begin verification</p>
                </div>

                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-6 border-2 border-cyan-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Verification Fee</p>
                      <p className="text-3xl font-bold text-gray-900">$49.00</p>
                      <p className="text-xs text-gray-500 mt-1">One-time payment</p>
                    </div>
                    <Shield className="w-16 h-16 text-cyan-600" />
                  </div>
                  <div className="bg-white rounded-lg p-4 space-y-2">
                    <p className="text-sm font-semibold text-gray-900">This covers:</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        Identity verification
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        AML/CTF screening
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        Business risk assessment
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        Entity and ownership analysis
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
                    <input
                      type="text"
                      placeholder="4242 4242 4242 4242"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">CVC</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-green-600" />
                      <p className="text-sm font-semibold text-green-900">
                        Secure payment powered by Stripe • Your payment information is encrypted
                      </p>
                    </div>
                  </div>

                  {!formData.paymentComplete && (
                    <Button
                      onClick={() => updateFormData('paymentComplete', true)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6"
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Complete Payment - $49.00
                    </Button>
                  )}

                  {formData.paymentComplete && (
                    <div className="bg-green-100 rounded-lg p-6 border-2 border-green-300">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                        <div>
                          <p className="font-bold text-green-900 text-lg">Payment Successful</p>
                          <p className="text-sm text-green-700">Starting verification process...</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 5: Processing */}
            {currentStep === 'processing' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-10 h-10 text-cyan-600 animate-pulse" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">We're verifying your details</h2>
                  <p className="text-gray-600">This usually takes 2-3 minutes. Please don't close this page.</p>
                </div>

                <div className="space-y-3">
                  {checks.map((check) => (
                    <div
                      key={check.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        check.status === 'complete' ? 'bg-green-50 border-green-300' :
                        check.status === 'warning' ? 'bg-amber-50 border-amber-300' :
                        check.status === 'running' ? 'bg-blue-50 border-blue-300' :
                        'bg-gray-50 border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {check.status === 'pending' && <div className="w-6 h-6 rounded-full border-2 border-gray-300" />}
                          {check.status === 'running' && <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />}
                          {check.status === 'complete' && <CheckCircle className="w-6 h-6 text-green-600" />}
                          {check.status === 'warning' && <AlertTriangle className="w-6 h-6 text-amber-600" />}
                          <div>
                            <p className="font-semibold text-gray-900">{check.label}</p>
                            {check.provider && check.status !== 'pending' && (
                              <p className="text-xs text-gray-500">via {check.provider}</p>
                            )}
                          </div>
                        </div>
                        {check.status === 'complete' && (
                          <Badge className="bg-green-100 text-green-700">Complete</Badge>
                        )}
                        {check.status === 'warning' && (
                          <Badge className="bg-amber-100 text-amber-700">Review Needed</Badge>
                        )}
                        {check.status === 'running' && (
                          <Badge className="bg-blue-100 text-blue-700">Running...</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200 text-center">
                  <p className="text-sm text-cyan-800">
                    We're running comprehensive checks across multiple systems to ensure compliance and security.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 6: Results */}
            {currentStep === 'results' && (
              <div className="space-y-6">
                {verificationResult === 'approved' && (
                  <>
                    <div className="text-center">
                      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-16 h-16 text-green-600" />
                      </div>
                      <h2 className="text-3xl font-bold text-green-900 mb-2">Verification Complete!</h2>
                      <p className="text-gray-600 text-lg">Your identity has been successfully verified</p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-6 border-2 border-green-300">
                      <h3 className="font-bold text-green-900 mb-3">What happens next?</h3>
                      <ul className="space-y-2 text-sm text-green-800">
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <span>Your profile is now active and fully verified</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <span>All compliance checks have been completed successfully</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <span>You can now access all Grow platform services</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <span>Ongoing monitoring is active to keep your profile current</span>
                        </li>
                      </ul>
                    </div>

                    <Button
                      onClick={onComplete}
                      className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6"
                    >
                      <ChevronRight className="w-5 h-5 mr-2" />
                      Continue to Dashboard
                    </Button>
                  </>
                )}

                {verificationResult === 'review' && (
                  <>
                    <div className="text-center">
                      <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-16 h-16 text-amber-600" />
                      </div>
                      <h2 className="text-3xl font-bold text-amber-900 mb-2">Review Required</h2>
                      <p className="text-gray-600 text-lg">Our team is reviewing your details</p>
                    </div>

                    <div className="bg-amber-50 rounded-lg p-6 border-2 border-amber-300">
                      <h3 className="font-bold text-amber-900 mb-3">What this means:</h3>
                      <p className="text-sm text-amber-800 mb-3">
                        Some aspects of your verification require manual review by our compliance team. This is a standard process and doesn't indicate any issues.
                      </p>
                      <ul className="space-y-2 text-sm text-amber-800">
                        <li className="flex items-start gap-2">
                          <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <span>We'll complete the review within 1-2 business days</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <span>You'll receive an email once the review is complete</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <span>No further action is required from you at this time</span>
                        </li>
                      </ul>
                    </div>
                  </>
                )}

                {verificationResult === 'additional-info' && (
                  <>
                    <div className="text-center">
                      <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-16 h-16 text-blue-600" />
                      </div>
                      <h2 className="text-3xl font-bold text-blue-900 mb-2">Additional Information Required</h2>
                      <p className="text-gray-600 text-lg">We need a few more details to complete verification</p>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-300">
                      <h3 className="font-bold text-blue-900 mb-3">Please provide:</h3>
                      <ul className="space-y-2 text-sm text-blue-800">
                        <li className="flex items-start gap-2">
                          <FileText className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <span>Proof of address (utility bill or bank statement, dated within last 3 months)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <FileText className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <span>Additional identification document</span>
                        </li>
                      </ul>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6">
                      <Upload className="w-5 h-5 mr-2" />
                      Upload Documents
                    </Button>
                  </>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            {currentStep !== 'processing' && currentStep !== 'results' && (
              <div className="flex gap-3 mt-8 pt-6 border-t">
                {currentStep !== 'personal' && (
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="flex-1 border-2 py-6"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className={`flex-1 py-6 text-lg ${
                    currentStep === 'personal' ? 'w-full' : ''
                  } ${
                    canProceed()
                      ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {currentStep === 'consent' ? 'Agree and Continue' : 
                   currentStep === 'upload-id' ? 'Continue' :
                   currentStep === 'personal' ? 'Continue to Upload ID' : 'Next'}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        {currentStep !== 'results' && (
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>Bank-level security</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>AUSTRAC compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>ISO 27001 certified</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
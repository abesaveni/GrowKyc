// Loan Scenario Submission - Dynamic form based on loan type
import React, { useState } from 'react';
import {
  Building2,
  Users,
  DollarSign,
  FileText,
  MapPin,
  Calendar,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Save,
  Send,
  X,
  Plus,
  Minus,
  Home,
  Briefcase,
  Hammer,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

type LoanType = '' | 'refinance-commercial' | 'construction-development' | 'property-purchase' | 'bridging-finance' | 'land-acquisition';

interface LoanScenarioData {
  // Basic Info
  loanType: LoanType;
  borrowerName: string;
  securityAddress: string;
  loanAmount: number;
  loanPurpose: string;
  loanTerm: number;
  loanRepaymentType: string;
  settlementDate: string;
  brokerage: number;

  // Guarantors & Business
  guarantorsAge: string;
  borrowerBusinessBackground: string;

  // Security Details
  securityOwnership: string;
  securityUse: string;
  otherPropertyAssets: string;
  nrv: number;
  estimatedLandValue: number;
  lvrCompletion: number;
  lvrLandValue: number;

  // Existing Loans (for refinance)
  currentLender?: string;
  currentLoanAmount?: number;

  // Construction/Development Specific
  daApproved?: boolean;
  constructionStage?: string;
  projectSummary?: string;
  developerBackground?: string;
  ownerBuilder?: boolean;
  constructionCost?: number;
  maxContributionAtSettlement?: number;
  contingency?: number;
  expectedConstructionPeriod?: number;
  accountantsLetter?: boolean;

  // Exit Strategy & Risk
  exitStrategy: string;
  issuesConcerns: string;
}

export function LoanScenario() {
  const [formData, setFormData] = useState<LoanScenarioData>({
    loanType: '',
    borrowerName: '',
    securityAddress: '',
    loanAmount: 0,
    loanPurpose: '',
    loanTerm: 12,
    loanRepaymentType: 'interest-only',
    settlementDate: '',
    brokerage: 0,
    guarantorsAge: '',
    borrowerBusinessBackground: '',
    securityOwnership: '',
    securityUse: '',
    otherPropertyAssets: '',
    nrv: 0,
    estimatedLandValue: 0,
    lvrCompletion: 0,
    lvrLandValue: 0,
    exitStrategy: '',
    issuesConcerns: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (field: keyof LoanScenarioData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const loanTypes = [
    { value: 'refinance-commercial', label: 'Refinance - Commercial', icon: RefreshCw, color: 'blue' },
    { value: 'construction-development', label: 'Construction / Development', icon: Hammer, color: 'orange' },
    { value: 'property-purchase', label: 'Property Purchase', icon: Home, color: 'green' },
    { value: 'bridging-finance', label: 'Bridging Finance', icon: TrendingUp, color: 'purple' },
    { value: 'land-acquisition', label: 'Land Acquisition', icon: MapPin, color: 'amber' }
  ];

  const repaymentTypes = [
    'Interest Only',
    'Principal & Interest',
    'Interest Capitalized',
    'Progress Payments'
  ];

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Loan Type Selection';
      case 2: return 'Borrower & Security Details';
      case 3: return formData.loanType === 'construction-development' ? 'Construction Details' : 'Loan Structure';
      case 4: return 'Exit Strategy & Risk Assessment';
      default: return 'Loan Scenario';
    }
  };

  const getTotalSteps = () => {
    return formData.loanType === 'construction-development' ? 4 : 4;
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.loanType || !formData.borrowerName || !formData.securityAddress) {
      toast.error('Please complete all required fields');
      return;
    }

    setSubmitted(true);
    toast.success('✓ Loan scenario submitted successfully!');
  };

  if (submitted) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-300 rounded-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Scenario Submitted!</h2>
          <p className="text-gray-700 mb-6">
            Your loan scenario has been submitted for assessment. Our credit team will review and respond within 24-48 hours.
          </p>
          <div className="bg-white rounded-lg p-6 mb-6 text-left">
            <h3 className="font-bold text-gray-900 mb-4">Submission Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Loan Type</p>
                <p className="font-semibold text-gray-900">
                  {loanTypes.find(t => t.value === formData.loanType)?.label}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Borrower</p>
                <p className="font-semibold text-gray-900">{formData.borrowerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Loan Amount</p>
                <p className="font-semibold text-gray-900">${formData.loanAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">LVR</p>
                <p className="font-semibold text-gray-900">{formData.lvrCompletion}%</p>
              </div>
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setSubmitted(false);
                setCurrentStep(1);
                setFormData({
                  loanType: '',
                  borrowerName: '',
                  securityAddress: '',
                  loanAmount: 0,
                  loanPurpose: '',
                  loanTerm: 12,
                  loanRepaymentType: 'interest-only',
                  settlementDate: '',
                  brokerage: 0,
                  guarantorsAge: '',
                  borrowerBusinessBackground: '',
                  securityOwnership: '',
                  securityUse: '',
                  otherPropertyAssets: '',
                  nrv: 0,
                  estimatedLandValue: 0,
                  lvrCompletion: 0,
                  lvrLandValue: 0,
                  exitStrategy: '',
                  issuesConcerns: ''
                });
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Submit Another Scenario
            </button>
            <button
              onClick={() => window.print()}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Print Summary
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white mb-6">
          <h1 className="text-3xl font-bold mb-2">Loan Scenario Submission</h1>
          <p className="text-blue-100">Submit a loan scenario for credit assessment and approval</p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].slice(0, getTotalSteps()).map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                      step === currentStep
                        ? 'bg-blue-600 text-white'
                        : step < currentStep
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step < currentStep ? <CheckCircle className="w-6 h-6" /> : step}
                  </div>
                  <p className={`text-xs mt-2 font-semibold ${step === currentStep ? 'text-blue-600' : 'text-gray-600'}`}>
                    Step {step}
                  </p>
                </div>
                {step < getTotalSteps() && (
                  <div className={`h-1 flex-1 mx-2 ${step < currentStep ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <h2 className="text-xl font-bold text-gray-900 text-center">{getStepTitle()}</h2>
        </div>

        {/* Step 1: Loan Type Selection */}
        {currentStep === 1 && (
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Select Loan Type</h3>
            <p className="text-gray-600 mb-6">Choose the type of loan scenario you're submitting</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loanTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = formData.loanType === type.value;
                return (
                  <button
                    key={type.value}
                    onClick={() => handleInputChange('loanType', type.value)}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 bg-white'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-lg bg-${type.color}-100 flex items-center justify-center mb-3`}>
                      <Icon className={`w-6 h-6 text-${type.color}-600`} />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1">{type.label}</h4>
                    {isSelected && (
                      <CheckCircle className="w-5 h-5 text-blue-600 mt-2" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  if (!formData.loanType) {
                    toast.error('Please select a loan type');
                    return;
                  }
                  setCurrentStep(2);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Borrower & Security Details */}
        {currentStep === 2 && (
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Borrower & Security Information</h3>

            <div className="space-y-6">
              {/* Borrower Details */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Borrower Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Borrower Name *
                    </label>
                    <input
                      type="text"
                      value={formData.borrowerName}
                      onChange={(e) => handleInputChange('borrowerName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="Full legal name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Guarantors Age
                    </label>
                    <input
                      type="text"
                      value={formData.guarantorsAge}
                      onChange={(e) => handleInputChange('guarantorsAge', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="e.g., 45, 52"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Borrower's Business Background
                    </label>
                    <textarea
                      value={formData.borrowerBusinessBackground}
                      onChange={(e) => handleInputChange('borrowerBusinessBackground', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      rows={3}
                      placeholder="Describe borrower's business experience and background"
                    />
                  </div>
                </div>
              </div>

              {/* Security Details */}
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <h4 className="font-bold text-green-900 mb-4 flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Security Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Security Address *
                    </label>
                    <input
                      type="text"
                      value={formData.securityAddress}
                      onChange={(e) => handleInputChange('securityAddress', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="Full property address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Security Ownership
                    </label>
                    <input
                      type="text"
                      value={formData.securityOwnership}
                      onChange={(e) => handleInputChange('securityOwnership', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="e.g., Sole owner, Joint tenants"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Security Use
                    </label>
                    <input
                      type="text"
                      value={formData.securityUse}
                      onChange={(e) => handleInputChange('securityUse', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="e.g., Residential, Commercial"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Other Property Assets
                    </label>
                    <textarea
                      value={formData.otherPropertyAssets}
                      onChange={(e) => handleInputChange('otherPropertyAssets', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      rows={2}
                      placeholder="List other property holdings"
                    />
                  </div>
                </div>
              </div>

              {/* Valuation Details */}
              <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                <h4 className="font-bold text-purple-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Valuation & LVR
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      NRV (Net Realisable Value) *
                    </label>
                    <input
                      type="number"
                      value={formData.nrv}
                      onChange={(e) => handleInputChange('nrv', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Estimated Land Value (As Is)
                    </label>
                    <input
                      type="number"
                      value={formData.estimatedLandValue}
                      onChange={(e) => handleInputChange('estimatedLandValue', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      LVR on Completion Value (%)
                    </label>
                    <input
                      type="number"
                      value={formData.lvrCompletion}
                      onChange={(e) => handleInputChange('lvrCompletion', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      LVR on Land Value (%)
                    </label>
                    <input
                      type="number"
                      value={formData.lvrLandValue}
                      onChange={(e) => handleInputChange('lvrLandValue', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Back
              </button>
              <button
                onClick={() => {
                  if (!formData.borrowerName || !formData.securityAddress) {
                    toast.error('Please complete required fields');
                    return;
                  }
                  setCurrentStep(3);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Loan Structure or Construction Details */}
        {currentStep === 3 && (
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              {formData.loanType === 'construction-development' ? 'Construction Details' : 'Loan Structure'}
            </h3>

            <div className="space-y-6">
              {/* Loan Structure (Always shown) */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Loan Structure
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Loan Amount *
                    </label>
                    <input
                      type="number"
                      value={formData.loanAmount}
                      onChange={(e) => handleInputChange('loanAmount', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Loan Term (months)
                    </label>
                    <input
                      type="number"
                      value={formData.loanTerm}
                      onChange={(e) => handleInputChange('loanTerm', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Loan Repayment Type
                    </label>
                    <select
                      value={formData.loanRepaymentType}
                      onChange={(e) => handleInputChange('loanRepaymentType', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      {repaymentTypes.map((type) => (
                        <option key={type} value={type.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Settlement Date
                    </label>
                    <input
                      type="date"
                      value={formData.settlementDate}
                      onChange={(e) => handleInputChange('settlementDate', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Loan Purpose
                    </label>
                    <textarea
                      value={formData.loanPurpose}
                      onChange={(e) => handleInputChange('loanPurpose', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      rows={2}
                      placeholder="Describe the purpose of the loan"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Brokerage (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.brokerage}
                      onChange={(e) => handleInputChange('brokerage', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Refinance Specific */}
              {(formData.loanType === 'refinance-commercial') && (
                <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
                  <h4 className="font-bold text-amber-900 mb-4 flex items-center gap-2">
                    <RefreshCw className="w-5 h-5" />
                    Current Loan Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Current Lender
                      </label>
                      <input
                        type="text"
                        value={formData.currentLender || ''}
                        onChange={(e) => handleInputChange('currentLender', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Lender name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Current Loan Amount
                      </label>
                      <input
                        type="number"
                        value={formData.currentLoanAmount || 0}
                        onChange={(e) => handleInputChange('currentLoanAmount', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Construction/Development Specific */}
              {formData.loanType === 'construction-development' && (
                <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                  <h4 className="font-bold text-orange-900 mb-4 flex items-center gap-2">
                    <Hammer className="w-5 h-5" />
                    Construction Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        DA Approved
                      </label>
                      <select
                        value={formData.daApproved ? 'yes' : 'no'}
                        onChange={(e) => handleInputChange('daApproved', e.target.value === 'yes')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Construction Stage
                      </label>
                      <input
                        type="text"
                        value={formData.constructionStage || ''}
                        onChange={(e) => handleInputChange('constructionStage', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="e.g., Pre-construction, Frame"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Owner Builder
                      </label>
                      <select
                        value={formData.ownerBuilder ? 'yes' : 'no'}
                        onChange={(e) => handleInputChange('ownerBuilder', e.target.value === 'yes')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="yes">Yes</option>
                        <option value="no">No - Licensed Builder</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Construction Cost
                      </label>
                      <input
                        type="number"
                        value={formData.constructionCost || 0}
                        onChange={(e) => handleInputChange('constructionCost', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Max Contribution at Settlement
                      </label>
                      <input
                        type="number"
                        value={formData.maxContributionAtSettlement || 0}
                        onChange={(e) => handleInputChange('maxContributionAtSettlement', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Contingency (%)
                      </label>
                      <input
                        type="number"
                        value={formData.contingency || 0}
                        onChange={(e) => handleInputChange('contingency', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="10"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Expected Construction Period (months)
                      </label>
                      <input
                        type="number"
                        value={formData.expectedConstructionPeriod || 0}
                        onChange={(e) => handleInputChange('expectedConstructionPeriod', parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="12"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Accountant's Letter Provided
                      </label>
                      <select
                        value={formData.accountantsLetter ? 'yes' : 'no'}
                        onChange={(e) => handleInputChange('accountantsLetter', e.target.value === 'yes')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Project Summary
                      </label>
                      <textarea
                        value={formData.projectSummary || ''}
                        onChange={(e) => handleInputChange('projectSummary', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        rows={3}
                        placeholder="Describe the construction/development project"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Developer Background
                      </label>
                      <textarea
                        value={formData.developerBackground || ''}
                        onChange={(e) => handleInputChange('developerBackground', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        rows={2}
                        placeholder="Developer's experience and track record"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Exit Strategy & Risk */}
        {currentStep === 4 && (
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Exit Strategy & Risk Assessment</h3>

            <div className="space-y-6">
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <h4 className="font-bold text-green-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Exit Strategy
                </h4>
                <textarea
                  value={formData.exitStrategy}
                  onChange={(e) => handleInputChange('exitStrategy', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows={4}
                  placeholder="Describe the exit strategy for this loan (e.g., refinance to major bank, property sale, business cash flow)"
                />
              </div>

              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <h4 className="font-bold text-red-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Issues / Concerns
                </h4>
                <textarea
                  value={formData.issuesConcerns}
                  onChange={(e) => handleInputChange('issuesConcerns', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows={4}
                  placeholder="Note any issues, concerns, or risk factors that should be considered"
                />
              </div>

              {/* Summary Card */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-300 rounded-lg p-6">
                <h4 className="font-bold text-blue-900 mb-4">Scenario Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Loan Type</p>
                    <p className="font-bold text-gray-900">
                      {loanTypes.find(t => t.value === formData.loanType)?.label}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Borrower</p>
                    <p className="font-bold text-gray-900">{formData.borrowerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Loan Amount</p>
                    <p className="font-bold text-gray-900">${formData.loanAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">LVR</p>
                    <p className="font-bold text-gray-900">{formData.lvrCompletion}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Term</p>
                    <p className="font-bold text-gray-900">{formData.loanTerm} months</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Brokerage</p>
                    <p className="font-bold text-gray-900">{formData.brokerage}%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                <Send className="w-5 h-5" />
                Submit Scenario
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

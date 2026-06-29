import React, { useState } from 'react';
import { 
  Shield, 
  Building, 
  Users, 
  FileText, 
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  Lock,
  User,
  DollarSign
} from 'lucide-react';
import {
  PrimaryButton,
  SecondaryButton,
  StatusBadge,
  RiskMeter,
  TextInput,
  DateInput,
  DropdownInput,
  RiskFlagToggle,
  FileUploadArea,
  ProgressIndicator
} from './DesignSystem';
import { toast } from 'sonner';
import { useAuth } from '../../../context/AuthContext';

type EntityType = 'individual' | 'sole-trader' | 'company' | 'trust' | 'partnership' | 'smsf';
type OnboardingStep = 
  | 'welcome'
  | 'entity-selection'
  | 'core-details'
  | 'ownership-builder'
  | 'identity-upload'
  | 'risk-questions'
  | 'documents'
  | 'engagement-payment'
  | 'review-submit';

interface BeneficialOwner {
  id: string;
  name: string;
  ownership: number;
  isUBO: boolean; // 25% or more
}

export function EnhancedClientPortal() {
  const { user } = useAuth();
  const isPartner = user?.role === 'partner';
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [entityType, setEntityType] = useState<EntityType | null>(null);
  const [riskScore, setRiskScore] = useState(15); // 0-100

  // Form state
  const [companyName, setCompanyName] = useState('');
  const [acn, setACN] = useState('');
  const [abn, setABN] = useState('');
  const [owners, setOwners] = useState<BeneficialOwner[]>([]);
  const [riskFlags, setRiskFlags] = useState({
    cashInvolvement: false,
    cryptoInvolvement: false,
    pepExposure: false,
    highRiskCountry: false,
    complexStructure: false,
    unusualPurpose: false
  });

  const stepLabels = [
    'Welcome',
    'Entity Type',
    'Details',
    'Ownership',
    'Identity',
    'Risk',
    'Documents',
    'Payment',
    'Review'
  ];

  const getCurrentStepIndex = () => {
    const steps: OnboardingStep[] = [
      'welcome',
      'entity-selection',
      'core-details',
      'ownership-builder',
      'identity-upload',
      'risk-questions',
      'documents',
      'engagement-payment',
      'review-submit'
    ];
    return steps.indexOf(currentStep) + 1;
  };

  const handleNext = () => {
    const steps: OnboardingStep[] = [
      'welcome',
      'entity-selection',
      'core-details',
      'ownership-builder',
      'identity-upload',
      'risk-questions',
      'documents',
      'engagement-payment',
      'review-submit'
    ];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    const steps: OnboardingStep[] = [
      'welcome',
      'entity-selection',
      'core-details',
      'ownership-builder',
      'identity-upload',
      'risk-questions',
      'documents',
      'engagement-payment',
      'review-submit'
    ];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
      window.scrollTo(0, 0);
    }
  };

  // Calculate risk score based on flags
  React.useEffect(() => {
    let score = 15; // Base score
    if (riskFlags.cashInvolvement) score += 15;
    if (riskFlags.cryptoInvolvement) score += 20;
    if (riskFlags.pepExposure) score += 25;
    if (riskFlags.highRiskCountry) score += 15;
    if (riskFlags.complexStructure) score += 10;
    if (riskFlags.unusualPurpose) score += 15;
    setRiskScore(Math.min(score, 100));
  }, [riskFlags]);

  const renderWelcome = () => (
    <div className="max-w-4xl mx-auto text-center space-y-8">
      <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6">
        <Shield className="w-12 h-12 text-white" />
      </div>

      <div>
        <h1 className="text-4xl font-bold text-slate-100 mb-4">Welcome to Our Firm</h1>
        <p className="text-xl text-slate-300">
          Let's get you started with our secure onboarding process
        </p>
      </div>

      <div className="bg-white border-2 border-white/10 rounded-lg p-8 text-left">
        <h3 className="font-bold text-slate-100 mb-4 text-lg">What to Expect</h3>
        <ul className="space-y-3 text-slate-300">
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
            <span>Simple step-by-step process (approx. 10-15 minutes)</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
            <span>Secure document upload</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
            <span>Bank-level encryption</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
            <span>AUSTRAC compliant</span>
          </li>
        </ul>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {[
          { icon: Lock, label: 'Secure', desc: 'Bank-level encryption' },
          { icon: Shield, label: 'Compliant', desc: 'AUSTRAC approved' },
          { icon: CheckCircle, label: 'Fast', desc: 'Under 15 minutes' }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white border-2 border-white/10 rounded-lg p-6 text-center">
              <Icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <h4 className="font-bold text-slate-100 mb-1">{item.label}</h4>
              <p className="text-sm text-slate-300">{item.desc}</p>
            </div>
          );
        })}
      </div>

      <PrimaryButton 
        onClick={() => !isPartner && handleNext()} 
        className={`px-12 ${isPartner ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isPartner}
        title={isPartner ? "Managing Partners cannot start onboarding cases." : undefined}
      >
        Start Onboarding
        <ChevronRight className="w-5 h-5 ml-2 inline" />
      </PrimaryButton>
    </div>
  );

  const renderEntitySelection = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-100 mb-2">Select Your Entity Type</h2>
        <p className="text-slate-300">Choose the option that best describes your business</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {[
          { type: 'individual' as EntityType, icon: User, label: 'Individual', desc: 'Personal services' },
          { type: 'sole-trader' as EntityType, icon: User, label: 'Sole Trader', desc: 'Operating alone' },
          { type: 'company' as EntityType, icon: Building, label: 'Company', desc: 'Pty Ltd entity' },
          { type: 'trust' as EntityType, icon: Shield, label: 'Trust', desc: 'Family or unit trust' },
          { type: 'partnership' as EntityType, icon: Users, label: 'Partnership', desc: 'Multiple partners' },
          { type: 'smsf' as EntityType, icon: DollarSign, label: 'SMSF', desc: 'Self-managed super fund' }
        ].map((entity) => {
          const Icon = entity.icon;
          const isSelected = entityType === entity.type;
          return (
            <button
              key={entity.type}
              onClick={() => setEntityType(entity.type)}
              className={`p-8 border-2 rounded-lg text-left transition-all ${
                isSelected
                  ? 'border-blue-600 bg-blue-500/10'
                  : 'border-white/10 bg-white hover:border-white/10'
              }`}
            >
              <Icon className={`w-12 h-12 mb-4 ${isSelected ? 'text-blue-400' : 'text-gray-400'}`} />
              <h3 className="text-xl font-bold text-slate-100 mb-1">{entity.label}</h3>
              <p className="text-sm text-slate-300">{entity.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderCoreDetails = () => (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-3 gap-6">
        {/* Left Panel: Navigation */}
        <div className="col-span-1 bg-white border-2 border-white/10 rounded-lg p-6 h-fit sticky top-6">
          <h3 className="font-bold text-slate-100 mb-4">Sections</h3>
          <div className="space-y-2">
            {['Company Details', 'Registered Address', 'Contact Information'].map((section, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-blue-500/10 text-blue-300">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-semibold">{section}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Form */}
        <div className="col-span-2 space-y-6">
          {entityType === 'company' && (
            <>
              <div className="bg-white border-2 border-white/10 rounded-lg p-6 space-y-4">
                <h3 className="font-bold text-slate-100 text-lg mb-4">Company Details</h3>
                
                <TextInput
                  label="ACN (Australian Company Number)"
                  value={acn}
                  onChange={setACN}
                  placeholder="123 456 789"
                  required
                />

                {acn.length === 11 && (
                  <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-lg p-4">
                    <p className="text-sm font-semibold text-blue-300 mb-2">ASIC Data Preview</p>
                    <div className="space-y-1 text-sm text-blue-300">
                      <p><strong>Company Name:</strong> {companyName || 'Loading...'}</p>
                      <p><strong>Status:</strong> Registered</p>
                      <p><strong>Directors:</strong> John Smith, Jane Doe</p>
                    </div>
                    <p className="text-xs text-blue-400 mt-2">✓ Confirm these details or edit below</p>
                  </div>
                )}

                <TextInput
                  label="Company Legal Name"
                  value={companyName}
                  onChange={setCompanyName}
                  placeholder="ABC Pty Ltd"
                  required
                />

                <TextInput
                  label="ABN (Australian Business Number)"
                  value={abn}
                  onChange={setABN}
                  placeholder="12 345 678 901"
                  required
                />
              </div>

              <div className="bg-white border-2 border-white/10 rounded-lg p-6 space-y-4">
                <h3 className="font-bold text-slate-100 text-lg mb-4">Registered Address</h3>
                <TextInput
                  label="Street Address"
                  value=""
                  onChange={() => {}}
                  placeholder="123 Business Street"
                  required
                />
                <div className="grid grid-cols-3 gap-4">
                  <TextInput
                    label="Suburb"
                    value=""
                    onChange={() => {}}
                    placeholder="Melbourne"
                    required
                  />
                  <DropdownInput
                    label="State"
                    value=""
                    onChange={() => {}}
                    options={[
                      { value: 'VIC', label: 'VIC' },
                      { value: 'NSW', label: 'NSW' },
                      { value: 'QLD', label: 'QLD' },
                      { value: 'SA', label: 'SA' },
                      { value: 'WA', label: 'WA' },
                      { value: 'TAS', label: 'TAS' }
                    ]}
                    required
                  />
                  <TextInput
                    label="Postcode"
                    value=""
                    onChange={() => {}}
                    placeholder="3000"
                    required
                  />
                </div>
              </div>

              <div className="bg-white border-2 border-white/10 rounded-lg p-6 space-y-4">
                <h3 className="font-bold text-slate-100 text-lg mb-4">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <TextInput
                    label="Contact Name"
                    value=""
                    onChange={() => {}}
                    placeholder="John Smith"
                    required
                  />
                  <TextInput
                    label="Contact Email"
                    value=""
                    onChange={() => {}}
                    placeholder="john@company.com"
                    required
                  />
                  <TextInput
                    label="Contact Phone"
                    value=""
                    onChange={() => {}}
                    placeholder="0400 000 000"
                    required
                  />
                  <DropdownInput
                    label="Contact Role"
                    value=""
                    onChange={() => {}}
                    options={[
                      { value: 'director', label: 'Director' },
                      { value: 'secretary', label: 'Company Secretary' },
                      { value: 'cfo', label: 'CFO' },
                      { value: 'accountant', label: 'Accountant' }
                    ]}
                    required
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderOwnershipBuilder = () => (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-100 mb-2">Ownership Structure</h2>
        <p className="text-slate-300">Build your ownership diagram (beneficial owners with 25%+ highlighted)</p>
      </div>

      {/* Interactive Ownership Diagram would go here */}
      <div className="bg-white border-2 border-white/10 rounded-lg p-8">
        <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-lg">
          <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-slate-300 mb-4">Interactive ownership diagram builder</p>
          <PrimaryButton onClick={() => toast.info('Ownership builder opened')}>
            Build Ownership Structure
          </PrimaryButton>
        </div>
      </div>

      <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-400 mt-0.5" />
          <div>
            <p className="font-bold text-amber-300 mb-1">UBO Requirement</p>
            <p className="text-sm text-amber-300">
              We must identify all beneficial owners who hold 25% or more ownership. This is a legal requirement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIdentityUpload = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-100 mb-2">Identity Verification</h2>
        <p className="text-slate-300">Upload identification documents for all directors and beneficial owners</p>
      </div>

      {/* Directors/Owners Cards */}
      <div className="space-y-4">
        {['John Smith (Director, 50%)', 'Jane Doe (Director, 50%)'].map((person, idx) => (
          <div key={idx} className="bg-white border-2 border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-100">{person}</h3>
              <StatusBadge status="pending" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FileUploadArea
                label="Passport or Driver's License"
                onUpload={(file) => toast.success(`${file.name} uploaded`)}
                accept="image/*,application/pdf"
                required
              />
              <FileUploadArea
                label="Proof of Address"
                onUpload={(file) => toast.success(`${file.name} uploaded`)}
                accept="image/*,application/pdf"
                required
              />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-lg p-6">
        <p className="text-sm font-semibold text-blue-300 mb-2">OCR Auto-Extract</p>
        <p className="text-sm text-blue-300">
          We'll automatically extract data from your documents for verification. You'll be able to review before submitting.
        </p>
      </div>
    </div>
  );

  const renderRiskQuestions = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-100 mb-2">Risk Assessment</h2>
        <p className="text-slate-300">Help us understand your business activities</p>
      </div>

      {/* Live Risk Score */}
      <div className="bg-white border-2 border-white/10 rounded-lg p-6">
        <RiskMeter score={riskScore} label="Current Risk Score" size="lg" />
      </div>

      {/* Risk Questions */}
      <div className="space-y-4">
        <RiskFlagToggle
          label="Do you deal with large amounts of cash?"
          description="Transactions over $10,000 in cash"
          checked={riskFlags.cashInvolvement}
          onChange={(checked) => setRiskFlags({ ...riskFlags, cashInvolvement: checked })}
          riskLevel="medium"
        />
        <RiskFlagToggle
          label="Do you deal with cryptocurrency?"
          description="Bitcoin, Ethereum, or other digital currencies"
          checked={riskFlags.cryptoInvolvement}
          onChange={(checked) => setRiskFlags({ ...riskFlags, cryptoInvolvement: checked })}
          riskLevel="high"
        />
        <RiskFlagToggle
          label="Are any owners Politically Exposed Persons (PEPs)?"
          description="Government officials, diplomats, or their family members"
          checked={riskFlags.pepExposure}
          onChange={(checked) => setRiskFlags({ ...riskFlags, pepExposure: checked })}
          riskLevel="high"
        />
        <RiskFlagToggle
          label="Do you operate in high-risk countries?"
          description="Countries with known money laundering or terrorism concerns"
          checked={riskFlags.highRiskCountry}
          onChange={(checked) => setRiskFlags({ ...riskFlags, highRiskCountry: checked })}
          riskLevel="high"
        />
        <RiskFlagToggle
          label="Complex ownership structure?"
          description="Multiple layers of ownership or offshore entities"
          checked={riskFlags.complexStructure}
          onChange={(checked) => setRiskFlags({ ...riskFlags, complexStructure: checked })}
          riskLevel="medium"
        />
        <RiskFlagToggle
          label="Unusual business purpose?"
          description="Purpose is unclear or doesn't match typical industry patterns"
          checked={riskFlags.unusualPurpose}
          onChange={(checked) => setRiskFlags({ ...riskFlags, unusualPurpose: checked })}
          riskLevel="medium"
        />
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-100 mb-2">Supporting Documents</h2>
        <p className="text-slate-300">Upload required documents</p>
      </div>

      <div className="space-y-4">
        {[
          { name: 'Certificate of Incorporation', required: true },
          { name: 'Company Constitution', required: true },
          { name: 'Trust Deed', required: entityType === 'trust' },
          { name: 'Recent Financial Statements', required: false },
          { name: 'Bank Statements (3 months)', required: false }
        ]
          .filter((doc) => doc.required || entityType === 'trust')
          .map((doc, idx) => (
            <FileUploadArea
              key={idx}
              label={doc.name}
              onUpload={(file) => toast.success(`${file.name} uploaded`)}
              required={doc.required}
            />
          ))}
      </div>
    </div>
  );

  const renderEngagementPayment = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-100 mb-2">Engagement & Payment</h2>
        <p className="text-slate-300">Review our engagement letter and setup payment</p>
      </div>

      <div className="bg-white border-2 border-white/10 rounded-lg p-6">
        <h3 className="font-bold text-slate-100 mb-4">Engagement Letter</h3>
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 max-h-96 overflow-y-auto">
          <p className="text-sm text-slate-300 whitespace-pre-line">
            {`This engagement letter confirms the terms of our professional services...

1. Services to be provided
2. Fees and payment terms
3. Our responsibilities
4. Your responsibilities
5. Limitations and disclaimers

[Full engagement letter content would appear here]`}
          </p>
        </div>
      </div>

      <div className="bg-white border-2 border-white/10 rounded-lg p-6">
        <h3 className="font-bold text-slate-100 mb-4">Fee Structure</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between py-2">
            <span className="text-slate-300">Onboarding Fee</span>
            <span className="font-bold text-slate-100">$500.00</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-slate-300">Monthly Service Fee</span>
            <span className="font-bold text-slate-100">$150.00</span>
          </div>
          <div className="border-t-2 border-white/10 pt-2 flex items-center justify-between">
            <span className="font-bold text-slate-100">Total Due Today</span>
            <span className="font-bold text-blue-400 text-xl">$500.00</span>
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-white/10 rounded-lg p-6 space-y-4">
        <h3 className="font-bold text-slate-100 mb-4">Payment Method</h3>
        <TextInput
          label="Cardholder Name"
          value=""
          onChange={() => {}}
          placeholder="John Smith"
          required
        />
        <TextInput
          label="Card Number"
          value=""
          onChange={() => {}}
          placeholder="4242 4242 4242 4242"
          required
        />
        <div className="grid grid-cols-3 gap-4">
          <TextInput
            label="Expiry"
            value=""
            onChange={() => {}}
            placeholder="MM/YY"
            required
          />
          <TextInput
            label="CVV"
            value=""
            onChange={() => {}}
            placeholder="123"
            required
          />
          <div />
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 bg-white/5 border border-white/10 rounded-lg">
        <input type="checkbox" className="mt-1 w-5 h-5" required />
        <p className="text-sm text-slate-300">
          I agree to the engagement letter terms and authorize payment of $500.00
        </p>
      </div>
    </div>
  );

  const renderReviewSubmit = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-100 mb-2">Review & Submit</h2>
        <p className="text-slate-300">Please review all information before submitting</p>
      </div>

      <div className="bg-white border-2 border-white/10 rounded-lg p-6">
        <h3 className="font-bold text-slate-100 mb-4">Entity Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-300">Entity Type</p>
            <p className="font-semibold text-slate-100 capitalize">{entityType}</p>
          </div>
          <div>
            <p className="text-sm text-slate-300">Company Name</p>
            <p className="font-semibold text-slate-100">{companyName || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-300">ABN</p>
            <p className="font-semibold text-slate-100">{abn || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-300">ACN</p>
            <p className="font-semibold text-slate-100">{acn || 'Not provided'}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-white/10 rounded-lg p-6">
        <h3 className="font-bold text-slate-100 mb-4">Risk Assessment</h3>
        <RiskMeter score={riskScore} size="lg" />
      </div>

      <div className="bg-white border-2 border-white/10 rounded-lg p-6">
        <h3 className="font-bold text-slate-100 mb-4">Declarations</h3>
        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" className="mt-1 w-5 h-5" required />
            <span className="text-sm text-slate-300">
              I declare that all information provided is true and accurate
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" className="mt-1 w-5 h-5" required />
            <span className="text-sm text-slate-300">
              I consent to AML/CTF verification checks and ongoing monitoring
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" className="mt-1 w-5 h-5" required />
            <span className="text-sm text-slate-300">
              I understand that providing false information may result in criminal penalties
            </span>
          </label>
        </div>
      </div>

      <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-lg p-6">
        <h3 className="font-bold text-blue-300 mb-2">What happens next?</h3>
        <ul className="space-y-2 text-sm text-blue-300">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5" />
            <span>Your application will be reviewed within 1-2 business days</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5" />
            <span>We'll contact you if additional information is required</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5" />
            <span>You'll receive an email once your account is activated</span>
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white/5">
      {/* Header */}
      <div className="bg-white border-b-2 border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-xl font-bold text-slate-100">Professional Services</h1>
                <p className="text-sm text-slate-300">Secure Onboarding Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Lock className="w-5 h-5 text-green-400" />
              <span className="text-sm font-semibold text-green-400">SECURE CONNECTION</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {currentStep !== 'welcome' && (
        <div className="bg-white border-b-2 border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <ProgressIndicator
              currentStep={getCurrentStepIndex()}
              totalSteps={9}
              stepLabels={stepLabels}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {currentStep === 'welcome' && renderWelcome()}
        {currentStep === 'entity-selection' && renderEntitySelection()}
        {currentStep === 'core-details' && renderCoreDetails()}
        {currentStep === 'ownership-builder' && renderOwnershipBuilder()}
        {currentStep === 'identity-upload' && renderIdentityUpload()}
        {currentStep === 'risk-questions' && renderRiskQuestions()}
        {currentStep === 'documents' && renderDocuments()}
        {currentStep === 'engagement-payment' && renderEngagementPayment()}
        {currentStep === 'review-submit' && renderReviewSubmit()}
      </div>

      {/* Navigation Footer */}
      {currentStep !== 'welcome' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-white/10 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <SecondaryButton onClick={handleBack}>
              Back
            </SecondaryButton>

            {currentStep === 'review-submit' ? (
              <PrimaryButton
                onClick={() => {
                  toast.success('Application submitted successfully!');
                  // Would navigate to confirmation screen
                }}
                className="px-12"
              >
                Submit Application
              </PrimaryButton>
            ) : (
              <PrimaryButton onClick={handleNext} className="px-12">
                Continue
                <ChevronRight className="w-5 h-5 ml-2 inline" />
              </PrimaryButton>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

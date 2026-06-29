import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Building2, User, Briefcase, TrendingUp, Shield, ArrowRight } from 'lucide-react';
import logo from '../../../assets/60b7d162929b5cb780f781445f70fa18c2c16326.png';

type UserRole = 'borrower' | 'lender' | 'investor' | 'admin' | null;

interface StepperProps {
  currentStep: number;
  steps: string[];
}

function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
              index < currentStep
                ? 'bg-green-600 text-white'
                : index === currentStep
                ? 'bg-indigo-600 text-white'
                : 'bg-white/10 text-slate-400'
            }`}>
              {index < currentStep ? '✓' : index + 1}
            </div>
            <span className="text-xs mt-2 text-slate-300">{step}</span>
          </div>
          {index < steps.length - 1 && (
            <div className={`w-16 h-1 mx-2 rounded transition-colors ${
              index < currentStep ? 'bg-green-600' : 'bg-white/10'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

interface OnboardingWizardProps {
  onNavigateToSignIn?: () => void;
}

export function OnboardingWizard({ onNavigateToSignIn }: OnboardingWizardProps = {}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [kycData, setKycData] = useState({
    fullName: '',
    organization: '',
    abn: '',
    phone: '',
    address: ''
  });

  const steps = ['Select Role', 'KYC Verification', 'Proof of Funds', 'Complete'];

  const roles = [
    {
      id: 'borrower' as const,
      name: 'Borrower',
      description: 'Seeking resolution for mortgage in possession',
      icon: User,
      color: 'blue'
    },
    {
      id: 'lender' as const,
      name: 'Lender',
      description: 'Financial institution managing defaulted loans',
      icon: Briefcase,
      color: 'purple'
    },
    {
      id: 'investor' as const,
      name: 'Investor',
      description: 'High net worth or institutional investor',
      icon: TrendingUp,
      color: 'green'
    }
  ];

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleKycChange = (field: string, value: string) => {
    setKycData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl border shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="Grow MIP" className="h-12" />
          </div>
          <CardTitle className="text-2xl">Welcome to Grow MIP</CardTitle>
          <p className="text-slate-300 text-sm mt-2">
            Complete your onboarding to access the platform
          </p>
        </CardHeader>
        <CardContent>
          <Stepper currentStep={currentStep} steps={steps} />

          {/* Step 1: Role Selection */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">Select Your Role</h3>
                <p className="text-sm text-slate-300">
                  Choose the role that best describes your participation
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => handleRoleSelect(role.id)}
                      className={`p-6 border-2 rounded-lg text-left transition-all hover:shadow-lg ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-500/10 shadow-md'
                          : 'border-white/10 hover:border-white/10'
                      }`}
                    >
                      <div className={`p-3 rounded-lg w-fit mb-3 ${
                        role.color === 'blue' ? 'bg-blue-500/15' :
                        role.color === 'purple' ? 'bg-purple-500/15' :
                        'bg-green-500/15'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          role.color === 'blue' ? 'text-blue-400' :
                          role.color === 'purple' ? 'text-purple-400' :
                          'text-green-400'
                        }`} />
                      </div>
                      <h4 className="font-semibold mb-1">{role.name}</h4>
                      <p className="text-sm text-slate-300">{role.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: KYC Verification */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">KYC Verification</h3>
                <p className="text-sm text-slate-300">
                  Provide your details for identity verification
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    value={kycData.fullName}
                    onChange={(e) => handleKycChange('fullName', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    placeholder="Company or institution name"
                    value={kycData.organization}
                    onChange={(e) => handleKycChange('organization', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="abn">ABN (Australian Business Number)</Label>
                  <Input
                    id="abn"
                    placeholder="XX XXX XXX XXX"
                    value={kycData.abn}
                    onChange={(e) => handleKycChange('abn', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+61 XXX XXX XXX"
                    value={kycData.phone}
                    onChange={(e) => handleKycChange('phone', e.target.value)}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Business Address *</Label>
                  <Input
                    id="address"
                    placeholder="Street, City, State, Postcode"
                    value={kycData.address}
                    onChange={(e) => handleKycChange('address', e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <div className="flex gap-3">
                  <Shield className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-300">Identity Verification Required</p>
                    <p className="text-xs text-amber-300 mt-1">
                      You will need to upload government-issued ID and proof of address in the next step.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Proof of Funds */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">Proof of Funds</h3>
                <p className="text-sm text-slate-300">
                  Upload documents to verify your financial capacity
                </p>
              </div>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer">
                  <div className="flex flex-col items-center">
                    <div className="p-4 bg-indigo-500/10 rounded-full mb-3">
                      <Building2 className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h4 className="font-medium mb-1">Upload Bank Statements</h4>
                    <p className="text-sm text-slate-300 mb-4">
                      Last 3 months of statements (PDF, max 10MB)
                    </p>
                    <Button variant="outline">Choose Files</Button>
                  </div>
                </div>

                <div className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer">
                  <div className="flex flex-col items-center">
                    <div className="p-4 bg-green-500/10 rounded-full mb-3">
                      <Shield className="w-8 h-8 text-green-400" />
                    </div>
                    <h4 className="font-medium mb-1">Upload ID Documents</h4>
                    <p className="text-sm text-slate-300 mb-4">
                      Passport or Driver's License (PDF, JPG, PNG)
                    </p>
                    <Button variant="outline">Choose Files</Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Completion */}
          {currentStep === 3 && (
            <div className="space-y-6 text-center py-8">
              <div className="flex justify-center">
                <div className="p-4 bg-green-500/15 rounded-full">
                  <Shield className="w-12 h-12 text-green-400" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">Onboarding Complete!</h3>
                <p className="text-slate-300">
                  Your application is under review. We'll notify you once approved.
                </p>
              </div>
              <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-6 text-left max-w-md mx-auto">
                <h4 className="font-semibold mb-3">What happens next?</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex gap-2">
                    <span className="text-indigo-400">1.</span>
                    <span>Our compliance team reviews your documents (24-48 hours)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-indigo-400">2.</span>
                    <span>You'll receive an email notification upon approval</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-indigo-400">3.</span>
                    <span>Access full platform features once verified</span>
                  </li>
                </ul>
              </div>
              <Button size="lg" className="mt-6" onClick={onNavigateToSignIn}>
                Return to Sign In
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {/* Navigation Buttons */}
          {currentStep < 3 && (
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={currentStep === 0 && !selectedRole}
              >
                {currentStep === 2 ? 'Submit' : 'Continue'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

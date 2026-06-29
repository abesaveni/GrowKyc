import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Save,
  Send,
  Plus,
  Building2,
  Users,
  FileText,
  DollarSign,
  Home,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';

interface NewApplicationProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

export function NewApplication({ onNavigate, onBack }: NewApplicationProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loanType, setLoanType] = useState('');
  const [borrowerType, setBorrowerType] = useState('company');
  const [showDirectorModal, setShowDirectorModal] = useState(false);
  const [showBorrowerModal, setShowBorrowerModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [directors, setDirectors] = useState<any[]>([]);
  const [borrowers, setBorrowers] = useState<any[]>([]);
  const [securities, setSecurities] = useState<any[]>([]);
  const [selectedSecurityType, setSelectedSecurityType] = useState('property');

  const loanTypes = [
    { id: 'commercial_mortgage', name: 'Commercial Mortgage', desc: 'Property-secured business lending' },
    { id: 'private_lending', name: 'Private Lending', desc: 'Fast approval alternative funding' },
    { id: 'sme_term_loan', name: 'SME Term Loan', desc: 'Unsecured or asset-backed business loan' },
    { id: 'asset_finance', name: 'Asset Finance', desc: 'Vehicle, plant, equipment finance' }
  ];

  const steps = [
    { number: 1, name: 'Loan Type', icon: FileText },
    { number: 2, name: 'Borrower Details', icon: Users },
    { number: 3, name: 'Loan Structure', icon: DollarSign },
    { number: 4, name: 'Security', icon: Home },
    { number: 5, name: 'Review & Submit', icon: CheckCircle }
  ];

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 mb-2">Select Loan Type</h2>
        <p className="text-sm text-slate-300">Choose the product that best suits your client's needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loanTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setLoanType(type.id)}
            className={`p-6 border-2 rounded-lg text-left transition-all ${
              loanType === type.id
                ? 'border-blue-600 bg-blue-500/10'
                : 'border-white/10 hover:border-blue-400 bg-white'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-slate-100">{type.name}</h3>
              {loanType === type.id && (
                <CheckCircle className="w-5 h-5 text-blue-400" />
              )}
            </div>
            <p className="text-sm text-slate-300">{type.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 mb-2">Borrower Details</h2>
        <p className="text-sm text-slate-300">Add borrower entities (companies, trusts, individuals)</p>
      </div>

      {/* Borrower Type Selection */}
      <div className="bg-blue-500/10 border border-blue-300 rounded p-4">
        <label className="block text-sm font-semibold text-slate-100 mb-2">Primary Borrower Type</label>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setBorrowerType('company')}
            className={`px-4 py-2 border rounded text-sm font-medium transition-all ${
              borrowerType === 'company'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-300 border-white/10 hover:border-blue-400'
            }`}
          >
            Company
          </button>
          <button
            onClick={() => setBorrowerType('trust')}
            className={`px-4 py-2 border rounded text-sm font-medium transition-all ${
              borrowerType === 'trust'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-300 border-white/10 hover:border-blue-400'
            }`}
          >
            Trust
          </button>
          <button
            onClick={() => setBorrowerType('individual')}
            className={`px-4 py-2 border rounded text-sm font-medium transition-all ${
              borrowerType === 'individual'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-300 border-white/10 hover:border-blue-400'
            }`}
          >
            Individual
          </button>
        </div>
      </div>

      {/* Company Form */}
      {borrowerType === 'company' && (
        <div className="bg-white border border-white/10 rounded p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-100 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-400" />
              Primary Borrower - Company
            </h3>
            <Button variant="outline" size="sm">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Company Name</label>
              <input
                type="text"
                placeholder="ABC Enterprises Pty Ltd"
                className="w-full px-3 py-2 border border-white/10 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">ACN</label>
              <input
                type="text"
                placeholder="123 456 789"
                className="w-full px-3 py-2 border border-white/10 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">ABN</label>
              <input
                type="text"
                placeholder="12 345 678 901"
                className="w-full px-3 py-2 border border-white/10 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Entity Type</label>
              <select className="w-full px-3 py-2 border border-white/10 rounded text-sm">
                <option>Proprietary Limited</option>
                <option>Public Company</option>
                <option>Unlimited</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Registered Address</label>
            <input
              type="text"
              placeholder="123 Business St, Sydney NSW 2000"
              className="w-full px-3 py-2 border border-white/10 rounded text-sm"
            />
          </div>

          {/* Directors */}
          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-slate-100">Directors / Guarantors</label>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowDirectorModal(true)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Director
              </Button>
            </div>
            <div className="bg-white/5 border border-white/10 rounded p-3 text-sm text-slate-300">
              No directors added yet. Add directors who will act as guarantors.
            </div>
          </div>
        </div>
      )}

      {/* Add Additional Borrower */}
      <div className="flex justify-center">
        <Button 
          variant="outline"
          onClick={() => setShowBorrowerModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Additional Borrower Entity
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 mb-2">Loan Structure</h2>
        <p className="text-sm text-slate-300">Define loan amount, term, and repayment structure</p>
      </div>

      <div className="bg-white border border-white/10 rounded p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Loan Amount Required</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">$</span>
              <input
                type="text"
                placeholder="850,000"
                className="w-full pl-7 pr-3 py-2 border border-white/10 rounded text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Loan Term (months)</label>
            <input
              type="number"
              placeholder="36"
              className="w-full px-3 py-2 border border-white/10 rounded text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Repayment Type</label>
            <select className="w-full px-3 py-2 border border-white/10 rounded text-sm">
              <option>Principal & Interest</option>
              <option>Interest Only</option>
              <option>Bullet Payment</option>
              <option>Capitalised Interest</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Repayment Frequency</label>
            <select className="w-full px-3 py-2 border border-white/10 rounded text-sm">
              <option>Monthly</option>
              <option>Quarterly</option>
              <option>Annual</option>
              <option>At Maturity</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Purpose of Loan</label>
          <select className="w-full px-3 py-2 border border-white/10 rounded text-sm">
            <option>Business Expansion</option>
            <option>Property Purchase</option>
            <option>Refinance</option>
            <option>Working Capital</option>
            <option>Asset Purchase</option>
            <option>Debt Consolidation</option>
          </select>
        </div>

        {/* Serviceability Indicator */}
        <div className="bg-green-500/10 border border-green-300 rounded p-4 mt-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="font-semibold text-green-300">Estimated Serviceability</span>
          </div>
          <div className="text-sm text-green-300">
            <div className="grid grid-cols-3 gap-4 mt-2">
              <div>
                <div className="text-xs text-green-300">Est. Monthly Repayment</div>
                <div className="font-semibold">$28,450</div>
              </div>
              <div>
                <div className="text-xs text-green-300">DSCR Required</div>
                <div className="font-semibold">1.25x</div>
              </div>
              <div>
                <div className="text-xs text-green-300">Min Annual EBITDA</div>
                <div className="font-semibold">$427,000</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 mb-2">Security</h2>
        <p className="text-sm text-slate-300">Add property, assets, or personal guarantees</p>
      </div>

      {/* Security Type Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button 
          onClick={() => setShowSecurityModal(true)}
          className="p-4 border-2 border-white/10 rounded hover:border-blue-400 bg-white transition-all"
        >
          <Home className="w-6 h-6 text-blue-400 mb-2" />
          <div className="text-sm font-semibold text-slate-100">Property</div>
        </button>
        <button 
          onClick={() => setShowSecurityModal(true)}
          className="p-4 border-2 border-white/10 rounded hover:border-blue-400 bg-white transition-all"
        >
          <Building2 className="w-6 h-6 text-purple-400 mb-2" />
          <div className="text-sm font-semibold text-slate-100">Commercial</div>
        </button>
        <button 
          onClick={() => setShowSecurityModal(true)}
          className="p-4 border-2 border-white/10 rounded hover:border-blue-400 bg-white transition-all"
        >
          <DollarSign className="w-6 h-6 text-green-400 mb-2" />
          <div className="text-sm font-semibold text-slate-100">PPSR</div>
        </button>
        <button 
          onClick={() => setShowSecurityModal(true)}
          className="p-4 border-2 border-white/10 rounded hover:border-blue-400 bg-white transition-all"
        >
          <Users className="w-6 h-6 text-indigo-400 mb-2" />
          <div className="text-sm font-semibold text-slate-100">Guarantee</div>
        </button>
      </div>

      {/* Property Security Form */}
      <div className="bg-white border border-white/10 rounded p-6 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-100 flex items-center gap-2">
            <Home className="w-5 h-5 text-blue-400" />
            Security Property #1
          </h3>
          <Button variant="outline" size="sm">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Property Address</label>
          <input
            type="text"
            placeholder="456 Commercial Rd, Melbourne VIC 3000"
            className="w-full px-3 py-2 border border-white/10 rounded text-sm"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Property Type</label>
            <select className="w-full px-3 py-2 border border-white/10 rounded text-sm">
              <option>Office</option>
              <option>Retail</option>
              <option>Industrial</option>
              <option>Residential</option>
              <option>Land</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Estimated Value</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">$</span>
              <input
                type="text"
                placeholder="1,200,000"
                className="w-full pl-7 pr-3 py-2 border border-white/10 rounded text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Valuation Status</label>
            <select className="w-full px-3 py-2 border border-white/10 rounded text-sm">
              <option>Desktop Required</option>
              <option>Full Required</option>
              <option>Completed</option>
            </select>
          </div>
        </div>

        {/* LVR Calculation */}
        <div className="bg-blue-500/10 border border-blue-300 rounded p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-300">Loan to Value Ratio (LVR)</span>
            <span className="text-lg font-bold text-blue-300">70.8%</span>
          </div>
          <div className="text-xs text-blue-300 mt-1">
            $850,000 loan / $1,200,000 value
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button 
          variant="outline"
          onClick={() => setShowSecurityModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Additional Security
        </Button>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 mb-2">Review & Submit</h2>
        <p className="text-sm text-slate-300">Review application details before submission</p>
      </div>

      {/* Application Summary */}
      <div className="bg-white border border-white/10 rounded divide-y divide-white/10">
        <div className="p-4">
          <h3 className="font-semibold text-slate-100 mb-3">Application Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-300">Loan Type:</span>
              <span className="ml-2 font-semibold text-slate-100">SME Term Loan</span>
            </div>
            <div>
              <span className="text-slate-300">Loan Amount:</span>
              <span className="ml-2 font-semibold text-slate-100">$850,000</span>
            </div>
            <div>
              <span className="text-slate-300">Term:</span>
              <span className="ml-2 font-semibold text-slate-100">36 months</span>
            </div>
            <div>
              <span className="text-slate-300">LVR:</span>
              <span className="ml-2 font-semibold text-green-300">70.8%</span>
            </div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-slate-100 mb-3">Borrower</h3>
          <div className="text-sm text-slate-300">
            ABC Enterprises Pty Ltd (ACN 123 456 789)
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-slate-100 mb-3">Security</h3>
          <div className="text-sm text-slate-300">
            1st Mortgage - 456 Commercial Rd, Melbourne VIC 3000 ($1,200,000)
          </div>
        </div>
      </div>

      {/* Pre-submission Checklist */}
      <div className="bg-amber-500/10 border border-amber-300 rounded p-4">
        <h3 className="font-semibold text-amber-300 mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Required Documents (Upload after submission)
        </h3>
        <ul className="space-y-2 text-sm text-amber-300">
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Financial statements (last 2 years)</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Company extract (ASIC)</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Director ID verification</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Property contract / valuation</span>
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white/5">
      {/* Header */}
      <div className="bg-white border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <div>
              <h1 className="text-xl font-bold text-slate-100">New Loan Application</h1>
              <p className="text-xs text-slate-300">Complete all steps to submit application for credit assessment</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => alert('Application draft saved!')}>
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            {currentStep === 5 && (
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  alert('Application submitted successfully!');
                  onNavigate?.('broker-dashboard');
                }}
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Application
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Progress Steps */}
        <div className="bg-white border border-white/10 rounded p-6 mb-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      currentStep >= step.number
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className="hidden md:block">
                    <div
                      className={`text-sm font-medium ${
                        currentStep >= step.number ? 'text-slate-100' : 'text-slate-400'
                      }`}
                    >
                      {step.name}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-1 mx-4 bg-white/10 rounded">
                    <div
                      className={`h-full rounded transition-all ${
                        currentStep > step.number ? 'bg-blue-600' : 'bg-white/10'
                      }`}
                      style={{ width: currentStep > step.number ? '100%' : '0%' }}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white border border-white/10 rounded p-6 mb-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          <Button
            onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
            disabled={currentStep === 5 || (currentStep === 1 && !loanType)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {currentStep === 5 ? 'Review Complete' : 'Continue'}
          </Button>
        </div>
      </div>

      {/* Director Modal */}
      {showDirectorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-100">Add Director / Guarantor</h2>
              <button onClick={() => setShowDirectorModal(false)}>
                <X className="w-6 h-6 text-slate-300 hover:text-slate-100" />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              setDirectors([...directors, {
                id: Date.now(),
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                role: formData.get('role')
              }]);
              setShowDirectorModal(false);
            }}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      className="w-full px-3 py-2 border border-white/10 rounded text-sm"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      className="w-full px-3 py-2 border border-white/10 rounded text-sm"
                      placeholder="Smith"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-3 py-2 border border-white/10 rounded text-sm"
                      placeholder="john.smith@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      className="w-full px-3 py-2 border border-white/10 rounded text-sm"
                      placeholder="0412 345 678"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
                  <select name="role" required className="w-full px-3 py-2 border border-white/10 rounded text-sm">
                    <option value="director">Director</option>
                    <option value="guarantor">Guarantor</option>
                    <option value="both">Director & Guarantor</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Add Director
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowDirectorModal(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Borrower Modal */}
      {showBorrowerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-100">Add Additional Borrower</h2>
              <button onClick={() => setShowBorrowerModal(false)}>
                <X className="w-6 h-6 text-slate-300 hover:text-slate-100" />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              setBorrowers([...borrowers, {
                id: Date.now(),
                type: formData.get('type'),
                name: formData.get('name'),
                acn: formData.get('acn'),
                abn: formData.get('abn')
              }]);
              setShowBorrowerModal(false);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Entity Type</label>
                  <select name="type" required className="w-full px-3 py-2 border border-white/10 rounded text-sm">
                    <option value="company">Company</option>
                    <option value="trust">Trust</option>
                    <option value="individual">Individual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Entity Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-3 py-2 border border-white/10 rounded text-sm"
                    placeholder="XYZ Holdings Pty Ltd"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">ACN</label>
                    <input
                      type="text"
                      name="acn"
                      className="w-full px-3 py-2 border border-white/10 rounded text-sm"
                      placeholder="123 456 789"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">ABN</label>
                    <input
                      type="text"
                      name="abn"
                      className="w-full px-3 py-2 border border-white/10 rounded text-sm"
                      placeholder="12 345 678 901"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Add Borrower
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowBorrowerModal(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Security Modal */}
      {showSecurityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-100">Add Security</h2>
              <button onClick={() => setShowSecurityModal(false)}>
                <X className="w-6 h-6 text-slate-300 hover:text-slate-100" />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              setSecurities([...securities, {
                id: Date.now(),
                type: formData.get('type'),
                ppsrType: formData.get('ppsrType'),
                address: formData.get('address'),
                value: formData.get('value'),
                propertyType: formData.get('propertyType'),
                assetDescription: formData.get('assetDescription'),
                serialNumber: formData.get('serialNumber')
              }]);
              setShowSecurityModal(false);
              setSelectedSecurityType('property');
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Security Type</label>
                  <select 
                    name="type" 
                    required 
                    className="w-full px-3 py-2 border border-white/10 rounded text-sm"
                    value={selectedSecurityType}
                    onChange={(e) => setSelectedSecurityType(e.target.value)}
                  >
                    <option value="property">Residential Property</option>
                    <option value="commercial">Commercial Property</option>
                    <option value="ppsr">PPSR Security</option>
                    <option value="guarantee">Personal Guarantee</option>
                  </select>
                </div>

                {/* PPSR Type - Only show when PPSR is selected */}
                {selectedSecurityType === 'ppsr' && (
                  <div className="bg-blue-500/10 border border-blue-300 rounded p-4">
                    <label className="block text-sm font-medium text-slate-100 mb-2">PPSR Security Type</label>
                    <select name="ppsrType" required className="w-full px-3 py-2 border border-white/10 rounded text-sm bg-white">
                      <option value="">Select PPSR Type</option>
                      <option value="pmsi">PMSI (Purchase Money Security Interest)</option>
                      <option value="gsa">GSA (General Security Agreement)</option>
                      <option value="specific">Specific Security Interest</option>
                      <option value="commercial_consignment">Commercial Consignment</option>
                      <option value="pps_lease">PPS Lease (over 1 year)</option>
                      <option value="retention_of_title">Retention of Title (ROT)</option>
                      <option value="subordination">Subordination Agreement</option>
                    </select>
                    <p className="text-xs text-blue-300 mt-2">
                      {selectedSecurityType === 'ppsr' && 'PPSR registration secures interest in personal property including equipment, vehicles, inventory, and accounts receivable'}
                    </p>
                  </div>
                )}

                {/* Property/Commercial Address */}
                {(selectedSecurityType === 'property' || selectedSecurityType === 'commercial') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Property Address</label>
                      <input
                        type="text"
                        name="address"
                        required
                        className="w-full px-3 py-2 border border-white/10 rounded text-sm"
                        placeholder="123 Example St, Sydney NSW 2000"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Property Type</label>
                        <select name="propertyType" required className="w-full px-3 py-2 border border-white/10 rounded text-sm">
                          {selectedSecurityType === 'commercial' ? (
                            <>
                              <option value="office">Office</option>
                              <option value="retail">Retail</option>
                              <option value="industrial">Industrial</option>
                              <option value="warehouse">Warehouse</option>
                              <option value="land">Commercial Land</option>
                            </>
                          ) : (
                            <>
                              <option value="house">House</option>
                              <option value="apartment">Apartment</option>
                              <option value="townhouse">Townhouse</option>
                              <option value="land">Residential Land</option>
                            </>
                          )}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Estimated Value</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">$</span>
                          <input
                            type="text"
                            name="value"
                            required
                            className="w-full pl-7 pr-3 py-2 border border-white/10 rounded text-sm"
                            placeholder="1,500,000"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* PPSR Asset Description */}
                {selectedSecurityType === 'ppsr' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Asset Description</label>
                      <textarea
                        name="assetDescription"
                        required
                        rows={3}
                        className="w-full px-3 py-2 border border-white/10 rounded text-sm"
                        placeholder="Detailed description of secured assets (e.g., 2023 Toyota Hilux, VIN: ABC123..., Plant & Equipment inventory, Accounts Receivable)"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Serial/VIN Number (if applicable)</label>
                        <input
                          type="text"
                          name="serialNumber"
                          className="w-full px-3 py-2 border border-white/10 rounded text-sm"
                          placeholder="ABC123XYZ456"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Estimated Value</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">$</span>
                          <input
                            type="text"
                            name="value"
                            required
                            className="w-full pl-7 pr-3 py-2 border border-white/10 rounded text-sm"
                            placeholder="250,000"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Guarantee Fields */}
                {selectedSecurityType === 'guarantee' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Guarantor Name</label>
                      <input
                        type="text"
                        name="address"
                        required
                        className="w-full px-3 py-2 border border-white/10 rounded text-sm"
                        placeholder="John Smith"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Guarantee Type</label>
                        <select name="propertyType" required className="w-full px-3 py-2 border border-white/10 rounded text-sm">
                          <option value="unlimited">Unlimited Guarantee</option>
                          <option value="limited">Limited Guarantee</option>
                          <option value="continuing">Continuing Guarantee</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Guarantee Amount (if limited)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">$</span>
                          <input
                            type="text"
                            name="value"
                            className="w-full pl-7 pr-3 py-2 border border-white/10 rounded text-sm"
                            placeholder="Optional"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="flex items-center gap-3 mt-6">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Add Security
                </Button>
                <Button type="button" variant="outline" onClick={() => {
                  setShowSecurityModal(false);
                  setSelectedSecurityType('property');
                }}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
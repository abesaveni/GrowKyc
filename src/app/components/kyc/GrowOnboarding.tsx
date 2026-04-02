import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  UserPlus,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Upload,
  FileText,
  Search,
  Eye,
  Edit,
  Mail,
  Phone,
  Building,
  Users,
  TrendingUp,
  Calendar,
  Send,
  Activity,
  Download,
  Plus,
  ChevronRight,
  Check,
  X
} from 'lucide-react';

type OnboardingStep = 
  | 'client-type'
  | 'contact-info'
  | 'entity-details'
  | 'beneficial-ownership'
  | 'identity-verification'
  | 'screening'
  | 'risk-assessment'
  | 'source-of-funds'
  | 'documents'
  | 'declarations'
  | 'review'
  | 'complete';

type ClientType = 'individual' | 'company' | 'trust' | 'partnership' | 'smsf';
type IndustryType = 'accounting' | 'lending' | 'fund-management';

export function GrowOnboarding() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('client-type');
  const [clientType, setClientType] = useState<ClientType>('individual');
  const [industryType, setIndustryType] = useState<IndustryType>('accounting');
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    // Contact Info
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    address: '',
    suburb: '',
    state: '',
    postcode: '',
    country: 'Australia',
    
    // Entity Details
    entityName: '',
    abn: '',
    acn: '',
    registeredAddress: '',
    entityType: '',
    
    // Beneficial Ownership
    beneficialOwners: [] as Array<{name: string, ownership: string, verified: boolean}>,
    
    // Identity Verification
    idType: '',
    idNumber: '',
    idExpiry: '',
    verificationMethod: 'greenid',
    
    // Risk Assessment
    riskRating: 'low' as 'low' | 'medium' | 'high',
    riskFactors: [] as string[],
    
    // Source of Funds (for lenders/fund managers)
    sourceOfFunds: '',
    sourceOfWealth: '',
    employmentDetails: '',
    
    // Documents
    documents: [] as Array<{name: string, type: string, status: string}>,
    
    // Declarations
    pepDeclaration: false,
    termsAccepted: false,
    accuracyConfirmed: false
  });

  const steps: Array<{id: OnboardingStep, label: string, required: boolean, industry?: IndustryType[]}> = [
    { id: 'client-type', label: 'Client Type', required: true },
    { id: 'contact-info', label: 'Contact Information', required: true },
    { id: 'entity-details', label: 'Entity Details', required: true },
    { id: 'beneficial-ownership', label: 'Beneficial Ownership', required: true },
    { id: 'identity-verification', label: 'Identity Verification', required: true },
    { id: 'screening', label: 'Screening & Checks', required: true },
    { id: 'risk-assessment', label: 'Risk Assessment', required: true },
    { id: 'source-of-funds', label: 'Source of Funds', required: true, industry: ['lending', 'fund-management'] },
    { id: 'documents', label: 'Supporting Documents', required: true },
    { id: 'declarations', label: 'Declarations', required: true },
    { id: 'review', label: 'Review & Submit', required: true },
    { id: 'complete', label: 'Complete', required: false }
  ];

  const getStepIndex = () => steps.findIndex(s => s.id === currentStep);
  const getProgressPercentage = () => Math.round((getStepIndex() / (steps.length - 1)) * 100);

  const renderClientTypeStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Select Client Type</h2>
        <p className="text-gray-600">Choose the entity type for this onboarding</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { id: 'individual', label: 'Individual', icon: Users, description: 'Personal client or sole trader' },
          { id: 'company', label: 'Company', icon: Building, description: 'Pty Ltd, Public Company, or Corporation' },
          { id: 'trust', label: 'Trust', icon: Shield, description: 'Family Trust, Unit Trust, or Discretionary Trust' },
          { id: 'partnership', label: 'Partnership', icon: Users, description: 'General or Limited Partnership' },
          { id: 'smsf', label: 'SMSF', icon: TrendingUp, description: 'Self-Managed Superannuation Fund' }
        ].map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => setClientType(type.id as ClientType)}
              className={`p-6 rounded-lg border-2 transition-all ${
                clientType === type.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <Icon className={`w-12 h-12 mx-auto mb-3 ${
                clientType === type.id ? 'text-blue-600' : 'text-gray-400'
              }`} />
              <h3 className="font-bold text-gray-900 mb-1">{type.label}</h3>
              <p className="text-sm text-gray-600">{type.description}</p>
              {clientType === type.id && (
                <div className="mt-3">
                  <CheckCircle className="w-6 h-6 text-blue-600 mx-auto" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
        <h3 className="font-bold text-blue-900 mb-3">Industry Type</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'accounting', label: 'Accounting Practice', desc: 'Standard CDD requirements' },
            { id: 'lending', label: 'Lender', desc: 'Enhanced source of funds checks' },
            { id: 'fund-management', label: 'Fund Manager', desc: 'Investor + borrower checks' }
          ].map((industry) => (
            <button
              key={industry.id}
              onClick={() => setIndustryType(industry.id as IndustryType)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                industryType === industry.id
                  ? 'border-blue-500 bg-white'
                  : 'border-blue-200 hover:border-blue-400'
              }`}
            >
              <h4 className="font-bold text-blue-900 text-sm mb-1">{industry.label}</h4>
              <p className="text-xs text-blue-700">{industry.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContactInfoStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Contact Information</h2>
        <p className="text-gray-600">Full name, date of birth, and residential address</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Full Legal Name *</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              placeholder="As per passport or driver license"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Date of Birth *</label>
            <input
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData({...formData, dob: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="your.email@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Phone Number *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="0400 000 000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Residential Address *</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            placeholder="Street address"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Suburb/City *</label>
            <input
              type="text"
              value={formData.suburb}
              onChange={(e) => setFormData({...formData, suburb: e.target.value})}
              placeholder="Melbourne"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">State *</label>
            <select
              value={formData.state}
              onChange={(e) => setFormData({...formData, state: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select</option>
              <option value="VIC">VIC</option>
              <option value="NSW">NSW</option>
              <option value="QLD">QLD</option>
              <option value="SA">SA</option>
              <option value="WA">WA</option>
              <option value="TAS">TAS</option>
              <option value="NT">NT</option>
              <option value="ACT">ACT</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Postcode *</label>
            <input
              type="text"
              value={formData.postcode}
              onChange={(e) => setFormData({...formData, postcode: e.target.value})}
              placeholder="3000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-bold text-yellow-900 text-sm">AUSTRAC Requirement</h4>
            <p className="text-sm text-yellow-800">All fields must be verified from reliable, independent sources (e.g., government ID, utility bills)</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEntityDetailsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Entity Details</h2>
        <p className="text-gray-600">
          {clientType === 'company' && 'Company registration and director information'}
          {clientType === 'trust' && 'Trust details and trustee information'}
          {clientType === 'partnership' && 'Partnership details and partner information'}
          {clientType === 'smsf' && 'SMSF registration and trustee details'}
          {clientType === 'individual' && 'Employment and occupation information'}
        </p>
      </div>

      {clientType === 'company' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Company Name *</label>
            <input
              type="text"
              value={formData.entityName}
              onChange={(e) => setFormData({...formData, entityName: e.target.value})}
              placeholder="Company Pty Ltd"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">ABN *</label>
              <input
                type="text"
                value={formData.abn}
                onChange={(e) => setFormData({...formData, abn: e.target.value})}
                placeholder="12 345 678 901"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">ACN *</label>
              <input
                type="text"
                value={formData.acn}
                onChange={(e) => setFormData({...formData, acn: e.target.value})}
                placeholder="123 456 789"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Registered Office Address *</label>
            <input
              type="text"
              value={formData.registeredAddress}
              onChange={(e) => setFormData({...formData, registeredAddress: e.target.value})}
              placeholder="As per ASIC"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Button variant="outline" className="w-full">
            <Search className="w-4 h-4 mr-2" />
            Verify via ASIC Lookup
          </Button>
        </div>
      )}

      {clientType === 'individual' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Occupation *</label>
            <input
              type="text"
              value={formData.entityType}
              onChange={(e) => setFormData({...formData, entityType: e.target.value})}
              placeholder="e.g., Software Engineer, Accountant"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Employment Details</label>
            <textarea
              value={formData.employmentDetails}
              onChange={(e) => setFormData({...formData, employmentDetails: e.target.value})}
              placeholder="Employer name, position, years employed"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-bold text-blue-900 text-sm mb-2">Required Documents</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          {clientType === 'company' && (
            <>
              <li>• ASIC Company Extract (current)</li>
              <li>• Certificate of Registration</li>
              <li>• Director identification documents</li>
            </>
          )}
          {clientType === 'individual' && (
            <>
              <li>• Employment letter or payslips</li>
              <li>• Tax returns (if self-employed)</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );

  const renderBeneficialOwnershipStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Beneficial Ownership</h2>
        <p className="text-gray-600">Identify all individuals with 25%+ ownership or control</p>
      </div>

      {clientType === 'individual' ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-green-900 mb-2">No Additional UBO Required</h3>
          <p className="text-green-800">
            For individual clients, the beneficial owner is the individual themselves
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Ultimate Beneficial Owners (UBO)</h3>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add UBO
              </Button>
            </div>

            {formData.beneficialOwners.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No beneficial owners added yet</p>
                <p className="text-sm mt-1">Click "Add UBO" to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {formData.beneficialOwners.map((owner, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{owner.name}</h4>
                      <p className="text-sm text-gray-600">Ownership: {owner.ownership}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {owner.verified ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                          VERIFIED
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">
                          PENDING
                        </span>
                      )}
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-bold text-red-900 text-sm">AUSTRAC Requirement</h4>
                <p className="text-sm text-red-800 mt-1">
                  You MUST identify and verify all individuals who:
                </p>
                <ul className="text-sm text-red-800 mt-2 space-y-1">
                  <li>• Own 25% or more of the entity</li>
                  <li>• Exercise control over the entity</li>
                  <li>• If no one meets 25%, identify senior managing official</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderIdentityVerificationStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Identity Verification</h2>
        <p className="text-gray-600">Electronic verification via GreenID / InfoTrack</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Verification Method</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setFormData({...formData, verificationMethod: 'greenid'})}
              className={`p-4 rounded-lg border-2 transition-all ${
                formData.verificationMethod === 'greenid'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <h4 className="font-bold text-gray-900">GreenID (Recommended)</h4>
              <p className="text-sm text-gray-600 mt-1">Electronic verification with biometrics</p>
            </button>
            <button
              onClick={() => setFormData({...formData, verificationMethod: 'manual'})}
              className={`p-4 rounded-lg border-2 transition-all ${
                formData.verificationMethod === 'manual'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <h4 className="font-bold text-gray-900">Manual Upload</h4>
              <p className="text-sm text-gray-600 mt-1">Upload certified copies</p>
            </button>
          </div>
        </div>

        {formData.verificationMethod === 'greenid' && (
          <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-8 text-white text-center">
            <Shield className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Electronic Verification</h3>
            <p className="text-green-100 mb-6">
              Verify identity in real-time using government databases and biometric checks
            </p>
            <Button className="bg-white text-green-600 hover:bg-green-50">
              <CheckCircle className="w-5 h-5 mr-2" />
              Start GreenID Verification
            </Button>
            <p className="text-sm text-green-100 mt-4">
              Requires: Australian Passport OR Driver License + Medicare
            </p>
          </div>
        )}

        {formData.verificationMethod === 'manual' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Primary ID Document *</label>
              <select
                value={formData.idType}
                onChange={(e) => setFormData({...formData, idType: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select document type</option>
                <option value="passport">Australian Passport</option>
                <option value="license">Driver License</option>
                <option value="birth-cert">Birth Certificate</option>
                <option value="citizenship">Citizenship Certificate</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Document Number *</label>
                <input
                  type="text"
                  value={formData.idNumber}
                  onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
                  placeholder="Enter document number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Expiry Date</label>
                <input
                  type="date"
                  value={formData.idExpiry}
                  onChange={(e) => setFormData({...formData, idExpiry: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <Button variant="outline" className="w-full">
              <Upload className="w-4 h-4 mr-2" />
              Upload Document Scan
            </Button>
          </div>
        )}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-bold text-yellow-900 text-sm mb-2">Verification Requirements</h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Must use reliable, independent source</li>
          <li>• Electronic verification (EIV) preferred</li>
          <li>• Manual documents must be certified copies</li>
          <li>• Biometric verification recommended</li>
        </ul>
      </div>
    </div>
  );

  const renderScreeningStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Screening & Checks</h2>
        <p className="text-gray-600">Mandatory sanctions, PEP, and adverse media screening</p>
      </div>

      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Shield className="w-16 h-16" />
            <div>
              <h3 className="text-2xl font-bold">Automated Screening</h3>
              <p className="text-purple-100">Running comprehensive compliance checks</p>
            </div>
          </div>
          <Activity className="w-12 h-12 animate-pulse" />
        </div>

        <div className="space-y-3">
          {[
            { name: 'DFAT Sanctions List', status: 'complete', result: 'No matches' },
            { name: 'PEP Database Screening', status: 'complete', result: 'Not a PEP' },
            { name: 'Adverse Media Scan', status: 'complete', result: 'No adverse findings' },
            { name: 'Watchlist Screening', status: 'complete', result: 'Clear' }
          ].map((check, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-300" />
                <div>
                  <h4 className="font-bold text-white">{check.name}</h4>
                  <p className="text-sm text-purple-100">{check.result}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                PASSED
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <CheckCircle className="w-8 h-8 text-green-600 mt-1" />
          <div>
            <h3 className="text-lg font-bold text-green-900 mb-2">All Screening Checks Passed</h3>
            <p className="text-green-800 mb-3">
              No sanctions matches, PEP exposure, or adverse media findings detected
            </p>
            <Button size="sm" variant="outline" className="border-green-600 text-green-600">
              <Download className="w-4 h-4 mr-2" />
              Download Screening Report
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-bold text-blue-900 text-sm mb-2">Ongoing Monitoring</h4>
        <p className="text-sm text-blue-800">
          This client will be automatically re-screened quarterly for sanctions, PEP, and adverse media updates
        </p>
      </div>
    </div>
  );

  const renderRiskAssessmentStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">ML/TF Risk Assessment</h2>
        <p className="text-gray-600">Assess money laundering and terrorism financing risk</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        <div>
          <h3 className="font-bold text-gray-900 mb-4">Risk Factors</h3>
          <div className="space-y-3">
            {[
              { factor: 'Client Type', assessment: clientType, risk: 'Low' },
              { factor: 'Geographic Location', assessment: 'Australia (Domestic)', risk: 'Low' },
              { factor: 'Service Type', assessment: industryType === 'accounting' ? 'Standard accounting services' : 'Financial services', risk: 'Low' },
              { factor: 'Delivery Channel', assessment: 'Face-to-face onboarding', risk: 'Low' },
              { factor: 'Ownership Structure', assessment: clientType === 'individual' ? 'Simple - Individual' : 'Standard structure', risk: 'Low' },
              { factor: 'PEP Status', assessment: 'Not a PEP', risk: 'Low' },
              { factor: 'Sanctions Exposure', assessment: 'No matches', risk: 'Low' },
              { factor: 'Transaction Profile', assessment: 'Expected to be routine', risk: 'Low' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{item.factor}</p>
                  <p className="text-sm text-gray-600">{item.assessment}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                  item.risk === 'Low' ? 'bg-green-100 text-green-700' :
                  item.risk === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {item.risk.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-green-900 mb-1">Overall Risk Rating</h3>
              <p className="text-green-800">Standard CDD procedures apply</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-green-600 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">LOW</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-bold text-yellow-900 text-sm mb-2">Enhanced CDD Not Required</h4>
        <p className="text-sm text-yellow-800">
          Client assessed as LOW risk. Standard Customer Due Diligence procedures are sufficient.
        </p>
      </div>
    </div>
  );

  const renderSourceOfFundsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Source of Funds & Wealth</h2>
        <p className="text-gray-600">
          {industryType === 'lending' && 'Required for lenders - Verify deposit, equity, and repayment sources'}
          {industryType === 'fund-management' && 'Required for fund managers - Verify subscription capital origin'}
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Source of Funds *</label>
          <select
            value={formData.sourceOfFunds}
            onChange={(e) => setFormData({...formData, sourceOfFunds: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select source</option>
            <option value="employment">Employment Income</option>
            <option value="business">Business Profits</option>
            <option value="investment">Investment Returns</option>
            <option value="property-sale">Property Sale</option>
            <option value="inheritance">Inheritance</option>
            <option value="savings">Personal Savings</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Source of Wealth *</label>
          <textarea
            value={formData.sourceOfWealth}
            onChange={(e) => setFormData({...formData, sourceOfWealth: e.target.value})}
            placeholder="Describe how wealth was accumulated over time"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {industryType === 'lending' && (
          <>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <h4 className="font-bold text-blue-900 text-sm mb-3">Lender Requirements</h4>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span>Deposit source verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span>Equity contribution origin</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span>Expected repayment source</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span>Third-party funding disclosure</span>
                </div>
              </div>
            </div>
          </>
        )}

        {industryType === 'fund-management' && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4">
            <h4 className="font-bold text-purple-900 text-sm mb-3">Fund Manager Requirements</h4>
            <div className="space-y-2 text-sm text-purple-800">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600" />
                <span>Origin of subscription capital</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600" />
                <span>Bank account ownership verified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600" />
                <span>Regulated institution confirmation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600" />
                <span>Offshore capital disclosure</span>
              </div>
            </div>
          </div>
        )}

        <Button variant="outline" className="w-full mt-4">
          <Upload className="w-4 h-4 mr-2" />
          Upload Supporting Evidence
        </Button>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <h4 className="font-bold text-red-900 text-sm">Red Flags to Watch</h4>
            <ul className="text-sm text-red-800 mt-2 space-y-1">
              <li>• Circular payments between related entities</li>
              <li>• Undocumented private loans</li>
              <li>• Offshore funding without clear explanation</li>
              <li>• Multiple related entities transferring funds</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDocumentsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Supporting Documents</h2>
        <p className="text-gray-600">Upload all required verification documents</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { type: 'ID Documents', required: true, uploaded: true },
            { type: 'Proof of Address', required: true, uploaded: true },
            { type: 'Bank Statements', required: true, uploaded: false },
            { type: 'Source of Funds Evidence', required: true, uploaded: false },
            { type: 'Entity Documents', required: clientType !== 'individual', uploaded: false },
            { type: 'Additional Documents', required: false, uploaded: false }
          ].map((doc, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg border-2 ${
                doc.uploaded
                  ? 'border-green-200 bg-green-50'
                  : doc.required
                  ? 'border-yellow-200 bg-yellow-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-gray-900 text-sm">{doc.type}</h4>
                {doc.uploaded ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : doc.required ? (
                  <Clock className="w-5 h-5 text-yellow-600" />
                ) : (
                  <FileText className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <p className="text-xs text-gray-600 mb-3">
                {doc.required ? 'Required document' : 'Optional'}
              </p>
              <Button size="sm" variant="outline" className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
            </div>
          ))}
        </div>

        <div className="border-t pt-6">
          <h3 className="font-bold text-gray-900 mb-3">Uploaded Documents</h3>
          <div className="space-y-2">
            {[
              { name: 'Passport.pdf', size: '1.2 MB', date: '2024-02-19', status: 'Verified' },
              { name: 'Proof-of-Address.pdf', size: '856 KB', date: '2024-02-19', status: 'Verified' }
            ].map((file, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{file.name}</p>
                    <p className="text-xs text-gray-600">{file.size} • Uploaded {file.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                    {file.status}
                  </span>
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-bold text-yellow-900 text-sm mb-2">Document Requirements</h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Documents must be clear and legible</li>
          <li>• All pages must be complete and unaltered</li>
          <li>• Documents must be current (within 3 months)</li>
          <li>• Certified copies required for manual verification</li>
        </ul>
      </div>
    </div>
  );

  const renderDeclarationsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Declarations & Consent</h2>
        <p className="text-gray-600">Review and accept all required declarations</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
          <input
            type="checkbox"
            checked={formData.pepDeclaration}
            onChange={(e) => setFormData({...formData, pepDeclaration: e.target.checked})}
            className="mt-1"
          />
          <div>
            <h4 className="font-bold text-gray-900 text-sm mb-1">PEP Declaration *</h4>
            <p className="text-sm text-gray-700">
              I declare that I am NOT a Politically Exposed Person (PEP), nor am I a family member or close associate of a PEP
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
          <input
            type="checkbox"
            checked={formData.termsAccepted}
            onChange={(e) => setFormData({...formData, termsAccepted: e.target.checked})}
            className="mt-1"
          />
          <div>
            <h4 className="font-bold text-gray-900 text-sm mb-1">Terms & Conditions *</h4>
            <p className="text-sm text-gray-700">
              I have read, understood, and agree to the Terms & Conditions, Privacy Policy, and AML/CTF Policy
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
          <input
            type="checkbox"
            checked={formData.accuracyConfirmed}
            onChange={(e) => setFormData({...formData, accuracyConfirmed: e.target.checked})}
            className="mt-1"
          />
          <div>
            <h4 className="font-bold text-gray-900 text-sm mb-1">Accuracy Confirmation *</h4>
            <p className="text-sm text-gray-700">
              I confirm that all information provided is true, accurate, and complete to the best of my knowledge
            </p>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
          <h4 className="font-bold text-green-900 text-sm mb-2">Consent for Processing</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>✓ Identity verification via electronic or manual means</li>
            <li>✓ Sanctions, PEP, and adverse media screening</li>
            <li>✓ Ongoing monitoring and re-screening</li>
            <li>✓ Information sharing with AUSTRAC if required</li>
            <li>✓ Record retention for 7 years</li>
          </ul>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-bold text-blue-900 text-sm mb-2">Electronic Signature</h4>
        <p className="text-sm text-blue-800 mb-3">
          By proceeding, you are providing a legally binding electronic signature
        </p>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-blue-900 mb-2">Full Name (as signature)</label>
            <input
              type="text"
              value={formData.fullName}
              disabled
              className="w-full px-4 py-2 border border-blue-300 rounded-lg bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-blue-900 mb-2">Date</label>
            <input
              type="text"
              value={new Date().toLocaleDateString()}
              disabled
              className="w-full px-4 py-2 border border-blue-300 rounded-lg bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Review & Submit</h2>
        <p className="text-gray-600">Review all information before final submission</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { step: 'Client Type', status: 'complete', value: clientType },
          { step: 'Contact Information', status: 'complete', value: formData.fullName },
          { step: 'Entity Details', status: 'complete', value: formData.entityName || 'Individual' },
          { step: 'Beneficial Ownership', status: 'complete', value: clientType === 'individual' ? 'N/A' : `${formData.beneficialOwners.length} UBOs` },
          { step: 'Identity Verification', status: 'complete', value: formData.verificationMethod },
          { step: 'Screening', status: 'complete', value: 'All checks passed' },
          { step: 'Risk Assessment', status: 'complete', value: 'LOW risk' },
          { step: 'Source of Funds', status: industryType !== 'accounting' ? 'complete' : 'not-required', value: formData.sourceOfFunds || 'Not required' },
          { step: 'Documents', status: 'complete', value: '2 uploaded' },
          { step: 'Declarations', status: 'complete', value: 'All signed' }
        ].map((item, idx) => (
          <div key={idx} className={`p-4 rounded-lg border-2 ${
            item.status === 'complete' ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-gray-900 text-sm">{item.step}</h4>
              {item.status === 'complete' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <p className="text-sm text-gray-600">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white text-center">
        <CheckCircle className="w-16 h-16 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">Ready for Submission</h3>
        <p className="text-blue-100 mb-6">
          All required information has been collected and verified
        </p>
        <Button className="bg-white text-blue-600 hover:bg-blue-50" size="lg">
          <Send className="w-5 h-5 mr-2" />
          Submit for Approval
        </Button>
        <p className="text-sm text-blue-100 mt-4">
          A compliance officer will review within 1 business day
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-bold text-yellow-900 text-sm mb-2">What happens next?</h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Compliance officer will review all information</li>
          <li>• AI Copilot will assist with compliance checks</li>
          <li>• You may be contacted for additional information</li>
          <li>• Final approval decision within 1-2 business days</li>
          <li>• All records retained for 7 years (AUSTRAC requirement)</li>
        </ul>
      </div>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="space-y-6 text-center">
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-12 text-white">
        <CheckCircle className="w-24 h-24 mx-auto mb-6" />
        <h2 className="text-4xl font-bold mb-4">Onboarding Complete!</h2>
        <p className="text-xl text-green-100 mb-8">
          Thank you for completing the KYC onboarding process
        </p>
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="text-3xl font-bold">100%</p>
            <p className="text-sm text-green-100 mt-1">Complete</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="text-3xl font-bold">11</p>
            <p className="text-sm text-green-100 mt-1">Steps</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="text-3xl font-bold">LOW</p>
            <p className="text-sm text-green-100 mt-1">Risk Rating</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
          <Download className="w-5 h-5 mr-2" />
          Download Summary
        </Button>
        <Button size="lg" variant="outline">
          <Eye className="w-5 h-5 mr-2" />
          View Client Portal
        </Button>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 'client-type': return renderClientTypeStep();
      case 'contact-info': return renderContactInfoStep();
      case 'entity-details': return renderEntityDetailsStep();
      case 'beneficial-ownership': return renderBeneficialOwnershipStep();
      case 'identity-verification': return renderIdentityVerificationStep();
      case 'screening': return renderScreeningStep();
      case 'risk-assessment': return renderRiskAssessmentStep();
      case 'source-of-funds': return renderSourceOfFundsStep();
      case 'documents': return renderDocumentsStep();
      case 'declarations': return renderDeclarationsStep();
      case 'review': return renderReviewStep();
      case 'complete': return renderCompleteStep();
      default: return <div>Step not found</div>;
    }
  };

  const goToPreviousStep = () => {
    const currentIndex = getStepIndex();
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const goToNextStep = () => {
    const currentIndex = getStepIndex();
    if (currentIndex < steps.length - 1) {
      // Skip source of funds for accounting practices
      if (steps[currentIndex + 1].id === 'source-of-funds' && industryType === 'accounting') {
        setCurrentStep(steps[currentIndex + 2].id);
      } else {
        setCurrentStep(steps[currentIndex + 1].id);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Shield className="w-16 h-16" />
              <div>
                <h1 className="text-4xl font-bold mb-2">Grow Onboarding</h1>
                <p className="text-xl text-blue-100">Complete AUSTRAC-Compliant KYC Process</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100 mb-1">Progress</p>
              <p className="text-4xl font-bold">{getProgressPercentage()}%</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-500"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
        </div>

        {/* Step Indicators */}
        {currentStep !== 'complete' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between">
              {steps.filter(s => s.id !== 'complete' && (s.industry ? s.industry.includes(industryType) : true)).map((step, idx) => {
                const isActive = step.id === currentStep;
                const isComplete = getStepIndex() > idx;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        isComplete ? 'bg-green-600 text-white' :
                        isActive ? 'bg-blue-600 text-white' :
                        'bg-gray-200 text-gray-600'
                      }`}>
                        {isComplete ? <Check className="w-6 h-6" /> : idx + 1}
                      </div>
                      <p className={`text-xs mt-2 text-center max-w-[80px] ${
                        isActive ? 'text-blue-600 font-bold' : 'text-gray-600'
                      }`}>
                        {step.label}
                      </p>
                    </div>
                    {idx < steps.filter(s => s.id !== 'complete' && (s.industry ? s.industry.includes(industryType) : true)).length - 1 && (
                      <div className={`w-12 h-1 mx-2 ${
                        isComplete ? 'bg-green-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        {currentStep !== 'complete' && (
          <div className="flex gap-4">
            {currentStep !== 'client-type' && (
              <Button
                variant="outline"
                size="lg"
                onClick={goToPreviousStep}
                className="flex-1"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Previous
              </Button>
            )}
            {currentStep !== 'review' ? (
              <Button
                size="lg"
                onClick={goToNextStep}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Next Step
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={() => setCurrentStep('complete')}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Send className="w-5 h-5 mr-2" />
                Submit Application
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

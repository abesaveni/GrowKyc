import React, { useState } from 'react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import {
  Shield,
  Building,
  Users,
  FileText,
  CheckCircle,
  Upload,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Check,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Lock,
  Eye,
  EyeOff,
  Download,
  X,
  Info,
  Clock
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

type OnboardingStep = 
  | 'welcome'
  | 'business-info'
  | 'beneficial-owners'
  | 'documents'
  | 'verification'
  | 'review'
  | 'complete';

interface Document {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'uploaded' | 'verified';
  required: boolean;
}

export function ClientOnboardingPortal() {
  const { user } = useAuth();
  const isPartner = user?.role === 'partner';
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [completedSteps, setCompletedSteps] = useState<OnboardingStep[]>([]);

  // Form state
  const [businessInfo, setBusinessInfo] = useState({
    legalName: '',
    tradingName: '',
    abn: '',
    acn: '',
    entityType: '',
    industryType: '',
    registeredAddress: '',
    businessAddress: '',
    website: ''
  });

  const [contactInfo, setContactInfo] = useState({
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    contactRole: ''
  });

  const [documents, setDocuments] = useState<Document[]>([
    { id: '1', name: 'Certificate of Incorporation', type: 'incorporation', status: 'pending', required: true },
    { id: '2', name: 'ASIC Company Extract', type: 'asic', status: 'pending', required: true },
    { id: '3', name: 'Director ID Verification', type: 'director-id', status: 'pending', required: true },
    { id: '4', name: 'Proof of Business Address', type: 'address', status: 'pending', required: true },
    { id: '5', name: 'Financial Statements', type: 'financial', status: 'pending', required: false },
    { id: '6', name: 'Business License', type: 'license', status: 'pending', required: false }
  ]);

  const steps = [
    { id: 'welcome', label: 'Welcome', icon: Shield },
    { id: 'business-info', label: 'Business Info', icon: Building },
    { id: 'beneficial-owners', label: 'Owners & Directors', icon: Users },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'verification', label: 'Verification', icon: CheckCircle },
    { id: 'review', label: 'Review', icon: Eye },
    { id: 'complete', label: 'Complete', icon: Check }
  ];

  const getCurrentStepIndex = () => steps.findIndex(s => s.id === currentStep);
  const progress = ((getCurrentStepIndex() + 1) / steps.length) * 100;

  const handleNext = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex < steps.length - 1) {
      setCompletedSteps([...completedSteps, currentStep]);
      setCurrentStep(steps[currentIndex + 1].id as OnboardingStep);
    }
  };

  const handleBack = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id as OnboardingStep);
    }
  };

  const handleFileUpload = (docId: string) => {
    setDocuments(docs => docs.map(doc => 
      doc.id === docId ? { ...doc, status: 'uploaded' as const } : doc
    ));
    toast.success('Document uploaded successfully');
  };

  const renderWelcome = () => (
    <div className="max-w-3xl mx-auto text-center space-y-8">
      <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6">
        <Shield className="w-12 h-12 text-white" />
      </div>
      
      <div>
        <h1 className="text-4xl font-bold text-slate-100 mb-4">Welcome to Client Onboarding</h1>
        <p className="text-xl text-slate-300">
          We're excited to have you join us. This secure portal will guide you through our compliance process.
        </p>
      </div>

      <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-lg p-6 text-left">
        <h3 className="font-bold text-blue-300 mb-4 flex items-center gap-2">
          <Info className="w-5 h-5" />
          What You'll Need
        </h3>
        <ul className="space-y-3 text-blue-300">
          <li className="flex items-start gap-2">
            <Check className="w-5 h-5 text-blue-400 mt-0.5" />
            <span>Business registration documents (Certificate of Incorporation, ABN/ACN)</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-5 h-5 text-blue-400 mt-0.5" />
            <span>Director and beneficial owner identification (Driver's License or Passport)</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-5 h-5 text-blue-400 mt-0.5" />
            <span>Proof of business address (Utility bill or lease agreement)</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-5 h-5 text-blue-400 mt-0.5" />
            <span>Approximately 15-20 minutes to complete</span>
          </li>
        </ul>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-8">
        <div className="p-6 bg-white border-2 border-white/10 rounded-lg">
          <Lock className="w-8 h-8 text-blue-400 mb-3 mx-auto" />
          <h4 className="font-bold text-slate-100 mb-2">Secure & Encrypted</h4>
          <p className="text-sm text-slate-300">Your data is protected with bank-level encryption</p>
        </div>
        <div className="p-6 bg-white border-2 border-white/10 rounded-lg">
          <Shield className="w-8 h-8 text-green-400 mb-3 mx-auto" />
          <h4 className="font-bold text-slate-100 mb-2">AUSTRAC Compliant</h4>
          <p className="text-sm text-slate-300">Meets all regulatory requirements</p>
        </div>
        <div className="p-6 bg-white border-2 border-white/10 rounded-lg">
          <CheckCircle className="w-8 h-8 text-purple-400 mb-3 mx-auto" />
          <h4 className="font-bold text-slate-100 mb-2">Quick Process</h4>
          <p className="text-sm text-slate-300">Complete in under 20 minutes</p>
        </div>
      </div>

      <Button 
        size="lg" 
        className={`px-8 py-6 text-lg ${isPartner ? 'opacity-50 cursor-not-allowed' : ''}`} 
        onClick={() => !isPartner && handleNext()}
        disabled={isPartner}
        title={isPartner ? "Managing Partners cannot start onboarding cases." : undefined}
      >
        Start Onboarding
        <ChevronRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );

  const renderBusinessInfo = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-100 mb-2">Business Information</h2>
        <p className="text-slate-300">Tell us about your business entity</p>
      </div>

      <div className="bg-white border-2 border-white/10 rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Legal Entity Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="ABC Pty Ltd"
              value={businessInfo.legalName}
              onChange={(e) => setBusinessInfo({ ...businessInfo, legalName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Trading Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="ABC Company"
              value={businessInfo.tradingName}
              onChange={(e) => setBusinessInfo({ ...businessInfo, tradingName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              ABN <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="12 345 678 901"
              value={businessInfo.abn}
              onChange={(e) => setBusinessInfo({ ...businessInfo, abn: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              ACN
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="123 456 789"
              value={businessInfo.acn}
              onChange={(e) => setBusinessInfo({ ...businessInfo, acn: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Entity Type <span className="text-red-400">*</span>
            </label>
            <select
              className="w-full px-4 py-3 border-2 border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={businessInfo.entityType}
              onChange={(e) => setBusinessInfo({ ...businessInfo, entityType: e.target.value })}
            >
              <option value="">Select entity type...</option>
              <option value="company">Company (Pty Ltd)</option>
              <option value="trust">Trust</option>
              <option value="partnership">Partnership</option>
              <option value="sole-trader">Sole Trader</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Industry Type <span className="text-red-400">*</span>
            </label>
            <select
              className="w-full px-4 py-3 border-2 border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={businessInfo.industryType}
              onChange={(e) => setBusinessInfo({ ...businessInfo, industryType: e.target.value })}
            >
              <option value="">Select industry...</option>
              <option value="professional-services">Professional Services</option>
              <option value="technology">Technology</option>
              <option value="retail">Retail</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="construction">Construction</option>
              <option value="hospitality">Hospitality</option>
              <option value="healthcare">Healthcare</option>
              <option value="finance">Finance</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Registered Address <span className="text-red-400">*</span>
          </label>
          <textarea
            className="w-full px-4 py-3 border-2 border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="123 Business Street, Melbourne VIC 3000"
            value={businessInfo.registeredAddress}
            onChange={(e) => setBusinessInfo({ ...businessInfo, registeredAddress: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Business Operating Address
          </label>
          <textarea
            className="w-full px-4 py-3 border-2 border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Same as registered address or different location"
            value={businessInfo.businessAddress}
            onChange={(e) => setBusinessInfo({ ...businessInfo, businessAddress: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Website
          </label>
          <input
            type="url"
            className="w-full px-4 py-3 border-2 border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://www.yourcompany.com.au"
            value={businessInfo.website}
            onChange={(e) => setBusinessInfo({ ...businessInfo, website: e.target.value })}
          />
        </div>
      </div>

      <div className="bg-white border-2 border-white/10 rounded-lg p-6 space-y-6">
        <h3 className="text-xl font-bold text-slate-100">Primary Contact Information</h3>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Contact Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="John Smith"
              value={contactInfo.contactName}
              onChange={(e) => setContactInfo({ ...contactInfo, contactName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Role/Position <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Director"
              value={contactInfo.contactRole}
              onChange={(e) => setContactInfo({ ...contactInfo, contactRole: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Email Address <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border-2 border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="john@company.com.au"
              value={contactInfo.contactEmail}
              onChange={(e) => setContactInfo({ ...contactInfo, contactEmail: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Phone Number <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              className="w-full px-4 py-3 border-2 border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0400 000 000"
              value={contactInfo.contactPhone}
              onChange={(e) => setContactInfo({ ...contactInfo, contactPhone: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderBeneficialOwners = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-100 mb-2">Directors & Beneficial Owners</h2>
        <p className="text-slate-300">Provide details of all directors and beneficial owners (25% or more ownership)</p>
      </div>

      <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-300 mb-1">AML/CTF Requirement</p>
            <p className="text-sm text-blue-300">
              Under Australian law, we must verify the identity of all beneficial owners who hold 25% or more of the company.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-white/10 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-100">Owner #1</h3>
          <span className="px-3 py-1 bg-blue-500/15 text-blue-300 text-sm font-bold rounded-full">PRIMARY</span>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Full Legal Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="John William Smith"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Date of Birth <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 border-2 border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Ownership % <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              className="w-full px-4 py-3 border-2 border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="50"
              min="0"
              max="100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              ID Type <span className="text-red-400">*</span>
            </label>
            <select className="w-full px-4 py-3 border-2 border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Select ID type...</option>
              <option value="drivers-license">Driver's License</option>
              <option value="passport">Passport</option>
              <option value="medicare">Medicare Card</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Residential Address <span className="text-red-400">*</span>
            </label>
            <textarea
              className="w-full px-4 py-3 border-2 border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="456 Residential Street, Sydney NSW 2000"
            />
          </div>
        </div>
      </div>

      <Button variant="outline" className="w-full">
        <Users className="w-5 h-5 mr-2" />
        Add Another Owner/Director
      </Button>
    </div>
  );

  const renderDocuments = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-100 mb-2">Document Upload</h2>
        <p className="text-slate-300">Upload required documents for verification</p>
      </div>

      <div className="bg-yellow-500/10 border-2 border-yellow-500/30 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-300 mb-1">Document Requirements</p>
            <p className="text-sm text-yellow-300">
              All documents must be clear, current (within 3 months), and show full details. Accepted formats: PDF, JPG, PNG (max 10MB)
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-white border-2 border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-slate-300" />
                <div>
                  <p className="font-bold text-slate-100">{doc.name}</p>
                  {doc.required && (
                    <span className="text-xs text-red-400 font-semibold">REQUIRED</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {doc.status === 'pending' && (
                  <span className="px-3 py-1 bg-white/5 text-slate-300 text-sm font-bold rounded-full">
                    PENDING
                  </span>
                )}
                {doc.status === 'uploaded' && (
                  <span className="px-3 py-1 bg-green-500/15 text-green-300 text-sm font-bold rounded-full flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    UPLOADED
                  </span>
                )}
                {doc.status === 'verified' && (
                  <span className="px-3 py-1 bg-blue-500/15 text-blue-300 text-sm font-bold rounded-full flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    VERIFIED
                  </span>
                )}
              </div>
            </div>

            {doc.status === 'pending' ? (
              <Button 
                className="w-full"
                onClick={() => handleFileUpload(doc.id)}
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload Document
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  <Eye className="w-5 h-5 mr-2" />
                  View
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => handleFileUpload(doc.id)}>
                  <Upload className="w-5 h-5 mr-2" />
                  Replace
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white border-2 border-white/10 rounded-lg p-6">
        <h3 className="font-bold text-slate-100 mb-4">Upload Progress</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300">Required Documents</span>
            <span className="font-bold text-slate-100">
              {documents.filter(d => d.required && d.status !== 'pending').length} / {documents.filter(d => d.required).length}
            </span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ 
                width: `${(documents.filter(d => d.required && d.status !== 'pending').length / documents.filter(d => d.required).length) * 100}%` 
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderVerification = () => (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/15 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-blue-400" />
        </div>
        <h2 className="text-3xl font-bold text-slate-100 mb-2">Identity Verification</h2>
        <p className="text-slate-300">Complete your identity verification to proceed</p>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white text-center">
        <Shield className="w-16 h-16 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">Secure ID Verification</h3>
        <p className="text-blue-100 mb-6">
          We use GreenID powered by InfoTrack for instant identity verification
        </p>
        <Button size="lg" className="bg-white text-blue-400 hover:bg-blue-500/10">
          Start Verification
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border-2 border-white/10 rounded-lg p-6 text-center">
          <div className="w-12 h-12 bg-green-500/15 rounded-full flex items-center justify-center mx-auto mb-3">
            <Check className="w-6 h-6 text-green-400" />
          </div>
          <p className="font-bold text-slate-100 mb-1">Step 1</p>
          <p className="text-sm text-slate-300">Enter details</p>
        </div>
        <div className="bg-white border-2 border-white/10 rounded-lg p-6 text-center">
          <div className="w-12 h-12 bg-green-500/15 rounded-full flex items-center justify-center mx-auto mb-3">
            <Check className="w-6 h-6 text-green-400" />
          </div>
          <p className="font-bold text-slate-100 mb-1">Step 2</p>
          <p className="text-sm text-slate-300">Verify documents</p>
        </div>
        <div className="bg-white border-2 border-blue-500/30 rounded-lg p-6 text-center">
          <div className="w-12 h-12 bg-blue-500/15 rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6 text-blue-400" />
          </div>
          <p className="font-bold text-slate-100 mb-1">Step 3</p>
          <p className="text-sm text-slate-300">Instant result</p>
        </div>
      </div>

      <div className="bg-white border-2 border-white/10 rounded-lg p-6">
        <h3 className="font-bold text-slate-100 mb-4">Verification Checklist</h3>
        <div className="space-y-3">
          {[
            { label: 'Business Entity Verified', complete: true },
            { label: 'Directors Verified', complete: true },
            { label: 'Beneficial Owners Verified', complete: false },
            { label: 'Address Verified', complete: false }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-slate-100">{item.label}</span>
              {item.complete ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <div className="w-5 h-5 border-2 border-white/10 rounded-full" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-100 mb-2">Review & Submit</h2>
        <p className="text-slate-300">Please review all information before submitting</p>
      </div>

      <div className="bg-white border-2 border-white/10 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-100">Business Information</h3>
          <Button variant="outline" size="sm" onClick={() => setCurrentStep('business-info')}>
            Edit
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-300">Legal Name</p>
            <p className="font-semibold text-slate-100">{businessInfo.legalName || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-300">ABN</p>
            <p className="font-semibold text-slate-100">{businessInfo.abn || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-300">Entity Type</p>
            <p className="font-semibold text-slate-100">{businessInfo.entityType || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-300">Industry</p>
            <p className="font-semibold text-slate-100">{businessInfo.industryType || 'Not provided'}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-white/10 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-100">Documents</h3>
          <Button variant="outline" size="sm" onClick={() => setCurrentStep('documents')}>
            Edit
          </Button>
        </div>
        <div className="space-y-2">
          {documents.filter(d => d.required).map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-slate-100">{doc.name}</span>
              {doc.status !== 'pending' ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border-2 border-white/10 rounded-lg p-6">
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" className="mt-1 w-5 h-5" />
          <div>
            <p className="font-semibold text-slate-100 mb-1">
              I declare that all information provided is true and accurate
            </p>
            <p className="text-sm text-slate-300">
              By submitting this form, you agree to our Terms of Service and Privacy Policy. 
              You acknowledge that providing false information may result in criminal penalties.
            </p>
          </div>
        </label>
      </div>

      <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-lg p-6">
        <h3 className="font-bold text-blue-300 mb-2">What happens next?</h3>
        <ul className="space-y-2 text-blue-300 text-sm">
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-blue-400 mt-0.5" />
            <span>Your application will be reviewed within 1-2 business days</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-blue-400 mt-0.5" />
            <span>We may contact you if additional information is required</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-blue-400 mt-0.5" />
            <span>You'll receive an email notification once approved</span>
          </li>
        </ul>
      </div>
    </div>
  );

  const renderComplete = () => (
    <div className="max-w-3xl mx-auto text-center space-y-8">
      <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full mb-6">
        <CheckCircle className="w-12 h-12 text-white" />
      </div>
      
      <div>
        <h1 className="text-4xl font-bold text-slate-100 mb-4">Application Submitted!</h1>
        <p className="text-xl text-slate-300">
          Thank you for completing your onboarding. We're reviewing your application now.
        </p>
      </div>

      <div className="bg-green-500/10 border-2 border-green-500/30 rounded-lg p-8">
        <h3 className="font-bold text-green-300 text-lg mb-4">Application Reference</h3>
        <p className="text-3xl font-mono font-bold text-green-300 mb-2">CLI-2024-{Math.floor(Math.random() * 1000).toString().padStart(3, '0')}</p>
        <p className="text-sm text-green-300">Please save this reference number for your records</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white border-2 border-white/10 rounded-lg p-6">
          <Clock className="w-8 h-8 text-blue-400 mb-3 mx-auto" />
          <h4 className="font-bold text-slate-100 mb-2">Review Time</h4>
          <p className="text-sm text-slate-300">1-2 business days</p>
        </div>
        <div className="bg-white border-2 border-white/10 rounded-lg p-6">
          <Mail className="w-8 h-8 text-purple-400 mb-3 mx-auto" />
          <h4 className="font-bold text-slate-100 mb-2">Email Updates</h4>
          <p className="text-sm text-slate-300">We'll keep you informed</p>
        </div>
        <div className="bg-white border-2 border-white/10 rounded-lg p-6">
          <Phone className="w-8 h-8 text-green-400 mb-3 mx-auto" />
          <h4 className="font-bold text-slate-100 mb-2">Need Help?</h4>
          <p className="text-sm text-slate-300">Contact support</p>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <Button variant="outline" size="lg">
          <Download className="w-5 h-5 mr-2" />
          Download Receipt
        </Button>
        <Button size="lg">
          Return to Dashboard
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white/5">
      {/* Header */}
      <div className="bg-white border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-xl font-bold text-slate-100">Client Onboarding</h1>
                <p className="text-sm text-slate-300">Secure & Compliant</p>
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
      {currentStep !== 'welcome' && currentStep !== 'complete' && (
        <div className="bg-white border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-300">Progress</span>
                <span className="text-sm font-semibold text-slate-300">{Math.round(progress)}%</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isActive = step.id === currentStep;
                const isCompleted = completedSteps.includes(step.id as OnboardingStep);
                
                return (
                  <div key={step.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                        isActive ? 'bg-blue-600 text-white' :
                        isCompleted ? 'bg-green-600 text-white' :
                        'bg-white/10 text-slate-400'
                      }`}>
                        {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                      </div>
                      <p className={`text-xs font-semibold text-center ${
                        isActive ? 'text-blue-400' :
                        isCompleted ? 'text-green-400' :
                        'text-slate-400'
                      }`}>
                        {step.label}
                      </p>
                    </div>
                    {idx < steps.length - 1 && (
                      <div className={`h-0.5 flex-1 mx-2 ${
                        isCompleted ? 'bg-green-600' : 'bg-white/10'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {currentStep === 'welcome' && renderWelcome()}
        {currentStep === 'business-info' && renderBusinessInfo()}
        {currentStep === 'beneficial-owners' && renderBeneficialOwners()}
        {currentStep === 'documents' && renderDocuments()}
        {currentStep === 'verification' && renderVerification()}
        {currentStep === 'review' && renderReview()}
        {currentStep === 'complete' && renderComplete()}
      </div>

      {/* Navigation Buttons */}
      {currentStep !== 'welcome' && currentStep !== 'complete' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-white/10 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Button
              variant="outline"
              size="lg"
              onClick={handleBack}
              disabled={getCurrentStepIndex() === 0}
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back
            </Button>

            {currentStep === 'review' ? (
              <Button
                size="lg"
                className="px-8"
                onClick={() => {
                  toast.success('Application submitted successfully!');
                  handleNext();
                }}
              >
                Submit Application
                <CheckCircle className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Button
                size="lg"
                className="px-8"
                onClick={handleNext}
              >
                Continue
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

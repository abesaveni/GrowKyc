import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  CheckCircle,
  AlertCircle,
  Users,
  Building2,
  FileText,
  Shield,
  Sparkles,
  X,
  Eye,
  Download,
  Trash2,
  Search,
  Globe,
  Calendar,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Lock,
  Unlock,
  Zap,
  Target,
  TrendingUp,
  Clock,
  Activity,
  PlayCircle
} from 'lucide-react';
import { toast } from '../../lib/toast';
import { ClientsDB } from '../kyc/ClientsDatabase';

interface SmartClientOnboardingProps {
  onBack: () => void;
}

type ClientType = 'individual' | 'company' | 'trust' | 'partnership' | 'smsf';
type OnboardingStep = 'type' | 'details' | 'documents' | 'verification' | 'review' | 'complete';

export function SmartClientOnboarding({ onBack }: SmartClientOnboardingProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('type');
  const [clientType, setClientType] = useState<ClientType | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState<any>({});
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clientTypes = [
    {
      id: 'individual' as ClientType,
      name: 'Individual',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      description: 'Personal client or sole trader',
      requirements: ['ID (70 points)', 'Proof of address', 'Photo ID'],
      estimatedTime: '5-7 mins'
    },
    {
      id: 'company' as ClientType,
      name: 'Company',
      icon: Building2,
      color: 'from-purple-500 to-purple-600',
      description: 'Pty Ltd, Ltd, or Public company',
      requirements: ['ABN/ACN', 'ASIC extract', 'Director IDs', 'Beneficial owners'],
      estimatedTime: '10-15 mins'
    },
    {
      id: 'trust' as ClientType,
      name: 'Trust',
      icon: Shield,
      color: 'from-green-500 to-green-600',
      description: 'Family trust, unit trust, or discretionary trust',
      requirements: ['Trust deed', 'Trustee details', 'Beneficiaries', 'Appointors'],
      estimatedTime: '12-18 mins'
    },
    {
      id: 'partnership' as ClientType,
      name: 'Partnership',
      icon: Users,
      color: 'from-orange-500 to-orange-600',
      description: 'Business partnership',
      requirements: ['Partnership agreement', 'Partner IDs', 'Business details'],
      estimatedTime: '8-12 mins'
    },
    {
      id: 'smsf' as ClientType,
      name: 'SMSF',
      icon: TrendingUp,
      color: 'from-indigo-500 to-indigo-600',
      description: 'Self-managed superannuation fund',
      requirements: ['Trust deed', 'Trustee IDs', 'Member details', 'ABN'],
      estimatedTime: '15-20 mins'
    }
  ];

  const steps: { id: OnboardingStep; label: string }[] = [
    { id: 'type', label: 'Client Type' },
    { id: 'details', label: 'Details' },
    { id: 'documents', label: 'Documents' },
    { id: 'verification', label: 'Verification' },
    { id: 'review', label: 'Review' },
    { id: 'complete', label: 'Complete' }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(files);
  }, []);

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => 
      file.size <= 10 * 1024 * 1024 && // 10MB limit
      ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)
    );

    if (validFiles.length !== files.length) {
      toast.error('Some files were rejected. Only PDF, JPG, PNG under 10MB accepted.');
    }

    setUploadedFiles(prev => [...prev, ...validFiles]);
    toast.success(`${validFiles.length} file(s) uploaded successfully!`);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    toast.info('File removed');
  };

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    }
  };

  const handlePrevious = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const handleTypeSelect = (type: ClientType) => {
    setClientType(type);
    setCurrentStep('details');
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} selected. Let's get started!`);
  };

  const startVerification = () => {
    setProcessing(true);
    toast.info('Starting AI verification...');
    
    // Simulate AI processing
    setTimeout(() => {
      setProcessing(false);
      setCurrentStep('review');
      toast.success('Verification complete! All checks passed.');
    }, 3000);
  };

  const completeOnboarding = () => {
    setProcessing(true);
    toast.info('Finalizing onboarding...');
    
    setTimeout(() => {
      // Determine client name
      const name = clientType === 'individual' 
        ? `${formData.firstName || 'John'} ${formData.lastName || 'Smith'}`.trim()
        : (formData.companyName || 'Acme Pty Ltd');
      
      const nextId = (ClientsDB.getClients().length + 1).toString();
      const currentDate = new Date().toISOString().split('T')[0];
      const nextYearDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0];

      // Process uploaded files for identityData
      const hasUploadedFiles = uploadedFiles.length > 0;
      
      const primaryDoc = uploadedFiles.find(file => 
        file.name.toLowerCase().includes('passport') || 
        file.name.toLowerCase().includes('birth') ||
        file.name.toLowerCase().includes('citizenship')
      ) || uploadedFiles[0];
      
      const secondaryDoc = uploadedFiles.find(file => 
        file !== primaryDoc && (
          file.name.toLowerCase().includes('license') || 
          file.name.toLowerCase().includes('medicare')
        )
      ) || uploadedFiles.filter(file => file !== primaryDoc)[0];

      const additionalDocs = uploadedFiles.filter(file => file !== primaryDoc && file !== secondaryDoc);

      const newClient: any = {
        id: nextId,
        name: name,
        entityType: clientType === 'individual' ? 'Individual' : clientType === 'company' ? 'Company' : clientType === 'trust' ? 'Trust' : clientType === 'partnership' ? 'Partnership' : 'Company',
        status: 'Active',
        country: formData.country || 'Australia',
        industry: 'Wealth Management',
        serviceType: 'Wealth Management',
        clientGroup: 'New Onboard Group',
        riskScores: {
          overall: hasUploadedFiles ? 15 : 45,
          aml: hasUploadedFiles ? 10 : 30,
          financial: 18,
          business: 12,
          ownership: 0
        },
        quickStatus: {
          identity: hasUploadedFiles ? 'Verified' : 'Pending',
          aml: 'Clear',
          entity: clientType === 'individual' ? 'N/A' : 'Active',
          monitoring: 'Active'
        },
        lastReview: currentDate,
        nextReview: nextYearDate,
        identityData: {
          primaryID: primaryDoc ? {
            type: primaryDoc.name.toLowerCase().includes('license') 
              ? 'Driver License' 
              : primaryDoc.name.toLowerCase().includes('birth') 
                ? 'Birth Certificate' 
                : 'Passport',
            number: 'PA' + Math.floor(1000000 + Math.random() * 9000000),
            expiry: '2032-01-01',
            verified: true
          } : null,
          secondaryID: secondaryDoc ? {
            type: secondaryDoc.name.toLowerCase().includes('medicare') 
              ? 'Medicare Card' 
              : secondaryDoc.name.toLowerCase().includes('license')
                ? 'Driver License'
                : 'Birth Certificate',
            number: 'MC' + Math.floor(1000000 + Math.random() * 9000000),
            expiry: '2032-01-01',
            verified: true
          } : null,
          additionalDocuments: additionalDocs.map((file, idx) => ({
            type: file.name.toLowerCase().includes('statement') 
              ? 'Bank Statement' 
              : file.name.toLowerCase().includes('bill')
                ? 'Utility Bill'
                : 'Other Support Document',
            number: 'AD' + Math.floor(1000000 + Math.random() * 9000000),
            verified: true
          })),
          biometricStatus: hasUploadedFiles ? 'Passed' : 'Pending',
          livenessCheck: hasUploadedFiles,
          addressVerified: hasUploadedFiles,
          greenIDScore: hasUploadedFiles ? 955 : 0,
          infoTrackStatus: hasUploadedFiles ? 'Verified - High Confidence' : 'Not Started',
          fraudFlags: []
        },
        amlData: {
          sanctionsMatches: 0,
          pepStatus: 'Not PEP',
          adverseMediaHits: 0,
          worldCheckStatus: 'Clear',
          transactionMonitoring: 'Active',
          riskRating: 'Low',
          lastScreeningDate: currentDate
        },
        entityData: {
          registrationDate: currentDate,
          companyStatus: 'Active',
          directors: [],
          shareholders: []
        },
        ownershipData: {
          ubos: [
            { name: name, ownership: 100, verified: true, country: 'Australia' }
          ],
          ownershipStructureComplete: true,
          complexStructure: false
        },
        financialData: {
          bankAccounts: 1,
          sourceOfFunds: 'Business operations',
          sourceOfWealth: 'Investments',
          estimatedWealth: '$1.5M',
          transactionVolume: '$50K monthly',
          highRiskTransactions: 0
        },
        legalData: {
          serviceAgreementSigned: true,
          termsAccepted: true,
          privacyConsentGiven: true,
          kycConsentDate: currentDate
        },
        documentsData: {
          total: uploadedFiles.length,
          verified: uploadedFiles.length,
          pending: 0,
          rejected: 0
        },
        monitoringData: { alertsLast30Days: 0, activeAlerts: 0, nameChanges: 0, addressChanges: 0, ownershipChanges: 0 },
        austracData: {
          smrsFiled: 0,
          ttrsFiled: 0,
          lastReportDate: '',
          suspiciousActivity: false
        },
        decisionsData: {
          onboardingDecision: 'Pending',
          onboardingDate: currentDate,
          approver: 'Awaiting Review',
          riskAssessments: 0,
          escalations: 0
        }
      };

      ClientsDB.addClient(newClient);

      // Save to logged activities
      const activityLog = {
        type: 'approval',
        user: 'Head of Compliance',
        action: `successfully onboarded client ${newClient.name}`,
        time: 'Just now',
        iconName: 'CheckCircle',
        color: 'text-green-600'
      };
      const savedLogs = localStorage.getItem('growkyc_logged_activities');
      const logs = savedLogs ? JSON.parse(savedLogs) : [];
      logs.unshift(activityLog);
      localStorage.setItem('growkyc_logged_activities', JSON.stringify(logs));
      window.dispatchEvent(new CustomEvent('growkyc:activity_logged'));

      setProcessing(false);
      setCurrentStep('complete');
      toast.success('🎉 Client onboarded successfully!');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card className="bg-gradient-to-r from-[#13B5EA] to-[#0E7C9E] text-white border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Smart Client Onboarding</h1>
                <p className="text-white/90">AI-powered verification with drag & drop simplicity</p>
              </div>
              {clientType && (
                <Badge className="bg-white/20 text-white text-lg px-4 py-2">
                  {clientType.charAt(0).toUpperCase() + clientType.slice(1)}
                </Badge>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-white/90 mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-3 bg-white/20" />
            </div>

            {/* Step Indicators */}
            <div className="flex items-center gap-2">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex-1 h-2 rounded-full transition-all ${
                    index <= currentStepIndex
                      ? 'bg-white shadow-lg'
                      : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        {/* Step 1: Client Type Selection */}
        {currentStep === 'type' && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Select Client Type</CardTitle>
                <CardDescription>Choose the type of client you're onboarding</CardDescription>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {clientTypes.map((type) => {
                const TypeIcon = type.icon;
                return (
                  <Card
                    key={type.id}
                    className="hover:shadow-2xl transition-all cursor-pointer group border-2 hover:border-[#13B5EA] hover:scale-105"
                    onClick={() => handleTypeSelect(type.id)}
                  >
                    <CardContent className="p-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${type.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                        <TypeIcon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{type.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{type.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <p className="text-xs font-semibold text-gray-700">Required:</p>
                        {type.requirements.map((req, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            {req}
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        Est. {type.estimatedTime}
                      </div>

                      <Button className="w-full mt-4 bg-gradient-to-r from-[#13B5EA] to-[#0E7C9E] text-white">
                        Select {type.name}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Details Form */}
        {currentStep === 'details' && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <Card>
              <CardHeader>
                <CardTitle>Client Details</CardTitle>
                <CardDescription>
                  We'll auto-fill what we can. Just verify and complete.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  {clientType === 'individual' && (
                    <>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                          First Name *
                        </label>
                        <Input 
                          placeholder="John" 
                          className="text-base" 
                          value={formData.firstName || ''} 
                          onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                          Last Name *
                        </label>
                        <Input 
                          placeholder="Smith" 
                          className="text-base" 
                          value={formData.lastName || ''} 
                          onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                          Date of Birth *
                        </label>
                        <Input 
                          type="date" 
                          className="text-base" 
                          value={formData.dateOfBirth || ''} 
                          onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                          Email *
                        </label>
                        <Input 
                          type="email" 
                          placeholder="john.smith@email.com" 
                          className="text-base" 
                          value={formData.email || ''} 
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                          Mobile *
                        </label>
                        <Input 
                          placeholder="0400 000 000" 
                          className="text-base" 
                          value={formData.phone || ''} 
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                          Residential Address *
                        </label>
                        <Input 
                          placeholder="123 Main St, Sydney NSW 2000" 
                          className="text-base" 
                          value={formData.address || ''} 
                          onChange={e => setFormData({ ...formData, address: e.target.value })}
                        />
                      </div>
                    </>
                  )}

                  {clientType === 'company' && (
                    <>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                          Company Name *
                        </label>
                        <Input 
                          placeholder="Acme Pty Ltd" 
                          className="text-base" 
                          value={formData.companyName || ''} 
                          onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                          ABN *
                        </label>
                        <div className="flex gap-2">
                          <Input 
                            placeholder="51 123 456 789" 
                            className="text-base flex-1" 
                            value={formData.abn || ''} 
                            onChange={e => setFormData({ ...formData, abn: e.target.value })}
                          />
                          <Button variant="outline">
                            <Search className="w-4 h-4 mr-2" />
                            Lookup
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">We'll auto-fill details from ABN lookup</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                          ACN *
                        </label>
                        <Input 
                          placeholder="123 456 789" 
                          className="text-base" 
                          value={formData.acn || ''} 
                          onChange={e => setFormData({ ...formData, acn: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                          Registered Address *
                        </label>
                        <Input 
                          placeholder="123 Business Ave, Sydney NSW 2000" 
                          className="text-base" 
                          value={formData.address || ''} 
                          onChange={e => setFormData({ ...formData, address: e.target.value })}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between mt-8 pt-6 border-t">
                  <Button variant="outline" onClick={handlePrevious}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-[#13B5EA] to-[#0E7C9E] text-white"
                    onClick={handleNext}
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Document Upload */}
        {currentStep === 'documents' && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <Card>
              <CardHeader>
                <CardTitle>Upload Documents</CardTitle>
                <CardDescription>
                  Drag & drop your documents or click to browse. We'll extract data automatically.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Drag & Drop Zone */}
                <div
                  className={`border-4 border-dashed rounded-2xl p-12 text-center transition-all ${
                    dragActive
                      ? 'border-[#13B5EA] bg-[#13B5EA]/5 scale-105'
                      : 'border-gray-300 hover:border-[#13B5EA] hover:bg-gray-50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileInput}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                  />
                  
                  <div className="w-20 h-20 bg-gradient-to-br from-[#13B5EA] to-[#0E7C9E] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Upload className="w-10 h-10 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Drop your documents here
                  </h3>
                  <p className="text-gray-600 mb-4">
                    or click to browse from your computer
                  </p>
                  <p className="text-sm text-gray-500">
                    Supported: PDF, JPG, PNG • Max 10MB per file
                  </p>

                  <div className="flex items-center justify-center gap-4 mt-6">
                    <Badge variant="outline">
                      <Zap className="w-3 h-3 mr-1" />
                      Auto OCR
                    </Badge>
                    <Badge variant="outline">
                      <Shield className="w-3 h-3 mr-1" />
                      Encrypted
                    </Badge>
                    <Badge variant="outline">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Auto Verify
                    </Badge>
                  </div>
                </div>

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-8 space-y-3">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Uploaded Documents ({uploadedFiles.length})
                    </h4>
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-[#13B5EA] transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{file.name}</p>
                            <p className="text-sm text-gray-600">
                              {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-500 text-white">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Ready
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between mt-8 pt-6 border-t">
                  <Button variant="outline" onClick={handlePrevious}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-[#13B5EA] to-[#0E7C9E] text-white"
                    onClick={handleNext}
                    disabled={uploadedFiles.length === 0}
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 4: AI Verification */}
        {currentStep === 'verification' && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <Card>
              <CardHeader>
                <CardTitle>AI Verification</CardTitle>
                <CardDescription>
                  Our AI will verify all documents and run compliance checks
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!processing ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                      <Sparkles className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to Verify</h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      We'll run 6 automated checks including identity verification, AML screening, entity validation, and risk scoring.
                    </p>
                    
                    <div className="grid grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
                      {[
                        { label: 'Identity Check', icon: Users },
                        { label: 'AML Screening', icon: Shield },
                        { label: 'Entity Validation', icon: Building2 },
                        { label: 'Risk Scoring', icon: TrendingUp },
                        { label: 'Document OCR', icon: FileText },
                        { label: 'Ownership Mapping', icon: Globe }
                      ].map((check, idx) => {
                        const CheckIcon = check.icon;
                        return (
                          <div key={idx} className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                            <CheckIcon className="w-6 h-6 text-[#13B5EA] mx-auto mb-2" />
                            <p className="text-xs font-semibold text-gray-700">{check.label}</p>
                          </div>
                        );
                      })}
                    </div>

                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8"
                      onClick={startVerification}
                    >
                      <PlayCircle className="w-5 h-5 mr-2" />
                      Start AI Verification
                    </Button>
                  </div>
                ) : (
                  <div className="py-12">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-spin">
                      <Activity className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 text-center mb-3">
                      Running AI Verification...
                    </h3>
                    <p className="text-gray-600 text-center mb-8">
                      Please wait while we verify all information
                    </p>
                    <Progress value={66} className="max-w-md mx-auto" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 5: Review */}
        {currentStep === 'review' && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <Card>
              <CardHeader>
                <CardTitle>Review & Complete</CardTitle>
                <CardDescription>
                  All checks passed! Review and confirm to complete onboarding.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Verification Results */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'Identity Verified', status: 'pass', score: 98 },
                      { label: 'AML Screening', status: 'pass', score: 100 },
                      { label: 'Risk Score', status: 'pass', score: 15 }
                    ].map((result, idx) => (
                      <div key={idx} className="p-4 bg-green-50 rounded-xl border-2 border-green-200">
                        <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
                        <p className="font-semibold text-gray-900">{result.label}</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">{result.score}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-8 pt-6 border-t">
                    <Button variant="outline" onClick={handlePrevious}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8"
                      onClick={completeOnboarding}
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Complete Onboarding
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 6: Complete */}
        {currentStep === 'complete' && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">🎉 All Done!</h2>
                <p className="text-gray-600 mb-8 text-lg">
                  Client has been successfully onboarded and verified.
                </p>
                <div className="flex items-center justify-center gap-4">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => {
                      setCurrentStep('type');
                      setClientType(null);
                      setUploadedFiles([]);
                    }}
                  >
                    Add Another Client
                  </Button>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-[#13B5EA] to-[#0E7C9E] text-white"
                    onClick={onBack}
                  >
                    Back to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

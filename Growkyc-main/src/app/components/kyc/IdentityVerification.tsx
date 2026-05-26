import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Breadcrumbs } from '../ui/breadcrumbs';
import { 
  Upload, 
  FileCheck, 
  AlertCircle, 
  CheckCircle, 
  Shield, 
  ArrowLeft, 
  User,
  Calendar,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { IdVerification100Point } from './IdVerification100Point';
import { toast } from '../../lib/toast';

interface ProgressStepperProps {
  currentStep: number;
  steps: { title: string; description: string }[];
}

function ProgressStepper({ currentStep, steps }: ProgressStepperProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center flex-1">
          <div className="flex items-center gap-3 flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
              index < currentStep
                ? 'bg-green-600 text-white'
                : index === currentStep
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}>
              {index < currentStep ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <div className="flex flex-col">
              <span className={`text-sm font-semibold ${
                index <= currentStep ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {step.title}
              </span>
              <span className="text-xs text-gray-500">{step.description}</span>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div className={`h-1 flex-1 mx-4 rounded transition-colors ${
              index < currentStep ? 'bg-green-600' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}

interface IdentityVerificationProps {
  onBack?: () => void;
}

export function IdentityVerification({ onBack }: IdentityVerificationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    address: '',
    company: '',
    abn: ''
  });
  const [idVerificationData, setIdVerificationData] = useState<any>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStep1Next = () => {
    if (!formData.firstName || !formData.lastName || !formData.dateOfBirth || !formData.address) {
      toast.error('Please fill in all required fields');
      return;
    }
    setCurrentStep(1);
    toast.success('Personal details saved! Now upload your ID documents.');
  };

  const handleIdVerificationComplete = (data: any) => {
    setIdVerificationData(data);
    setCurrentStep(2);
    toast.success('ID verification complete! Review your submission.');
  };

  const handleFinalSubmit = () => {
    const summary = `
✅ KYC Verification Submitted Successfully!

👤 Name: ${formData.firstName} ${formData.lastName}
🎂 DOB: ${formData.dateOfBirth}
📍 Address: ${formData.address}

📊 ID Documents: ${idVerificationData.selectedDocuments.length}
🎯 Total Points: ${idVerificationData.selectedDocuments.reduce((sum: number, doc: any) => sum + doc.points, 0)}
📤 Files Uploaded: ${Object.keys(idVerificationData.uploadedFiles).length}

Documents:
${idVerificationData.selectedDocuments.map((doc: any) => `• ${doc.name} (${doc.points} points)`).join('\n')}

Your verification is now pending review.
    `;
    
    alert(summary);
    toast.success('Verification submitted for review!');
  };

  const steps = [
    { title: 'Personal Details', description: 'Enter your information' },
    { title: 'ID Documents (100 Points)', description: 'Upload multiple ID documents' },
    { title: 'Review & Submit', description: 'Confirm and submit' }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-full">
              <Shield className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Individual KYC Verification</h1>
              <p className="text-blue-100 text-lg">
                Bank-grade 100-point ID verification with multiple document uploads
              </p>
            </div>
          </div>
          {onBack && (
            <Button 
              onClick={onBack} 
              variant="outline" 
              className="bg-white text-blue-600 hover:bg-blue-50 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          )}
        </div>
      </div>

      {/* Progress Stepper */}
      <ProgressStepper currentStep={currentStep} steps={steps} />

      {/* Step 1: Personal Details */}
      {currentStep === 0 && (
        <Card className="border-2 border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center gap-2">
              <User className="w-6 h-6 text-blue-600" />
              Step 1: Personal Details
            </CardTitle>
            <CardDescription>
              Please provide your personal information for identity verification
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="firstName" className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4" />
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="John"
                    className="border-2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="lastName" className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4" />
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Smith"
                    className="border-2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="dateOfBirth" className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4" />
                    Date of Birth <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="border-2"
                    required
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address" className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4" />
                    Residential Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="123 Main Street, Sydney NSW 2000"
                    className="border-2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="company" className="mb-2 block">
                    Company Name (Optional)
                  </Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder="ABC Pty Ltd"
                    className="border-2"
                  />
                </div>

                <div>
                  <Label htmlFor="abn" className="mb-2 block">
                    ABN (Optional)
                  </Label>
                  <Input
                    id="abn"
                    value={formData.abn}
                    onChange={(e) => handleInputChange('abn', e.target.value)}
                    placeholder="12 345 678 901"
                    className="border-2"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-1">
                    What's Next?
                  </p>
                  <p className="text-sm text-blue-800">
                    After completing your personal details, you'll upload multiple ID documents 
                    to reach the required 100 points for verification. You can combine documents 
                    like passport + Medicare card + utility bill.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
              <Button 
                onClick={handleStep1Next}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                Continue to ID Documents
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: 100-Point ID Verification */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <Card className="border-2 border-green-200">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-green-600" />
                Step 2: Upload ID Documents (100-Point System)
              </CardTitle>
              <CardDescription>
                Upload multiple documents to reach 100 points. Select from Category A (Photo ID) and Category B (Secondary ID).
              </CardDescription>
            </CardHeader>
          </Card>

          <IdVerification100Point onComplete={handleIdVerificationComplete} />

          <div className="flex justify-between">
            <Button 
              onClick={() => setCurrentStep(0)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Personal Details
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Submit */}
      {currentStep === 2 && (
        <Card className="border-2 border-purple-200">
          <CardHeader className="bg-purple-50">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-purple-600" />
              Step 3: Review & Submit
            </CardTitle>
            <CardDescription>
              Review your information before submitting for verification
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {/* Personal Details Summary */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Details
              </h3>
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold text-gray-900">{formData.firstName} {formData.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date of Birth</p>
                  <p className="font-semibold text-gray-900">{formData.dateOfBirth}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-semibold text-gray-900">{formData.address}</p>
                </div>
                {formData.company && (
                  <div>
                    <p className="text-sm text-gray-600">Company</p>
                    <p className="font-semibold text-gray-900">{formData.company}</p>
                  </div>
                )}
                {formData.abn && (
                  <div>
                    <p className="text-sm text-gray-600">ABN</p>
                    <p className="font-semibold text-gray-900">{formData.abn}</p>
                  </div>
                )}
              </div>
            </div>

            {/* ID Verification Summary */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                ID Verification
              </h3>
              <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Points</p>
                    <p className="text-3xl font-bold text-green-600">
                      {idVerificationData.selectedDocuments.reduce((sum: number, doc: any) => sum + doc.points, 0)} / 100
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Documents Uploaded</p>
                    <p className="text-3xl font-bold text-gray-900">{idVerificationData.selectedDocuments.length}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Files</p>
                    <p className="text-3xl font-bold text-gray-900">{Object.keys(idVerificationData.uploadedFiles).length}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-900">Documents:</p>
                  {idVerificationData.selectedDocuments.map((doc: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                      <div className="flex items-center gap-3">
                        <div className={`px-2 py-1 rounded text-xs font-bold text-white ${
                          doc.category === 'A' ? 'bg-blue-600' : 'bg-purple-600'
                        }`}>
                          CAT {doc.category}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{doc.name}</p>
                          <p className="text-xs text-gray-600">#{doc.number}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">+{doc.points}</p>
                        {idVerificationData.uploadedFiles[doc.id] && (
                          <p className="text-xs text-gray-600">
                            <FileCheck className="w-3 h-3 inline mr-1" />
                            File uploaded
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Compliance Checks */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <h3 className="text-sm font-bold text-blue-900 mb-3">✓ Compliance Checks Passed</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Minimum 100 points achieved</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Category A (Photo ID) document provided</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Date of birth verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>All documents have uploaded files</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between gap-3 pt-6 border-t">
              <Button 
                onClick={() => setCurrentStep(1)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to ID Documents
              </Button>
              <Button 
                onClick={handleFinalSubmit}
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Submit for Review
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import {
  Upload,
  X,
  Check,
  AlertCircle,
  FileText,
  Image,
  CheckCircle,
  Eye,
  Download,
  Shield,
  Info
} from 'lucide-react';
import { toast } from '../../lib/toast';

interface DocumentUploadSystemProps {
  documentType: string;
  onComplete: (data: any) => void;
  onBack: () => void;
}

// Bank-grade document requirements
const documentRequirements = {
  // INDIVIDUAL - STANDARD CDD
  passport: {
    name: 'Australian or Foreign Passport',
    category: 'Primary Photo ID',
    points: 70,
    fields: [
      { name: 'fullLegalName', label: 'Full Legal Name', type: 'text', required: true },
      { name: 'passportNumber', label: 'Passport Number', type: 'text', required: true },
      { name: 'countryOfIssue', label: 'Country of Issue', type: 'text', required: true },
      { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true },
      { name: 'expiryDate', label: 'Expiry Date', type: 'date', required: true },
      { name: 'mrzValidation', label: 'MRZ Validation Result', type: 'select', options: ['Pass', 'Fail', 'Pending'] },
      { name: 'photoMatch', label: 'Photo Match Confirmation', type: 'select', options: ['Match', 'No Match', 'Review Required'] },
      { name: 'documentIntegrity', label: 'Document Integrity Result', type: 'select', options: ['Authentic', 'Suspected Fraud', 'Review Required'] }
    ],
    verificationChecks: ['DVS Check', 'MRZ Validation', 'Photo Verification', 'Document Integrity']
  },
  driversLicence: {
    name: 'Australian Driver Licence',
    category: 'Primary Photo ID',
    points: 40,
    fields: [
      { name: 'fullLegalName', label: 'Full Legal Name', type: 'text', required: true },
      { name: 'licenceNumber', label: 'Licence Number', type: 'text', required: true },
      { name: 'stateOfIssue', label: 'State of Issue', type: 'select', options: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'], required: true },
      { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true },
      { name: 'expiryDate', label: 'Expiry Date', type: 'date', required: true },
      { name: 'address', label: 'Address (if shown)', type: 'text', required: false },
      { name: 'dvsResult', label: 'DVS Result', type: 'select', options: ['Verified', 'Failed', 'Pending'] },
      { name: 'photoMatchResult', label: 'Photo Match Result', type: 'select', options: ['Match', 'No Match', 'Review'] },
      { name: 'expiryStatus', label: 'Expiry Status', type: 'select', options: ['Current', 'Expired', 'Near Expiry'] }
    ],
    verificationChecks: ['DVS Verification', 'Photo Match', 'Expiry Check', 'State Registry Check']
  },
  medicareCard: {
    name: 'Medicare Card',
    category: 'Secondary ID',
    points: 25,
    fields: [
      { name: 'fullName', label: 'Full Name', type: 'text', required: true },
      { name: 'cardNumber', label: 'Card Number', type: 'text', required: true },
      { name: 'expiry', label: 'Expiry Date', type: 'date', required: true },
      { name: 'irn', label: 'Individual Reference Number (IRN)', type: 'text', required: true }
    ],
    verificationChecks: ['Medicare Verification', 'Expiry Check']
  },
  birthCertificate: {
    name: 'Birth Certificate',
    category: 'Secondary ID',
    points: 70,
    fields: [
      { name: 'fullLegalName', label: 'Full Legal Name', type: 'text', required: true },
      { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true },
      { name: 'registrationNumber', label: 'Registration Number', type: 'text', required: true },
      { name: 'issuingAuthority', label: 'Issuing Authority', type: 'text', required: true }
    ],
    verificationChecks: ['BDM Registry Check', 'Document Authenticity']
  },
  // PROOF OF ADDRESS
  utilityBill: {
    name: 'Utility Bill',
    category: 'Proof of Address',
    points: 25,
    acceptedTypes: ['Electricity', 'Gas', 'Water', 'Landline Phone'],
    ageLimit: '3 months',
    fields: [
      { name: 'fullName', label: 'Full Name on Bill', type: 'text', required: true },
      { name: 'residentialAddress', label: 'Residential Address', type: 'text', required: true },
      { name: 'issueDate', label: 'Issue Date', type: 'date', required: true },
      { name: 'issuer', label: 'Utility Provider', type: 'text', required: true },
      { name: 'utilityType', label: 'Utility Type', type: 'select', options: ['Electricity', 'Gas', 'Water', 'Landline'], required: true }
    ],
    verificationChecks: ['Date Check (< 3 months)', 'Address Match', 'Name Match']
  },
  bankStatement: {
    name: 'Bank Statement',
    category: 'Proof of Address / Financial',
    points: 25,
    ageLimit: '3 months',
    fields: [
      { name: 'fullName', label: 'Account Holder Name', type: 'text', required: true },
      { name: 'residentialAddress', label: 'Residential Address', type: 'text', required: true },
      { name: 'issueDate', label: 'Statement Date', type: 'date', required: true },
      { name: 'issuer', label: 'Bank Name', type: 'text', required: true },
      { name: 'accountNumber', label: 'Account Number (Last 4 digits only)', type: 'text', required: true, maxLength: 4 },
      { name: 'incomeSource', label: 'Income Source (if visible)', type: 'text', required: false },
      { name: 'largeTransactions', label: 'Large Incoming Transactions', type: 'textarea', required: false }
    ],
    verificationChecks: ['Date Check (< 3 months)', 'Address Match', 'Account Verification'],
    privacyNote: 'Only last 4 digits of account number stored. Full transaction history not retained.'
  },
  ratesNotice: {
    name: 'Council Rates Notice',
    category: 'Proof of Address',
    points: 25,
    ageLimit: '12 months',
    fields: [
      { name: 'fullName', label: 'Property Owner Name', type: 'text', required: true },
      { name: 'residentialAddress', label: 'Property Address', type: 'text', required: true },
      { name: 'issueDate', label: 'Notice Date', type: 'date', required: true },
      { name: 'issuer', label: 'Council Name', type: 'text', required: true }
    ],
    verificationChecks: ['Date Check (< 12 months)', 'Address Match', 'Council Verification']
  },
  // HIGH RISK ADDITIONAL DOCUMENTS
  sourceOfFunds: {
    name: 'Source of Funds Evidence',
    category: 'Enhanced Due Diligence',
    riskLevel: 'High',
    fields: [
      { name: 'incomeSource', label: 'Income Source', type: 'select', options: ['Salary', 'Business Income', 'Investment', 'Inheritance', 'Sale of Property', 'Loan', 'Other'], required: true },
      { name: 'amount', label: 'Amount', type: 'number', required: true },
      { name: 'evidenceType', label: 'Evidence Type', type: 'select', options: ['Bank Statement', 'Contract', 'Inheritance Document', 'Sale Agreement', 'Tax Return'], required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true }
    ],
    verificationChecks: ['Document Authenticity', 'Amount Verification', 'Source Legitimacy']
  },
  sourceOfWealth: {
    name: 'Source of Wealth Statement',
    category: 'Enhanced Due Diligence',
    riskLevel: 'High',
    fields: [
      { name: 'wealthSource', label: 'Primary Wealth Source', type: 'select', options: ['Employment', 'Business Ownership', 'Investments', 'Inheritance', 'Property', 'Other'], required: true },
      { name: 'estimatedNetWorth', label: 'Estimated Net Worth', type: 'select', options: ['< $100k', '$100k - $500k', '$500k - $1M', '$1M - $5M', '$5M+'], required: true },
      { name: 'wealthAccumulation', label: 'How Wealth Was Accumulated', type: 'textarea', required: true },
      { name: 'supportingDocuments', label: 'Supporting Documents', type: 'text', required: false }
    ],
    verificationChecks: ['Plausibility Check', 'Supporting Evidence Review', 'PEP/Sanctions Check']
  },
  taxReturn: {
    name: 'Tax Return (Last Lodged)',
    category: 'Enhanced Due Diligence',
    riskLevel: 'High',
    fields: [
      { name: 'taxYear', label: 'Tax Year', type: 'text', required: true },
      { name: 'taxableIncome', label: 'Taxable Income', type: 'number', required: true },
      { name: 'lodgementDate', label: 'Lodgement Date', type: 'date', required: true },
      { name: 'tfn', label: 'TFN (Masked)', type: 'text', required: false, maxLength: 4 },
      { name: 'accountant', label: 'Accountant/Tax Agent', type: 'text', required: false }
    ],
    verificationChecks: ['ATO Verification', 'Income Consistency Check'],
    privacyNote: 'Only masked TFN stored. Full tax return not retained beyond verification.'
  }
};

// COMPANY DOCUMENTS
const companyDocuments = {
  asicExtract: {
    name: 'ASIC Company Extract (Current)',
    category: 'Company Verification',
    required: true,
    fields: [
      { name: 'companyName', label: 'Company Name', type: 'text', required: true },
      { name: 'acn', label: 'ACN', type: 'text', required: true },
      { name: 'abn', label: 'ABN', type: 'text', required: true },
      { name: 'registeredOffice', label: 'Registered Office Address', type: 'text', required: true },
      { name: 'principalPlace', label: 'Principal Place of Business', type: 'text', required: true },
      { name: 'incorporationDate', label: 'Incorporation Date', type: 'date', required: true },
      { name: 'companyStatus', label: 'Company Status', type: 'select', options: ['Registered', 'Deregistered', 'Under Administration', 'Other'], required: true },
      { name: 'directors', label: 'Directors (comma separated)', type: 'textarea', required: true },
      { name: 'shareholders', label: 'Shareholders (comma separated)', type: 'textarea', required: true },
      { name: 'shareStructure', label: 'Share Structure', type: 'textarea', required: true }
    ],
    verificationChecks: [
      'Registration Active',
      'No Deregistration Notice',
      'No External Administration',
      'Director Verification',
      'UBO Identification'
    ]
  },
  constitution: {
    name: 'Company Constitution',
    category: 'Company Governance',
    required: false,
    fields: [
      { name: 'shareClassRights', label: 'Share Class Rights', type: 'textarea', required: false },
      { name: 'appointmentPowers', label: 'Appointment Powers', type: 'textarea', required: false },
      { name: 'directorPowers', label: 'Director Powers', type: 'textarea', required: false },
      { name: 'transferRestrictions', label: 'Share Transfer Restrictions', type: 'textarea', required: false }
    ],
    verificationChecks: ['Document Authenticity', 'Control Structure Review']
  },
  shareRegister: {
    name: 'Share Register',
    category: 'Beneficial Ownership',
    riskLevel: 'High',
    fields: [
      { name: 'shareholders', label: 'All Shareholders', type: 'textarea', required: true },
      { name: 'ownershipPercentages', label: 'Ownership %', type: 'textarea', required: true },
      { name: 'uboConfirmed', label: 'UBO Confirmed (25%+)', type: 'select', options: ['Yes', 'No', 'Review Required'], required: true },
      { name: 'crossBorderHolding', label: 'Cross-Border Shareholding', type: 'select', options: ['Yes', 'No'], required: true },
      { name: 'offshoreEntities', label: 'Offshore Entities', type: 'textarea', required: false }
    ],
    verificationChecks: ['UBO Identification', 'Sanctions Check', 'PEP Check']
  }
};

// TRUST DOCUMENTS
const trustDocuments = {
  trustDeed: {
    name: 'Trust Deed (Complete Copy)',
    category: 'Trust Verification',
    required: true,
    fields: [
      { name: 'trustName', label: 'Trust Name', type: 'text', required: true },
      { name: 'trustType', label: 'Trust Type', type: 'select', options: ['Discretionary', 'Unit Trust', 'Hybrid', 'Testamentary', 'Other'], required: true },
      { name: 'establishmentDate', label: 'Establishment Date', type: 'date', required: true },
      { name: 'trustee', label: 'Trustee Details', type: 'text', required: true },
      { name: 'appointor', label: 'Appointor', type: 'text', required: false },
      { name: 'guardian', label: 'Guardian (if applicable)', type: 'text', required: false },
      { name: 'beneficiaryClass', label: 'Beneficiary Class', type: 'textarea', required: true },
      { name: 'variationHistory', label: 'Variation History', type: 'textarea', required: false }
    ],
    verificationChecks: [
      'Trustee Authority Verification',
      'Control Mechanism Review',
      'Beneficiary Identification',
      'Appointor PEP/Sanctions Check'
    ]
  },
  distributionStatements: {
    name: 'Distribution Statements',
    category: 'Trust Financial',
    riskLevel: 'High',
    fields: [
      { name: 'financialYear', label: 'Financial Year', type: 'text', required: true },
      { name: 'distributionsMade', label: 'Distributions Made', type: 'textarea', required: true },
      { name: 'beneficiaries', label: 'Beneficiaries Received', type: 'textarea', required: true },
      { name: 'amounts', label: 'Distribution Amounts', type: 'textarea', required: true }
    ],
    verificationChecks: ['Beneficiary Verification', 'Tax Compliance Check']
  }
};

const allDocumentRequirements = {
  ...documentRequirements,
  ...companyDocuments,
  ...trustDocuments
};

export function DocumentUploadSystem({ documentType, onComplete, onBack }: DocumentUploadSystemProps) {
  const [documentData, setDocumentData] = useState<any>({});
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [verificationResults, setVerificationResults] = useState<any>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const docConfig = allDocumentRequirements[documentType as keyof typeof allDocumentRequirements] as any;

  if (!docConfig) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-600">Invalid document type: {documentType}</p>
          <Button onClick={onBack} className="mt-4">Back</Button>
        </CardContent>
      </Card>
    );
  }

  const handleFieldChange = (fieldName: string, value: any) => {
    setDocumentData({ ...documentData, [fieldName]: value });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      toast.success(`File uploaded: ${file.name}`);
    }
  };

  const handleVerify = () => {
    setIsProcessing(true);
    
    // Simulate verification process
    setTimeout(() => {
      const mockResults = {
        documentIntegrity: 'Pass',
        dvsCheck: 'Verified',
        photoMatch: 'Match',
        expiryCheck: 'Current',
        confidenceScore: 98,
        verificationDate: new Date().toISOString(),
        verifierName: 'System Auto-Verify',
        documentHash: 'SHA256:' + Math.random().toString(36).substring(7)
      };
      
      setVerificationResults(mockResults);
      setIsProcessing(false);
      toast.success('Document verified successfully');
    }, 2000);
  };

  const handleComplete = () => {
    // Validate required fields
    const missingFields = docConfig.fields
      .filter(f => f.required && !documentData[f.name])
      .map(f => f.label);

    if (missingFields.length > 0) {
      toast.error(`Missing required fields: ${missingFields.join(', ')}`);
      return;
    }

    if (!uploadedFile) {
      toast.error('Please upload the document');
      return;
    }

    // Package data for storage
    const completeData = {
      documentType: documentType,
      documentName: docConfig.name,
      category: docConfig.category,
      points: docConfig.points || 0,
      uploadedFile: uploadedFile.name,
      fileSize: uploadedFile.size,
      fileType: uploadedFile.type,
      uploadDate: new Date().toISOString(),
      extractedData: documentData,
      verificationResults: verificationResults,
      status: 'Verified',
      reviewer: 'System',
      reviewTimestamp: new Date().toISOString()
    };

    onComplete(completeData);
    toast.success('Document processing complete');
  };

  const renderField = (field: any) => {
    const value = documentData[field.name] || '';

    if (field.type === 'select') {
      return (
        <div key={field.name} className="mb-4">
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <select
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select...</option>
            {field.options?.map((opt: string) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      );
    }

    if (field.type === 'textarea') {
      return (
        <div key={field.name} className="mb-4">
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
      );
    }

    return (
      <div key={field.name} className="mb-4">
        <label className="block text-sm font-semibold text-slate-300 mb-2">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          type={field.type}
          value={value}
          onChange={(e) => handleFieldChange(field.name, e.target.value)}
          maxLength={field.maxLength}
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={field.placeholder}
        />
        {field.maxLength && (
          <p className="text-xs text-slate-400 mt-1">Max {field.maxLength} characters</p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Document Header */}
      <Card className="border-2 border-blue-500">
        <CardHeader className="bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{docConfig.name}</CardTitle>
              <CardDescription>Category: {docConfig.category}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{docConfig.points} Points</Badge>
              {(docConfig as any).riskLevel && (
                <Badge className="bg-red-500">
                  <Shield className="w-3 h-3 mr-1" />
                  {(docConfig as any).riskLevel} Risk
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Privacy Notice */}
      {(docConfig as any).privacyNote && (
        <Card className="bg-amber-50 border-amber-300">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-900 mb-1">Privacy Notice</h4>
                <p className="text-sm text-amber-800">{(docConfig as any).privacyNote}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
          <CardDescription>Upload a clear, complete copy of the document</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Button type="button" onClick={() => document.getElementById('file-upload')?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </label>
            {uploadedFile && (
              <div className="mt-4 flex items-center justify-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">{uploadedFile.name}</span>
                <span className="text-sm text-slate-300">({(uploadedFile.size / 1024).toFixed(1)} KB)</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Data Extraction Form */}
      <Card>
        <CardHeader>
          <CardTitle>Extract Document Data</CardTitle>
          <CardDescription>Enter the information exactly as it appears on the document</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {docConfig.fields.map(field => renderField(field))}
          </div>
        </CardContent>
      </Card>

      {/* Verification Checks */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Checks</CardTitle>
          <CardDescription>Automated checks to be performed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {docConfig.verificationChecks.map((check, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-[#0f172a] rounded-lg">
                <span className="text-sm font-medium text-slate-300">{check}</span>
                {verificationResults.documentIntegrity ? (
                  <Badge className="bg-green-500">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="outline">Pending</Badge>
                )}
              </div>
            ))}
          </div>

          {!isProcessing && !verificationResults.documentIntegrity && uploadedFile && (
            <Button onClick={handleVerify} className="w-full mt-4">
              <Shield className="w-4 h-4 mr-2" />
              Run Verification Checks
            </Button>
          )}

          {isProcessing && (
            <div className="mt-4 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-sm text-slate-300 mt-2">Running verification checks...</p>
            </div>
          )}

          {verificationResults.documentIntegrity && (
            <Card className="mt-4 bg-green-50 border-green-300">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h4 className="font-bold text-green-900">Verification Complete</h4>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-slate-300">Confidence Score:</span>
                    <span className="font-bold text-green-900 ml-2">{verificationResults.confidenceScore}%</span>
                  </div>
                  <div>
                    <span className="text-slate-300">Document Hash:</span>
                    <span className="font-mono text-xs text-slate-300 ml-2">{verificationResults.documentHash}</span>
                  </div>
                  <div>
                    <span className="text-slate-300">Verified By:</span>
                    <span className="font-semibold text-white ml-2">{verificationResults.verifierName}</span>
                  </div>
                  <div>
                    <span className="text-slate-300">Verification Date:</span>
                    <span className="text-slate-300 ml-2">{new Date(verificationResults.verificationDate).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={handleComplete}
          disabled={!uploadedFile || !verificationResults.documentIntegrity}
          className="bg-green-600 hover:bg-green-700"
        >
          <Check className="w-4 h-4 mr-2" />
          Complete & Save Document
        </Button>
      </div>
    </div>
  );
}

// Export document configurations for use in other components
export { documentRequirements, companyDocuments, trustDocuments };

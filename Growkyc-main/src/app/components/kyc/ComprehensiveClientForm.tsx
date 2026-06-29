import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { useAuth } from '../../../context/AuthContext';
import {
  User,
  Building2,
  Shield,
  FileText,
  Upload,
  Check,
  ChevronRight,
  ChevronLeft,
  X,
  AlertCircle,
  Info,
  Users,
  MapPin,
  Calendar,
  Globe,
  DollarSign,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from '../../lib/toast';
import { IdVerification100Point } from './IdVerification100Point';

interface ComprehensiveClientFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

type ClientType = 'individual' | 'company' | 'trust' | 'partnership' | 'soletrader' | 'government';
type FormStep = 'type' | 'basic' | 'identification' | 'address' | 'beneficial_owners' | 'documents' | 'additional_searches' | 'risk_assessment' | 'review';

export function ComprehensiveClientForm({ onClose, onSubmit }: ComprehensiveClientFormProps) {
  const { user } = useAuth();
  const isPartner = user?.role === 'partner';
  const [currentStep, setCurrentStep] = useState<FormStep>('type');
  const [clientType, setClientType] = useState<ClientType>('individual');
  
  // 100-Point ID Matrix
  const idDocuments = {
    categoryA: [
      { id: 'au_passport', name: 'Australian Passport (current)', points: 70, photo: true, dob: true, address: false },
      { id: 'foreign_passport', name: 'Foreign Passport (current)', points: 70, photo: true, dob: true, address: false },
      { id: 'au_drivers_licence', name: 'Australian Driver Licence', points: 40, photo: true, dob: true, address: true },
      { id: 'au_proof_age', name: 'Australian Proof of Age Card', points: 40, photo: true, dob: true, address: false },
      { id: 'foreign_national_id', name: 'National ID Card (foreign, govt issued)', points: 40, photo: true, dob: true, address: false }
    ],
    categoryB: [
      { id: 'au_birth_cert', name: 'Australian Birth Certificate', points: 70, photo: false, dob: true, address: false },
      { id: 'au_citizenship', name: 'Australian Citizenship Certificate', points: 70, photo: false, dob: true, address: false },
      { id: 'centrelink_card', name: 'Centrelink Pension Card', points: 40, photo: false, dob: false, address: false },
      { id: 'medicare_card', name: 'Medicare Card', points: 25, photo: false, dob: false, address: false },
      { id: 'utility_bill', name: 'Utility Bill (≤ 3 months)', points: 25, photo: false, dob: false, address: true },
      { id: 'bank_statement', name: 'Bank Statement (≤ 3 months)', points: 25, photo: false, dob: false, address: true },
      { id: 'rates_notice', name: 'Rates Notice', points: 25, photo: false, dob: false, address: true },
      { id: 'credit_card_statement', name: 'Credit Card Statement', points: 25, photo: false, dob: false, address: true },
      { id: 'ato_notice', name: 'ATO Notice of Assessment', points: 25, photo: false, dob: false, address: true }
    ]
  };

  // Individual Data
  const [individualData, setIndividualData] = useState({
    // Basic Information
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: 'Australian',
    countryOfResidence: 'Australia',
    
    // Contact
    email: '',
    phone: '',
    mobile: '',
    
    // Address
    residentialAddress: '',
    city: '',
    state: '',
    postcode: '',
    country: 'Australia',
    sameAsResidential: true,
    mailingAddress: '',
    mailingCity: '',
    mailingState: '',
    mailingPostcode: '',
    mailingCountry: '',
    
    // Identification - 100 Points System
    selectedDocuments: [] as any[],
    uploadedFiles: {} as { [key: string]: File },
    
    // Employment & Source of Wealth
    occupation: '',
    employerName: '',
    employmentStatus: 'employed',
    annualIncome: '',
    sourceOfWealth: '',
    sourceOfFunds: '',
    
    // Risk Assessment
    isPEP: false,
    pepDetails: '',
    isHighRisk: false,
    riskReason: '',
    isInternational: false,
    requiresCertification: false
  });

  // Calculate 100-point total
  const calculatePoints = () => {
    const total = individualData.selectedDocuments.reduce((sum, doc) => sum + doc.points, 0);
    const hasCategoryA = individualData.selectedDocuments.some(doc => doc.category === 'A');
    const dobVerified = individualData.selectedDocuments.some(doc => doc.dob);
    const addressVerified = individualData.selectedDocuments.some(doc => doc.address);
    
    return { total, hasCategoryA, dobVerified, addressVerified };
  };

  const addDocument = (doc: any, category: 'A' | 'B', docDetails: any) => {
    const newDoc = {
      ...doc,
      category,
      ...docDetails,
      addedAt: new Date().toISOString()
    };
    
    setIndividualData({
      ...individualData,
      selectedDocuments: [...individualData.selectedDocuments, newDoc]
    });
  };

  const removeDocument = (docId: string) => {
    setIndividualData({
      ...individualData,
      selectedDocuments: individualData.selectedDocuments.filter(d => d.id !== docId)
    });
  };
  
  // Company Data
  const [companyData, setCompanyData] = useState({
    companyName: '',
    acn: '',
    abn: '',
    registeredOffice: '',
    principalPlace: '',
    incorporationDate: '',
    companyStatus: 'active',
    companyType: 'proprietary',
    
    // Directors (array)
    directors: [] as any[],
    
    // Shareholders/Beneficial Owners (array)
    beneficialOwners: [] as any[],
    
    // Company Details
    industryType: '',
    businessActivity: '',
    numberOfEmployees: '',
    annualRevenue: '',
    
    // Risk
    hasOffshoreOwnership: false,
    offshoreDetails: '',
    isPubliclyListed: false,
    stockExchange: ''
  });
  
  // Trust Data
  const [trustData, setTrustData] = useState({
    trustName: '',
    trustType: 'discretionary',
    establishmentDate: '',
    abn: '',
    tfn: '',
    
    // Trustee
    trusteeType: 'individual',
    trusteeName: '',
    trusteeACN: '',
    
    // Appointor
    hasAppointor: false,
    appointorName: '',
    appointorDOB: '',
    appointorAddress: '',
    
    // Guardian
    hasGuardian: false,
    guardianName: '',
    
    // Beneficiaries
    beneficiaryClass: '',
    fixedBeneficiaries: [] as any[],
    
    // Settlor
    settlorName: '',
    settlementAmount: '',
    
    // Risk
    hasDistributions: false,
    distributionDetails: ''
  });
  
  // Documents to collect
  const [documentsChecklist, setDocumentsChecklist] = useState({
    // Individual
    primaryPhotoId: false,
    secondaryId: false,
    proofOfAddress: false,
    sourceOfFundsDoc: false,
    sourceOfWealthDoc: false,
    taxReturn: false,
    
    // Company
    asicExtract: false,
    constitution: false,
    shareRegister: false,
    financialStatements: false,
    directorIds: false,
    beneficialOwnerIds: false,
    
    // Trust
    trustDeed: false,
    trusteeId: false,
    appointorId: false,
    distributionStatements: false,
    
    // Other
    certifiedCopies: false,
    notarizedDocs: false,
    internationalRegistry: false
  });

  // Additional Searches & Verification
  const [additionalSearches, setAdditionalSearches] = useState({
    // Search selections
    asicSearch: true,
    directorSearch: true,
    beneficialOwnerSearch: true,
    relatedEntitySearch: false,
    adverseMediaSearch: true,
    sanctionsScreening: true,
    pepScreening: true,
    creditCheck: false,
    bankruptcySearch: false,
    litigationSearch: false,
    
    // Cost acknowledgment
    acknowledgedCosts: false,
    
    // Estimated entities
    estimatedDirectors: 2,
    estimatedBeneficialOwners: 1,
    estimatedRelatedEntities: 0
  });

  // Search cost structure
  const searchCosts: Record<string, { perEntity: number; name: string; mandatory?: boolean }> = {
    asicSearch: { perEntity: 12.00, name: 'ASIC Company Extract', mandatory: true },
    directorSearch: { perEntity: 8.50, name: 'Director ID Verification', mandatory: true },
    beneficialOwnerSearch: { perEntity: 8.50, name: 'Beneficial Owner Verification', mandatory: true },
    relatedEntitySearch: { perEntity: 15.00, name: 'Related Entity Search' },
    adverseMediaSearch: { perEntity: 5.00, name: 'Adverse Media Screening', mandatory: true },
    sanctionsScreening: { perEntity: 3.50, name: 'Sanctions Screening (DFAT/OFAC)', mandatory: true },
    pepScreening: { perEntity: 3.50, name: 'PEP Screening', mandatory: true },
    creditCheck: { perEntity: 18.00, name: 'Credit Bureau Check' },
    bankruptcySearch: { perEntity: 12.00, name: 'Bankruptcy/Insolvency Search' },
    litigationSearch: { perEntity: 15.00, name: 'Court/Litigation Search' }
  };

  // Calculate total search costs
  const calculateSearchCosts = () => {
    let totalCost = 0;
    let breakdown: any[] = [];

    const baseEntity = 1;
    const directors = clientType === 'company' ? (companyData.directors.length || additionalSearches.estimatedDirectors || 2) : 0;
    const beneficialOwners = clientType === 'company' || clientType === 'trust' 
      ? (companyData.beneficialOwners.length || additionalSearches.estimatedBeneficialOwners || 1) 
      : 0;
    const relatedEntities = additionalSearches.relatedEntitySearch ? (additionalSearches.estimatedRelatedEntities || 0) : 0;

    Object.keys(additionalSearches).forEach((key) => {
      if (searchCosts[key] && (additionalSearches as any)[key]) {
        let entityCount = baseEntity;
        
        if (key === 'directorSearch') entityCount = directors;
        else if (key === 'beneficialOwnerSearch') entityCount = beneficialOwners;
        else if (key === 'relatedEntitySearch') entityCount = relatedEntities;
        else if (key === 'asicSearch' && clientType !== 'company') entityCount = 0;

        if (entityCount > 0) {
          const cost = searchCosts[key].perEntity * entityCount;
          totalCost += cost;
          breakdown.push({
            name: searchCosts[key].name,
            perEntity: searchCosts[key].perEntity,
            entityCount,
            totalCost: cost,
            mandatory: searchCosts[key].mandatory || false
          });
        }
      }
    });

    return { totalCost, breakdown, totalEntities: baseEntity + directors + beneficialOwners + relatedEntities };
  };

  const steps: { id: FormStep; label: string; icon: any }[] = [
    { id: 'type', label: 'Client Type', icon: Users },
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'identification', label: 'ID Documents', icon: FileText },
    { id: 'address', label: 'Address', icon: MapPin },
    { id: 'beneficial_owners', label: 'Beneficial Owners', icon: Shield },
    { id: 'documents', label: 'Documents', icon: Upload },
    { id: 'additional_searches', label: 'Searches & Costs', icon: DollarSign },
    { id: 'risk_assessment', label: 'Risk Assessment', icon: AlertCircle },
    { id: 'review', label: 'Review', icon: CheckCircle }
  ];

  const getStepIndex = () => steps.findIndex(s => s.id === currentStep);

  const handleNext = () => {
    const currentIndex = getStepIndex();
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const handleBack = () => {
    const currentIndex = getStepIndex();
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const handleSubmit = () => {
    const formData = {
      clientType,
      individual: clientType === 'individual' || clientType === 'soletrader' ? individualData : null,
      company: clientType === 'company' ? companyData : null,
      trust: clientType === 'trust' ? trustData : null,
      documents: documentsChecklist,
      submittedAt: new Date().toISOString()
    };
    
    onSubmit(formData);
    toast.success('Client onboarding initiated successfully!');
  };

  // Render Client Type Selection
  const renderClientTypeStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-slate-100 mb-2">Select Client Type</h3>
        <p className="text-slate-300">Choose the type of entity you're onboarding</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { type: 'individual', label: 'Individual', icon: User, description: 'Personal client - Standard CDD' },
          { type: 'company', label: 'Company', icon: Building2, description: 'Corporate entity - ASIC registered' },
          { type: 'trust', label: 'Trust', icon: Shield, description: 'Trust structure - Trustee verification' },
          { type: 'partnership', label: 'Partnership', icon: Users, description: 'Business partnership' },
          { type: 'soletrader', label: 'Sole Trader', icon: User, description: 'Individual + ABN' },
          { type: 'government', label: 'Government Body', icon: Building2, description: 'Government entity' }
        ].map((option) => {
          const Icon = option.icon;
          const isSelected = clientType === option.type;
          
          return (
            <Card
              key={option.type}
              className={`cursor-pointer transition-all border-2 ${
                isSelected ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-blue-300'
              }`}
              onClick={() => setClientType(option.type as ClientType)}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  isSelected ? 'bg-blue-600' : 'bg-white/10'
                }`}>
                  <Icon className={`w-8 h-8 ${isSelected ? 'text-white' : 'text-slate-300'}`} />
                </div>
                <h4 className="font-bold text-slate-100 mb-2">{option.label}</h4>
                <p className="text-sm text-slate-300">{option.description}</p>
                {isSelected && (
                  <Badge className="mt-3 bg-blue-600">
                    <Check className="w-3 h-3 mr-1" />
                    Selected
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={handleNext}>
          Continue
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  // Render Basic Information (Individual)
  const renderBasicInfoStep = () => {
    if (clientType === 'individual' || clientType === 'soletrader') {
      return (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-100 mb-4">Personal Information</h3>

          {/* Name Fields */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={individualData.firstName}
                onChange={(e) => setIndividualData({ ...individualData, firstName: e.target.value })}
                className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Middle Name</label>
              <input
                type="text"
                value={individualData.middleName}
                onChange={(e) => setIndividualData({ ...individualData, middleName: e.target.value })}
                className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
                placeholder="Robert"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={individualData.lastName}
                onChange={(e) => setIndividualData({ ...individualData, lastName: e.target.value })}
                className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
                placeholder="Smith"
              />
            </div>
          </div>

          {/* DOB and Nationality */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={individualData.dateOfBirth}
                onChange={(e) => setIndividualData({ ...individualData, dateOfBirth: e.target.value })}
                className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                <Globe className="w-4 h-4 inline mr-1" />
                Nationality <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={individualData.nationality}
                onChange={(e) => setIndividualData({ ...individualData, nationality: e.target.value })}
                className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
                placeholder="Australian"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Country of Residence <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={individualData.countryOfResidence}
                onChange={(e) => setIndividualData({ ...individualData, countryOfResidence: e.target.value })}
                className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
                placeholder="Australia"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-t pt-6">
            <h4 className="font-bold text-slate-100 mb-4">Contact Information</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={individualData.email}
                  onChange={(e) => setIndividualData({ ...individualData, email: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
                  placeholder="john.smith@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={individualData.phone}
                  onChange={(e) => setIndividualData({ ...individualData, phone: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
                  placeholder="0400 000 000"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Mobile</label>
                <input
                  type="tel"
                  value={individualData.mobile}
                  onChange={(e) => setIndividualData({ ...individualData, mobile: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
                  placeholder="0400 000 000"
                />
              </div>
            </div>
          </div>

          {/* Employment & Income */}
          <div className="border-t pt-6">
            <h4 className="font-bold text-slate-100 mb-4">Employment & Income</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Occupation</label>
                <input
                  type="text"
                  value={individualData.occupation}
                  onChange={(e) => setIndividualData({ ...individualData, occupation: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
                  placeholder="Software Engineer"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Employer Name</label>
                <input
                  type="text"
                  value={individualData.employerName}
                  onChange={(e) => setIndividualData({ ...individualData, employerName: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
                  placeholder="Company Name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Employment Status</label>
                <select
                  value={individualData.employmentStatus}
                  onChange={(e) => setIndividualData({ ...individualData, employmentStatus: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
                >
                  <option value="employed">Employed</option>
                  <option value="self_employed">Self Employed</option>
                  <option value="unemployed">Unemployed</option>
                  <option value="retired">Retired</option>
                  <option value="student">Student</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Annual Income
                </label>
                <select
                  value={individualData.annualIncome}
                  onChange={(e) => setIndividualData({ ...individualData, annualIncome: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
                >
                  <option value="">Select range</option>
                  <option value="0-50k">$0 - $50,000</option>
                  <option value="50k-100k">$50,000 - $100,000</option>
                  <option value="100k-200k">$100,000 - $200,000</option>
                  <option value="200k-500k">$200,000 - $500,000</option>
                  <option value="500k+">$500,000+</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Source of Wealth <span className="text-red-500">*</span>
              </label>
              <textarea
                value={individualData.sourceOfWealth}
                onChange={(e) => setIndividualData({ ...individualData, sourceOfWealth: e.target.value })}
                className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
                rows={2}
                placeholder="Describe how wealth was accumulated (e.g., employment income, business ownership, inheritance, property sales)"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Source of Funds <span className="text-red-500">*</span>
              </label>
              <textarea
                value={individualData.sourceOfFunds}
                onChange={(e) => setIndividualData({ ...individualData, sourceOfFunds: e.target.value })}
                className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
                rows={2}
                placeholder="Describe the source of funds for this engagement (e.g., salary, business profits, sale of assets)"
              />
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={handleBack}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={handleNext}>
              Continue
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      );
    }

    // Company Basic Info
    if (clientType === 'company') {
      return (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-100 mb-4">Company Information</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={companyData.companyName}
                onChange={(e) => setCompanyData({ ...companyData, companyName: e.target.value })}
                className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
                placeholder="Acme Pty Ltd"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                ACN <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={companyData.acn}
                onChange={(e) => setCompanyData({ ...companyData, acn: e.target.value })}
                className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
                placeholder="123 456 789"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                ABN <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={companyData.abn}
                onChange={(e) => setCompanyData({ ...companyData, abn: e.target.value })}
                className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
                placeholder="12 345 678 901"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Incorporation Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={companyData.incorporationDate}
                onChange={(e) => setCompanyData({ ...companyData, incorporationDate: e.target.value })}
                className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Company Status</label>
              <select
                value={companyData.companyStatus}
                onChange={(e) => setCompanyData({ ...companyData, companyStatus: e.target.value })}
                className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="deregistered">Deregistered</option>
                <option value="administration">Under Administration</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Registered Office Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={companyData.registeredOffice}
                onChange={(e) => setCompanyData({ ...companyData, registeredOffice: e.target.value })}
                className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
                placeholder="123 Business St, Sydney NSW 2000"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Principal Place of Business
              </label>
              <input
                type="text"
                value={companyData.principalPlace}
                onChange={(e) => setCompanyData({ ...companyData, principalPlace: e.target.value })}
                className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
                placeholder="456 Office St, Melbourne VIC 3000"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Industry Type</label>
              <input
                type="text"
                value={companyData.industryType}
                onChange={(e) => setCompanyData({ ...companyData, industryType: e.target.value })}
                className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
                placeholder="Financial Services"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Annual Revenue</label>
              <select
                value={companyData.annualRevenue}
                onChange={(e) => setCompanyData({ ...companyData, annualRevenue: e.target.value })}
                className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
              >
                <option value="">Select range</option>
                <option value="0-1m">$0 - $1M</option>
                <option value="1m-10m">$1M - $10M</option>
                <option value="10m-50m">$10M - $50M</option>
                <option value="50m+">$50M+</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={handleBack}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={handleNext}>
              Continue
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      );
    }

    // Trust Basic Info
    if (clientType === 'trust') {
      return (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-100 mb-4">Trust Information</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Trust Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={trustData.trustName}
                onChange={(e) => setTrustData({ ...trustData, trustName: e.target.value })}
                className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
                placeholder="Smith Family Trust"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Trust Type <span className="text-red-500">*</span>
              </label>
              <select
                value={trustData.trustType}
                onChange={(e) => setTrustData({ ...trustData, trustType: e.target.value })}
                className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
              >
                <option value="discretionary">Discretionary Trust</option>
                <option value="unit">Unit Trust</option>
                <option value="hybrid">Hybrid Trust</option>
                <option value="testamentary">Testamentary Trust</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Establishment Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={trustData.establishmentDate}
                onChange={(e) => setTrustData({ ...trustData, establishmentDate: e.target.value })}
                className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">ABN</label>
              <input
                type="text"
                value={trustData.abn}
                onChange={(e) => setTrustData({ ...trustData, abn: e.target.value })}
                className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
                placeholder="12 345 678 901"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">TFN (Masked)</label>
              <input
                type="text"
                value={trustData.tfn}
                onChange={(e) => setTrustData({ ...trustData, tfn: e.target.value })}
                className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
                placeholder="Last 4 digits only"
                maxLength={4}
              />
            </div>
          </div>

          {/* Trustee Information */}
          <div className="border-t pt-6">
            <h4 className="font-bold text-slate-100 mb-4">Trustee Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Trustee Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={trustData.trusteeType}
                  onChange={(e) => setTrustData({ ...trustData, trusteeType: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
                >
                  <option value="individual">Individual</option>
                  <option value="corporate">Corporate</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Trustee Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={trustData.trusteeName}
                  onChange={(e) => setTrustData({ ...trustData, trusteeName: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
                  placeholder="John Smith or ABC Pty Ltd"
                />
              </div>

              {trustData.trusteeType === 'corporate' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Trustee ACN</label>
                  <input
                    type="text"
                    value={trustData.trusteeACN}
                    onChange={(e) => setTrustData({ ...trustData, trusteeACN: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
                    placeholder="123 456 789"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Appointor */}
          <div className="border-t pt-6">
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={trustData.hasAppointor}
                onChange={(e) => setTrustData({ ...trustData, hasAppointor: e.target.checked })}
                className="w-5 h-5"
              />
              <label className="font-bold text-slate-100">Trust has an Appointor</label>
            </div>
            
            {trustData.hasAppointor && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Appointor Name</label>
                  <input
                    type="text"
                    value={trustData.appointorName}
                    onChange={(e) => setTrustData({ ...trustData, appointorName: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    value={trustData.appointorDOB}
                    onChange={(e) => setTrustData({ ...trustData, appointorDOB: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Address</label>
                  <input
                    type="text"
                    value={trustData.appointorAddress}
                    onChange={(e) => setTrustData({ ...trustData, appointorAddress: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Beneficiaries */}
          <div className="border-t pt-6">
            <h4 className="font-bold text-slate-100 mb-4">Beneficiaries</h4>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Beneficiary Class Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={trustData.beneficiaryClass}
                onChange={(e) => setTrustData({ ...trustData, beneficiaryClass: e.target.value })}
                className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
                rows={3}
                placeholder="E.g., Settlor, spouse of settlor, children of settlor, and their lineal descendants"
              />
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={handleBack}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={handleNext}>
              Continue
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      );
    }

    return null;
  };

  // Render Identification Step with 100-Points System
  const renderIdentificationStep = () => {
    // Handler when ID verification is complete
    const handleIdVerificationComplete = (data: any) => {
      setIndividualData({
        ...individualData,
        selectedDocuments: data.selectedDocuments,
        uploadedFiles: data.uploadedFiles
      });
    };

    return (
      <div className="space-y-6">
        <IdVerification100Point 
          onComplete={handleIdVerificationComplete}
        />
      </div>
    );
  };


  // Render Address Step
  const renderAddressStep = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-100 mb-4">Residential Address</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Street Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={individualData.residentialAddress}
            onChange={(e) => setIndividualData({ ...individualData, residentialAddress: e.target.value })}
            className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
            placeholder="123 Main Street"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={individualData.city}
            onChange={(e) => setIndividualData({ ...individualData, city: e.target.value })}
            className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
            placeholder="Sydney"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            State <span className="text-red-500">*</span>
          </label>
          <select
            value={individualData.state}
            onChange={(e) => setIndividualData({ ...individualData, state: e.target.value })}
            className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
          >
            <option value="">Select State</option>
            <option value="NSW">NSW</option>
            <option value="VIC">VIC</option>
            <option value="QLD">QLD</option>
            <option value="WA">WA</option>
            <option value="SA">SA</option>
            <option value="TAS">TAS</option>
            <option value="ACT">ACT</option>
            <option value="NT">NT</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Postcode <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={individualData.postcode}
            onChange={(e) => setIndividualData({ ...individualData, postcode: e.target.value })}
            className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
            placeholder="2000"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Country <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={individualData.country}
            onChange={(e) => setIndividualData({ ...individualData, country: e.target.value })}
            className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
            placeholder="Australia"
          />
        </div>
      </div>

      {/* Mailing Address */}
      <div className="border-t pt-6">
        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={individualData.sameAsResidential}
            onChange={(e) => setIndividualData({ ...individualData, sameAsResidential: e.target.checked })}
            className="w-5 h-5"
          />
          <label className="font-bold text-slate-100">Mailing address same as residential</label>
        </div>

        {!individualData.sameAsResidential && (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-slate-300 mb-2">Mailing Address</label>
              <input
                type="text"
                value={individualData.mailingAddress}
                onChange={(e) => setIndividualData({ ...individualData, mailingAddress: e.target.value })}
                className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">City</label>
              <input
                type="text"
                value={individualData.mailingCity}
                onChange={(e) => setIndividualData({ ...individualData, mailingCity: e.target.value })}
                className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">State</label>
              <input
                type="text"
                value={individualData.mailingState}
                onChange={(e) => setIndividualData({ ...individualData, mailingState: e.target.value })}
                className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Postcode</label>
              <input
                type="text"
                value={individualData.mailingPostcode}
                onChange={(e) => setIndividualData({ ...individualData, mailingPostcode: e.target.value })}
                className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Country</label>
              <input
                type="text"
                value={individualData.mailingCountry}
                onChange={(e) => setIndividualData({ ...individualData, mailingCountry: e.target.value })}
                className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={handleBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleNext}>
          Continue
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  // Render Documents Checklist
  const renderDocumentsStep = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-100 mb-4">Required Documents</h3>

      <Card className="bg-amber-500/10 border-amber-300">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-300">
              <p className="font-semibold mb-2">Document Collection Required:</p>
              <p>Check all documents that will be collected during onboarding. Documents must be verified before client can transact.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Documents */}
      {(clientType === 'individual' || clientType === 'soletrader') && (
        <Card>
          <CardHeader>
            <CardTitle>Individual Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={documentsChecklist.primaryPhotoId}
                onChange={(e) => setDocumentsChecklist({ ...documentsChecklist, primaryPhotoId: e.target.checked })}
                className="w-5 h-5"
              />
              <div className="flex-1">
                <p className="font-semibold text-slate-100">Primary Photo ID</p>
                <p className="text-sm text-slate-300">Passport or Driver Licence (40-70 points)</p>
              </div>
              <Badge variant="outline" className="text-red-400">Required</Badge>
            </label>

            <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={documentsChecklist.secondaryId}
                onChange={(e) => setDocumentsChecklist({ ...documentsChecklist, secondaryId: e.target.checked })}
                className="w-5 h-5"
              />
              <div className="flex-1">
                <p className="font-semibold text-slate-100">Secondary ID</p>
                <p className="text-sm text-slate-300">Medicare Card, Birth Certificate (25-70 points)</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={documentsChecklist.proofOfAddress}
                onChange={(e) => setDocumentsChecklist({ ...documentsChecklist, proofOfAddress: e.target.checked })}
                className="w-5 h-5"
              />
              <div className="flex-1">
                <p className="font-semibold text-slate-100">Proof of Address</p>
                <p className="text-sm text-slate-300">Utility bill, bank statement, rates notice (&lt; 3 months)</p>
              </div>
              <Badge variant="outline">If required</Badge>
            </label>

            <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={documentsChecklist.sourceOfFundsDoc}
                onChange={(e) => setDocumentsChecklist({ ...documentsChecklist, sourceOfFundsDoc: e.target.checked })}
                className="w-5 h-5"
              />
              <div className="flex-1">
                <p className="font-semibold text-slate-100">Source of Funds Evidence</p>
                <p className="text-sm text-slate-300">Bank statement, contract, inheritance document</p>
              </div>
              <Badge className="bg-red-500">High Risk</Badge>
            </label>

            <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={documentsChecklist.sourceOfWealthDoc}
                onChange={(e) => setDocumentsChecklist({ ...documentsChecklist, sourceOfWealthDoc: e.target.checked })}
                className="w-5 h-5"
              />
              <div className="flex-1">
                <p className="font-semibold text-slate-100">Source of Wealth Statement</p>
                <p className="text-sm text-slate-300">Wealth accumulation documentation</p>
              </div>
              <Badge className="bg-red-500">High Risk</Badge>
            </label>

            <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={documentsChecklist.taxReturn}
                onChange={(e) => setDocumentsChecklist({ ...documentsChecklist, taxReturn: e.target.checked })}
                className="w-5 h-5"
              />
              <div className="flex-1">
                <p className="font-semibold text-slate-100">Tax Return (Last Lodged)</p>
                <p className="text-sm text-slate-300">Most recent tax return</p>
              </div>
              <Badge className="bg-red-500">High Risk</Badge>
            </label>
          </CardContent>
        </Card>
      )}

      {/* Company Documents */}
      {clientType === 'company' && (
        <Card>
          <CardHeader>
            <CardTitle>Company Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={documentsChecklist.asicExtract}
                onChange={(e) => setDocumentsChecklist({ ...documentsChecklist, asicExtract: e.target.checked })}
                className="w-5 h-5"
              />
              <div className="flex-1">
                <p className="font-semibold text-slate-100">ASIC Company Extract (Current)</p>
                <p className="text-sm text-slate-300">Full company details, directors, shareholders</p>
              </div>
              <Badge variant="outline" className="text-red-400">Required</Badge>
            </label>

            <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={documentsChecklist.constitution}
                onChange={(e) => setDocumentsChecklist({ ...documentsChecklist, constitution: e.target.checked })}
                className="w-5 h-5"
              />
              <div className="flex-1">
                <p className="font-semibold text-slate-100">Company Constitution</p>
                <p className="text-sm text-slate-300">Share rights, director powers, governance</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={documentsChecklist.shareRegister}
                onChange={(e) => setDocumentsChecklist({ ...documentsChecklist, shareRegister: e.target.checked })}
                className="w-5 h-5"
              />
              <div className="flex-1">
                <p className="font-semibold text-slate-100">Share Register</p>
                <p className="text-sm text-slate-300">Current ownership structure, UBO confirmation</p>
              </div>
              <Badge className="bg-red-500">High Risk</Badge>
            </label>

            <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={documentsChecklist.directorIds}
                onChange={(e) => setDocumentsChecklist({ ...documentsChecklist, directorIds: e.target.checked })}
                className="w-5 h-5"
              />
              <div className="flex-1">
                <p className="font-semibold text-slate-100">All Director IDs</p>
                <p className="text-sm text-slate-300">Photo ID, DOB, address for each director</p>
              </div>
              <Badge variant="outline" className="text-red-400">Required</Badge>
            </label>

            <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={documentsChecklist.beneficialOwnerIds}
                onChange={(e) => setDocumentsChecklist({ ...documentsChecklist, beneficialOwnerIds: e.target.checked })}
                className="w-5 h-5"
              />
              <div className="flex-1">
                <p className="font-semibold text-slate-100">Beneficial Owner IDs (25%+)</p>
                <p className="text-sm text-slate-300">ID documents for all 25%+ owners</p>
              </div>
              <Badge variant="outline" className="text-red-400">Required</Badge>
            </label>

            <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={documentsChecklist.financialStatements}
                onChange={(e) => setDocumentsChecklist({ ...documentsChecklist, financialStatements: e.target.checked })}
                className="w-5 h-5"
              />
              <div className="flex-1">
                <p className="font-semibold text-slate-100">Financial Statements</p>
                <p className="text-sm text-slate-300">Most recent annual financial statements</p>
              </div>
              <Badge className="bg-red-500">High Risk</Badge>
            </label>
          </CardContent>
        </Card>
      )}

      {/* Trust Documents */}
      {clientType === 'trust' && (
        <Card>
          <CardHeader>
            <CardTitle>Trust Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={documentsChecklist.trustDeed}
                onChange={(e) => setDocumentsChecklist({ ...documentsChecklist, trustDeed: e.target.checked })}
                className="w-5 h-5"
              />
              <div className="flex-1">
                <p className="font-semibold text-slate-100">Trust Deed (Complete Copy)</p>
                <p className="text-sm text-slate-300">Full trust deed with all variations</p>
              </div>
              <Badge variant="outline" className="text-red-400">Required</Badge>
            </label>

            <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={documentsChecklist.trusteeId}
                onChange={(e) => setDocumentsChecklist({ ...documentsChecklist, trusteeId: e.target.checked })}
                className="w-5 h-5"
              />
              <div className="flex-1">
                <p className="font-semibold text-slate-100">Trustee ID</p>
                <p className="text-sm text-slate-300">Individual CDD or Company CDD for trustee</p>
              </div>
              <Badge variant="outline" className="text-red-400">Required</Badge>
            </label>

            <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={documentsChecklist.appointorId}
                onChange={(e) => setDocumentsChecklist({ ...documentsChecklist, appointorId: e.target.checked })}
                className="w-5 h-5"
              />
              <div className="flex-1">
                <p className="font-semibold text-slate-100">Appointor ID</p>
                <p className="text-sm text-slate-300">ID if appointor controls trust</p>
              </div>
              <Badge variant="outline">If applicable</Badge>
            </label>

            <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={documentsChecklist.distributionStatements}
                onChange={(e) => setDocumentsChecklist({ ...documentsChecklist, distributionStatements: e.target.checked })}
                className="w-5 h-5"
              />
              <div className="flex-1">
                <p className="font-semibold text-slate-100">Distribution Statements</p>
                <p className="text-sm text-slate-300">Recent distribution history</p>
              </div>
              <Badge className="bg-red-500">High Risk</Badge>
            </label>
          </CardContent>
        </Card>
      )}

      {/* International/Certification */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Requirements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-white/5 cursor-pointer">
            <input
              type="checkbox"
              checked={documentsChecklist.certifiedCopies}
              onChange={(e) => setDocumentsChecklist({ ...documentsChecklist, certifiedCopies: e.target.checked })}
              className="w-5 h-5"
            />
            <div className="flex-1">
              <p className="font-semibold text-slate-100">Certified Copies</p>
              <p className="text-sm text-slate-300">Documents certified by authorized person</p>
            </div>
            <Badge variant="outline">International</Badge>
          </label>

          <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-white/5 cursor-pointer">
            <input
              type="checkbox"
              checked={documentsChecklist.notarizedDocs}
              onChange={(e) => setDocumentsChecklist({ ...documentsChecklist, notarizedDocs: e.target.checked })}
              className="w-5 h-5"
            />
            <div className="flex-1">
              <p className="font-semibold text-slate-100">Notarized Documents</p>
              <p className="text-sm text-slate-300">Documents notarized in home jurisdiction</p>
            </div>
            <Badge variant="outline">International</Badge>
          </label>

          <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-white/5 cursor-pointer">
            <input
              type="checkbox"
              checked={documentsChecklist.internationalRegistry}
              onChange={(e) => setDocumentsChecklist({ ...documentsChecklist, internationalRegistry: e.target.checked })}
              className="w-5 h-5"
            />
            <div className="flex-1">
              <p className="font-semibold text-slate-100">International Registry Extract</p>
              <p className="text-sm text-slate-300">Company registry from home jurisdiction</p>
            </div>
            <Badge variant="outline">International</Badge>
          </label>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={handleBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleNext}>
          Continue
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  // Render Additional Searches Step
  const renderAdditionalSearchesStep = () => {
    const costs = calculateSearchCosts();

    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-100 mb-4">Additional Searches & Verification Costs</h3>

        {/* Cost Warning Card */}
        <Card className="bg-amber-500/10 border-4 border-amber-400">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-8 h-8 text-amber-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-lg font-bold text-amber-300 mb-2">Important: Verification Costs</h4>
                <p className="text-amber-300 mb-3">
                  Additional searches will be conducted as part of KYC/AML compliance. 
                  <strong className="block mt-2">Cost varies based on the number of entities identified during verification.</strong>
                </p>
                <div className="bg-white border-2 border-amber-300 rounded-lg p-4 mt-3">
                  <p className="font-bold text-slate-100 mb-2">How Costs Work:</p>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• <strong>Per-Entity Pricing:</strong> Each search is charged per entity verified</li>
                    <li>• <strong>Entity Discovery:</strong> If 2 directors are found, director searches are charged 2x</li>
                    <li>• <strong>Related Entities:</strong> Additional companies/trusts linked to the client may be discovered</li>
                    <li>• <strong>Final cost will be calculated after entity discovery is complete</strong></li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Estimated Entities */}
        <Card className="border-2 border-blue-300 bg-blue-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              Estimated Entities for Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white rounded-lg border-2 border-blue-500/30">
                <p className="text-3xl font-bold text-blue-400">1</p>
                <p className="text-sm text-slate-300 mt-1">Base Client</p>
              </div>
              {clientType === 'company' && (
                <>
                  <div className="text-center p-4 bg-white rounded-lg border-2 border-blue-500/30">
                    <input
                      type="number"
                      min="0"
                      value={additionalSearches.estimatedDirectors}
                      onChange={(e) => setAdditionalSearches({ ...additionalSearches, estimatedDirectors: parseInt(e.target.value) || 0 })}
                      className="text-3xl font-bold text-blue-400 w-full text-center border-0"
                    />
                    <p className="text-sm text-slate-300 mt-1">Directors</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border-2 border-blue-500/30">
                    <input
                      type="number"
                      min="0"
                      value={additionalSearches.estimatedBeneficialOwners}
                      onChange={(e) => setAdditionalSearches({ ...additionalSearches, estimatedBeneficialOwners: parseInt(e.target.value) || 0 })}
                      className="text-3xl font-bold text-blue-400 w-full text-center border-0"
                    />
                    <p className="text-sm text-slate-300 mt-1">Beneficial Owners</p>
                  </div>
                </>
              )}
              {additionalSearches.relatedEntitySearch && (
                <div className="text-center p-4 bg-white rounded-lg border-2 border-blue-500/30">
                  <input
                    type="number"
                    min="0"
                    value={additionalSearches.estimatedRelatedEntities}
                    onChange={(e) => setAdditionalSearches({ ...additionalSearches, estimatedRelatedEntities: parseInt(e.target.value) || 0 })}
                    className="text-3xl font-bold text-blue-400 w-full text-center border-0"
                  />
                  <p className="text-sm text-slate-300 mt-1">Related Entities</p>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-300 mt-4 text-center">
              <strong>Total Entities:</strong> {costs.totalEntities} • Adjust estimates above to see cost impact
            </p>
          </CardContent>
        </Card>

        {/* Search Selection */}
        <div className="grid grid-cols-2 gap-4">
          {/* Mandatory Searches */}
          <Card className="border-2 border-red-300">
            <CardHeader className="bg-red-500/10">
              <CardTitle className="flex items-center gap-2 text-red-300">
                <Shield className="w-5 h-5" />
                Mandatory Searches (Required)
              </CardTitle>
              <CardDescription>These searches are required for AML/CTF compliance</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {Object.keys(searchCosts)
                .filter(key => searchCosts[key].mandatory)
                .map((key) => {
                  const search = searchCosts[key];
                  const isApplicable = !(key === 'asicSearch' && clientType !== 'company');
                  
                  return (
                    <div key={key} className={`p-3 rounded-lg border-2 ${isApplicable ? 'bg-white border-red-500/30' : 'bg-white/5 border-white/10'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <p className="font-semibold text-slate-100 text-sm">{search.name}</p>
                          </div>
                          <p className="text-xs text-slate-300 mt-1">${search.perEntity.toFixed(2)} per entity</p>
                        </div>
                        <Badge className="bg-red-600">REQUIRED</Badge>
                      </div>
                      {!isApplicable && (
                        <p className="text-xs text-slate-400 mt-2">Not applicable to this client type</p>
                      )}
                    </div>
                  );
                })}
            </CardContent>
          </Card>

          {/* Optional Searches */}
          <Card className="border-2 border-purple-300">
            <CardHeader className="bg-purple-500/10">
              <CardTitle className="flex items-center gap-2 text-purple-300">
                <FileText className="w-5 h-5" />
                Optional Searches (Recommended)
              </CardTitle>
              <CardDescription>Select additional verification searches</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {Object.keys(searchCosts)
                .filter(key => !searchCosts[key].mandatory)
                .map((key) => {
                  const search = searchCosts[key];
                  
                  return (
                    <label key={key} className="flex items-center gap-3 p-3 border-2 rounded-lg hover:bg-purple-500/10 cursor-pointer transition-all">
                      <input
                        type="checkbox"
                        checked={(additionalSearches as any)[key]}
                        onChange={(e) => setAdditionalSearches({ ...additionalSearches, [key]: e.target.checked })}
                        className="w-5 h-5"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-slate-100 text-sm">{search.name}</p>
                        <p className="text-xs text-slate-300">${search.perEntity.toFixed(2)} per entity</p>
                      </div>
                    </label>
                  );
                })}
            </CardContent>
          </Card>
        </div>

        {/* Cost Breakdown */}
        <Card className="border-4 border-green-400 bg-green-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-300">
              <DollarSign className="w-6 h-6" />
              Estimated Cost Breakdown
            </CardTitle>
            <CardDescription>Based on current entity estimates</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3 mb-6">
              {costs.breakdown.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-100">{item.name}</p>
                    <p className="text-sm text-slate-300">
                      ${item.perEntity.toFixed(2)} × {item.entityCount} {item.entityCount === 1 ? 'entity' : 'entities'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-slate-100">${item.totalCost.toFixed(2)}</p>
                    {item.mandatory && <Badge className="bg-red-600 text-xs mt-1">Mandatory</Badge>}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t-4 border-green-600 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-slate-300">Estimated Total Cost</p>
                  <p className="text-sm text-slate-300">{costs.totalEntities} {costs.totalEntities === 1 ? 'entity' : 'entities'} to verify</p>
                </div>
                <p className="text-4xl font-bold text-green-400">${costs.totalCost.toFixed(2)}</p>
              </div>
            </div>

            <Card className="bg-amber-500/10 border-amber-300 mt-6">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-300">
                    <p className="font-semibold mb-1">Important Notice:</p>
                    <p>
                      This is an <strong>estimated cost</strong> based on your inputs. 
                      The <strong>final cost may vary</strong> if additional entities (directors, beneficial owners, related companies/trusts) 
                      are discovered during the verification process. You will be notified of any cost changes before charges are applied.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Cost Acknowledgment */}
        <Card className="border-2 border-gray-400">
          <CardContent className="p-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={additionalSearches.acknowledgedCosts}
                onChange={(e) => setAdditionalSearches({ ...additionalSearches, acknowledgedCosts: e.target.checked })}
                className="w-6 h-6 mt-1"
              />
              <div>
                <p className="font-bold text-slate-100 text-lg mb-2">
                  I acknowledge and agree to the verification costs
                </p>
                <p className="text-sm text-slate-300">
                  I understand that:
                </p>
                <ul className="text-sm text-slate-300 mt-2 space-y-1 ml-4">
                  <li>• Searches are charged per entity discovered during verification</li>
                  <li>• The final cost may differ from the estimate if additional entities are identified</li>
                  <li>• I will be notified of any cost changes before charges are applied</li>
                  <li>• These searches are required for AML/CTF compliance and client onboarding</li>
                </ul>
              </div>
            </label>
          </CardContent>
        </Card>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handleBack}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button 
            onClick={handleNext}
            disabled={!additionalSearches.acknowledgedCosts}
            className={!additionalSearches.acknowledgedCosts ? 'opacity-50 cursor-not-allowed' : ''}
          >
            Continue
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  // Render Risk Assessment
  const renderRiskAssessmentStep = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-100 mb-4">Risk Assessment</h3>

      <Card className="bg-purple-500/10 border-purple-500/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-purple-300">
              <p className="font-semibold mb-2">AML/CTF Risk Screening:</p>
              <p>Answer the following questions to determine the client's risk profile. This affects documentation requirements and ongoing monitoring.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {/* PEP Check */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={individualData.isPEP}
                onChange={(e) => setIndividualData({ ...individualData, isPEP: e.target.checked })}
                className="w-5 h-5 mt-1"
              />
              <div className="flex-1">
                <label className="font-semibold text-slate-100 cursor-pointer">
                  Client is a Politically Exposed Person (PEP)
                </label>
                <p className="text-sm text-slate-300 mt-1">
                  Includes government officials, senior political figures, or their immediate family members
                </p>
                {individualData.isPEP && (
                  <div className="mt-3">
                    <label className="block text-sm font-semibold text-slate-300 mb-2">PEP Details</label>
                    <textarea
                      value={individualData.pepDetails}
                      onChange={(e) => setIndividualData({ ...individualData, pepDetails: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
                      rows={2}
                      placeholder="Provide position, country, relationship details"
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* High Risk */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={individualData.isHighRisk}
                onChange={(e) => setIndividualData({ ...individualData, isHighRisk: e.target.checked })}
                className="w-5 h-5 mt-1"
              />
              <div className="flex-1">
                <label className="font-semibold text-slate-100 cursor-pointer">
                  Client presents high money laundering/terrorism financing risk
                </label>
                <p className="text-sm text-slate-300 mt-1">
                  E.g., cash-intensive business, high-risk jurisdiction, complex ownership structure
                </p>
                {individualData.isHighRisk && (
                  <div className="mt-3">
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Risk Reason</label>
                    <textarea
                      value={individualData.riskReason}
                      onChange={(e) => setIndividualData({ ...individualData, riskReason: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-white/10 rounded-lg"
                      rows={2}
                      placeholder="Explain why client is considered high risk"
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* International */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={individualData.isInternational}
                onChange={(e) => setIndividualData({ ...individualData, isInternational: e.target.checked })}
                className="w-5 h-5 mt-1"
              />
              <div className="flex-1">
                <label className="font-semibold text-slate-100 cursor-pointer">
                  Client is international (non-Australian resident)
                </label>
                <p className="text-sm text-slate-300 mt-1">
                  Requires additional documentation and verification
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certification Required */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={individualData.requiresCertification}
                onChange={(e) => setIndividualData({ ...individualData, requiresCertification: e.target.checked })}
                className="w-5 h-5 mt-1"
              />
              <div className="flex-1">
                <label className="font-semibold text-slate-100 cursor-pointer">
                  Documents require certification/notarization
                </label>
                <p className="text-sm text-slate-300 mt-1">
                  Certified copies or notarized documents needed
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Auto Risk Level Display */}
      <Card className={`border-2 ${
        individualData.isPEP || individualData.isHighRisk ? 'bg-red-500/10 border-red-300' :
        individualData.isInternational ? 'bg-amber-500/10 border-amber-300' :
        'bg-green-500/10 border-green-300'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-100 mb-1">Assessed Risk Level</h4>
              <p className="text-sm text-slate-300">
                {individualData.isPEP || individualData.isHighRisk ? 
                  'HIGH RISK - Enhanced due diligence required' :
                  individualData.isInternational ?
                  'MEDIUM RISK - Additional verification required' :
                  'STANDARD RISK - Standard CDD procedures apply'
                }
              </p>
            </div>
            <Badge className={`text-lg px-4 py-2 ${
              individualData.isPEP || individualData.isHighRisk ? 'bg-red-600' :
              individualData.isInternational ? 'bg-amber-600' :
              'bg-green-600'
            }`}>
              {individualData.isPEP || individualData.isHighRisk ? 'HIGH' :
                individualData.isInternational ? 'MEDIUM' : 'STANDARD'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={handleBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleNext}>
          Continue
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  // Render Review Step
  const renderReviewStep = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-100 mb-4">Review & Submit</h3>

      <Card className="bg-blue-500/10 border-blue-500/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-300">
              <p className="font-semibold mb-2">Ready to submit:</p>
              <p>Review the information below and click "Create Client" to initiate the onboarding process.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Client Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-300">Client Type</p>
              <p className="font-semibold capitalize">{clientType}</p>
            </div>
            {clientType === 'individual' && (
              <>
                <div>
                  <p className="text-slate-300">Full Name</p>
                  <p className="font-semibold">{individualData.firstName} {individualData.lastName}</p>
                </div>
                <div>
                  <p className="text-slate-300">Email</p>
                  <p className="font-semibold">{individualData.email}</p>
                </div>
                <div>
                  <p className="text-slate-300">Risk Level</p>
                  <Badge className={individualData.isPEP || individualData.isHighRisk ? 'bg-red-600' : individualData.isInternational ? 'bg-amber-600' : 'bg-green-600'}>
                    {individualData.isPEP || individualData.isHighRisk ? 'HIGH' : individualData.isInternational ? 'MEDIUM' : 'STANDARD'}
                  </Badge>
                </div>
              </>
            )}
            {clientType === 'company' && (
              <>
                <div>
                  <p className="text-slate-300">Company Name</p>
                  <p className="font-semibold">{companyData.companyName}</p>
                </div>
                <div>
                  <p className="text-slate-300">ACN</p>
                  <p className="font-semibold">{companyData.acn}</p>
                </div>
                <div>
                  <p className="text-slate-300">ABN</p>
                  <p className="font-semibold">{companyData.abn}</p>
                </div>
              </>
            )}
            {clientType === 'trust' && (
              <>
                <div>
                  <p className="text-slate-300">Trust Name</p>
                  <p className="font-semibold">{trustData.trustName}</p>
                </div>
                <div>
                  <p className="text-slate-300">Trust Type</p>
                  <p className="font-semibold capitalize">{trustData.trustType}</p>
                </div>
                <div>
                  <p className="text-slate-300">Trustee</p>
                  <p className="font-semibold">{trustData.trusteeName}</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={handleBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={handleSubmit} 
          className={`bg-green-600 hover:bg-green-700 ${isPartner ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isPartner}
          title={isPartner ? "Managing Partners cannot create cases." : undefined}
        >
          <Check className="w-4 h-4 mr-2" />
          Create Client & Start Onboarding
        </Button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-100">Comprehensive Client Onboarding</h2>
            <p className="text-sm text-slate-300 mt-1">Bank-Grade KYC/AML Compliant</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-300">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isComplete = getStepIndex() > idx;
              
              return (
                <div key={step.id} className="flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isComplete ? 'bg-green-500' :
                      isActive ? 'bg-blue-600' :
                      'bg-gray-300'
                    }`}>
                      {isComplete ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : (
                        <Icon className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <span className={`text-xs mt-1 ${isActive ? 'font-bold text-blue-400' : 'text-slate-300'}`}>
                      {step.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <Progress value={(getStepIndex() / (steps.length - 1)) * 100} className="h-2" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentStep === 'type' && renderClientTypeStep()}
          {currentStep === 'basic' && renderBasicInfoStep()}
          {currentStep === 'identification' && renderIdentificationStep()}
          {currentStep === 'address' && renderAddressStep()}
          {currentStep === 'beneficial_owners' && <div className="text-center py-12"><p className="text-slate-300">Beneficial Owners section coming soon...</p><Button onClick={handleNext} className="mt-4">Skip for Now</Button></div>}
          {currentStep === 'documents' && renderDocumentsStep()}
          {currentStep === 'additional_searches' && renderAdditionalSearchesStep()}
          {currentStep === 'risk_assessment' && renderRiskAssessmentStep()}
          {currentStep === 'review' && renderReviewStep()}
        </div>
      </div>
    </div>
  );
}

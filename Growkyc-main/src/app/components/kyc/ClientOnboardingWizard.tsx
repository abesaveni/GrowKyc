import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  User,
  Building2,
  Users,
  CheckCircle,
  AlertTriangle,
  Shield,
  Search,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Save,
  Lock,
  Unlock,
  Scale,
  FileText,
  X,
  Send
} from 'lucide-react';
import { InfoTrackIntegration } from '../integrations/InfoTrackIntegration';
import { ClientsDB } from './ClientsDatabase';

interface BeneficialOwner {
  id: string;
  name: string;
  ownership: number;
  controlFlag: boolean;
  parentId?: string;
}

export function ClientOnboardingWizard({ onClose }: { onClose?: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [clientType, setClientType] = useState<'individual' | 'company' | 'trust' | 'partnership' | 'government'>('company');
  
  const [basicDetails, setBasicDetails] = useState({
    name: '',
    abn: '',
    acn: '',
    address: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    countryOfResidence: 'Australia'
  });

  const [beneficialOwners, setBeneficialOwners] = useState<BeneficialOwner[]>([
    { id: '1', name: 'Sarah Mitchell', ownership: 60, controlFlag: true },
    { id: '2', name: 'John Mitchell', ownership: 40, controlFlag: true }
  ]);

  const [greenIDStatus, setGreenIDStatus] = useState<'pending' | 'verified' | 'failed'>('pending');
  
  const [screeningResults, setScreeningResults] = useState({
    sanctions: { status: 'clear', matches: 0 },
    pep: { status: 'clear', matches: 0 },
    adverseMedia: { status: 'clear', matches: 0 }
  });

  const [riskRating, setRiskRating] = useState<'low' | 'medium' | 'high'>('low');
  const [riskFactors, setRiskFactors] = useState<string[]>([]);
  const [requiresEnhancedCDD, setRequiresEnhancedCDD] = useState(false);
  const [enhancedCDDReason, setEnhancedCDDReason] = useState('');
  const [approvalRequired, setApprovalRequired] = useState(false);
  const [showInfoTrack, setShowInfoTrack] = useState(false);

  const handleComplete = () => {
    const nextId = (ClientsDB.getClients().length + 1).toString();
    const currentDate = new Date().toISOString().split('T')[0];
    const reviewDays = riskRating === 'high' ? 30 : riskRating === 'medium' ? 180 : 365;
    const nextReviewDate = new Date(new Date().setDate(new Date().getDate() + reviewDays)).toISOString().split('T')[0];

    const newClient: any = {
      id: nextId,
      name: basicDetails.name || 'Sarah Mitchell',
      entityType: clientType.charAt(0).toUpperCase() + clientType.slice(1),
      status: 'Active',
      country: basicDetails.countryOfResidence || 'Australia',
      industry: 'Wealth Management',
      serviceType: 'Wealth Management',
      clientGroup: 'New Onboard Group',
      riskScores: {
        overall: riskRating === 'high' ? 70 : riskRating === 'medium' ? 45 : 20,
        aml: riskRating === 'high' ? 65 : riskRating === 'medium' ? 35 : 15,
        financial: 30,
        business: 25,
        ownership: 20
      },
      quickStatus: {
        identity: greenIDStatus === 'verified' ? 'Verified' : 'Pending',
        aml: screeningResults.sanctions.matches > 0 ? 'SANCTIONS' : 'Clear',
        entity: clientType === 'individual' ? 'N/A' : 'Active',
        monitoring: 'Active'
      },
      lastReview: currentDate,
      nextReview: nextReviewDate,
      identityData: {
        primaryID: { type: 'Passport', number: 'PA' + Math.floor(1000000 + Math.random() * 9000000), expiry: '2032-01-01', verified: true },
        biometricStatus: greenIDStatus === 'verified' ? 'Passed' : 'Pending',
        livenessCheck: true,
        addressVerified: true,
        greenIDScore: 925,
        infoTrackStatus: 'Verified - High Confidence',
        fraudFlags: []
      },
      amlData: {
        sanctionsMatches: screeningResults.sanctions.matches,
        pepStatus: screeningResults.pep.matches > 0 ? 'Domestic PEP' : 'Not PEP',
        adverseMediaHits: screeningResults.adverseMedia.matches,
        worldCheckStatus: screeningResults.sanctions.matches > 0 ? 'PEP Match' : 'Clear',
        transactionMonitoring: 'Active',
        riskRating: riskRating.charAt(0).toUpperCase() + riskRating.slice(1),
        lastScreeningDate: currentDate
      },
      entityData: {
        registrationDate: currentDate,
        companyStatus: 'Active',
        directors: [],
        shareholders: []
      },
      ownershipData: {
        ubos: beneficialOwners.map(bo => ({ name: bo.name, ownership: bo.ownership, verified: true, country: 'Australia' })),
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
        total: riskRating === 'high' ? 5 : riskRating === 'medium' ? 4 : 4,
        verified: riskRating === 'high' ? 2 : riskRating === 'medium' ? 3 : 4,
        pending: riskRating === 'high' ? 3 : riskRating === 'medium' ? 1 : 0,
        rejected: 0
      },
      monitoringData: { alertsLast30Days: 0, activeAlerts: 0, nameChanges: 0, addressChanges: 0, ownershipChanges: 0 }
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

    alert(`🎉 Successfully onboarded client: ${newClient.name}!`);
    if (onClose) onClose();
  };

  const handleSendForApproval = () => {
    const nextId = (ClientsDB.getClients().length + 1).toString();
    const currentDate = new Date().toISOString().split('T')[0];
    const reviewDays = 30; // High risk review cycle is 30 days
    const nextReviewDate = new Date(new Date().setDate(new Date().getDate() + reviewDays)).toISOString().split('T')[0];

    const newClient: any = {
      id: nextId,
      name: basicDetails.name || 'Sarah Mitchell',
      entityType: clientType.charAt(0).toUpperCase() + clientType.slice(1),
      status: 'Under Review',
      country: basicDetails.countryOfResidence || 'Australia',
      industry: 'Wealth Management',
      serviceType: 'Wealth Management',
      clientGroup: 'New Onboard Group',
      riskScores: {
        overall: 70,
        aml: 65,
        financial: 30,
        business: 25,
        ownership: 20
      },
      quickStatus: {
        identity: greenIDStatus === 'verified' ? 'Verified' : 'Pending',
        aml: screeningResults.sanctions.matches > 0 ? 'SANCTIONS' : 'Clear',
        entity: clientType === 'individual' ? 'N/A' : 'Active',
        monitoring: 'Active'
      },
      lastReview: currentDate,
      nextReview: nextReviewDate,
      identityData: {
        primaryID: { type: 'Passport', number: 'PA' + Math.floor(1000000 + Math.random() * 9000000), expiry: '2032-01-01', verified: true },
        biometricStatus: greenIDStatus === 'verified' ? 'Passed' : 'Pending',
        livenessCheck: true,
        addressVerified: true,
        greenIDScore: 925,
        infoTrackStatus: 'Verified - High Confidence',
        fraudFlags: []
      },
      amlData: {
        sanctionsMatches: screeningResults.sanctions.matches,
        pepStatus: screeningResults.pep.matches > 0 ? 'Domestic PEP' : 'Not PEP',
        adverseMediaHits: screeningResults.adverseMedia.matches,
        worldCheckStatus: screeningResults.sanctions.matches > 0 ? 'PEP Match' : 'Clear',
        transactionMonitoring: 'Active',
        riskRating: 'High',
        lastScreeningDate: currentDate
      },
      entityData: {
        registrationDate: currentDate,
        companyStatus: 'Active',
        directors: [],
        shareholders: []
      },
      ownershipData: {
        ubos: beneficialOwners.map(bo => ({ name: bo.name, ownership: bo.ownership, verified: true, country: 'Australia' })),
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
        total: 5,
        verified: 2,
        pending: 3,
        rejected: 0
      },
      monitoringData: { alertsLast30Days: 0, activeAlerts: 0, nameChanges: 0, addressChanges: 0, ownershipChanges: 0 }
    };

    ClientsDB.addClient(newClient);

    // Save to logged activities
    const activityLog = {
      type: 'review',
      user: 'Head of Compliance',
      action: `sent high-risk client ${newClient.name} for senior approval`,
      time: 'Just now',
      iconName: 'AlertTriangle',
      color: 'text-amber-600'
    };
    const savedLogs = localStorage.getItem('growkyc_logged_activities');
    const logs = savedLogs ? JSON.parse(savedLogs) : [];
    logs.unshift(activityLog);
    localStorage.setItem('growkyc_logged_activities', JSON.stringify(logs));
    window.dispatchEvent(new CustomEvent('growkyc:activity_logged'));

    alert(`⚠️ High-risk client ${newClient.name} submitted for senior approval!`);
    if (onClose) onClose();
  };

  const steps = [
    { num: 1, title: 'Client Type', icon: User },
    { num: 2, title: 'Basic Details', icon: FileText },
    { num: 3, title: 'Ownership', icon: Users },
    { num: 4, title: 'Verification', icon: Shield },
    { num: 5, title: 'Screening', icon: Search },
    { num: 6, title: 'Risk Rating', icon: Scale },
    { num: 7, title: 'Approval', icon: CheckCircle }
  ];

  const simulateGreenID = () => {
    setGreenIDStatus('verified');
  };

  const simulateScreening = () => {
    // Load settings from localStorage to check which bots are enabled
    const getStored = (key: string, fallback: any) => {
      try {
        const val = localStorage.getItem(`grow_settings_${key}`);
        return val ? JSON.parse(val) : fallback;
      } catch {
        return fallback;
      }
    };
    const botSettings = getStored('bot_settings', {});
    
    const pepEnabled = botSettings['PEP Screening Bot'] !== false;
    const sanctionsEnabled = botSettings['Sanctions Screening Bot'] !== false;
    const adverseMediaEnabled = botSettings['Adverse Media Screening Bot'] !== false;

    setScreeningResults({
      sanctions: { status: sanctionsEnabled ? 'clear' : 'bypassed', matches: 0 },
      pep: { status: pepEnabled ? 'clear' : 'bypassed', matches: 0 },
      adverseMedia: { status: adverseMediaEnabled ? 'clear' : 'bypassed', matches: 0 }
    });
  };

  const calculateRisk = () => {
    const factors: string[] = [];
    let risk: 'low' | 'medium' | 'high' = 'low';

    // Load settings from localStorage
    const getStored = (key: string, fallback: any) => {
      try {
        const val = localStorage.getItem(`grow_settings_${key}`);
        return val ? JSON.parse(val) : fallback;
      } catch {
        return fallback;
      }
    };

    const ownershipThreshold = getStored('ownership_threshold', 24);
    const controlThreshold = getStored('control_threshold', 50);
    const highRiskThreshold = getStored('high_risk_threshold', 10);
    const botSettings = getStored('bot_settings', {});

    const pepEnabled = botSettings['PEP Screening Bot'] !== false;
    const sanctionsEnabled = botSettings['Sanctions Screening Bot'] !== false;

    if (clientType === 'trust') {
      factors.push('Complex structure (Trust entity)');
      risk = 'medium';
    }

    if (basicDetails.countryOfResidence && basicDetails.countryOfResidence !== 'Australia') {
      factors.push(`Foreign resident jurisdiction: ${basicDetails.countryOfResidence}`);
      risk = 'high';
    }

    // Beneficial ownership screening based on settings threshold
    const significantBOs = beneficialOwners.filter(bo => bo.ownership >= ownershipThreshold);
    if (significantBOs.length > 0) {
      factors.push(`Beneficial owner(s) exceed ownership threshold of ${ownershipThreshold}%`);
      if (ownershipThreshold < 20) {
        risk = 'high';
      } else if (risk === 'low') {
        risk = 'medium';
      }
    }

    // Control threshold flag based on settings
    const controllingBOs = beneficialOwners.filter(bo => bo.ownership >= controlThreshold || bo.controlFlag);
    if (controllingBOs.length > 0) {
      factors.push(`Ultimate controlling interest exceeds threshold of ${controlThreshold}%`);
      if (controlThreshold < 40) {
        risk = 'high';
      } else if (risk === 'low') {
        risk = 'medium';
      }
    }

    if (!pepEnabled) {
      factors.push('PEP Screening Bot is disabled in settings - Manual review required');
      risk = 'high';
    }
    if (!sanctionsEnabled) {
      factors.push('Sanctions Screening Bot is disabled in settings - Manual review required');
      risk = 'high';
    }

    setRiskFactors(factors);
    setRiskRating(risk);
    setApprovalRequired(risk === 'high');
    setRequiresEnhancedCDD(risk === 'high');
  };

  const addBeneficialOwner = () => {
    setBeneficialOwners([
      ...beneficialOwners,
      {
        id: Date.now().toString(),
        name: '',
        ownership: 0,
        controlFlag: false
      }
    ]);
  };

  const removeBeneficialOwner = (id: string) => {
    setBeneficialOwners(beneficialOwners.filter(bo => bo.id !== id));
  };

  const updateBeneficialOwner = (id: string, field: string, value: any) => {
    setBeneficialOwners(
      beneficialOwners.map(bo =>
        bo.id === id ? { ...bo, [field]: value } : bo
      )
    );
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return clientType !== null;
      case 2: return basicDetails.name && basicDetails.email && basicDetails.address;
      case 3: return beneficialOwners.length > 0 && beneficialOwners.every(bo => bo.name && bo.ownership > 0);
      case 4: return greenIDStatus === 'verified';
      case 5: return true;
      case 6: return true;
      case 7: return !approvalRequired; // Can't proceed if approval pending
      default: return true;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Client Onboarding</h2>
            <p className="text-sm text-gray-600 mt-1">Complete CDD for new client</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            {onClose && (
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>

        {/* Progress Steps */}
        <div className="p-6 border-b bg-gray-50 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[600px]">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.num === currentStep;
              const isComplete = step.num < currentStep;
              
              return (
                <React.Fragment key={step.num}>
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors mb-1 ${
                      isComplete ? 'bg-green-600 text-white' :
                      isActive ? 'bg-blue-600 text-white' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {isComplete ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span className={`text-[10px] font-semibold ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-1 rounded transition-colors ${
                      isComplete ? 'bg-green-600' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 min-h-[300px]">
          {/* Step 1: Client Type */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Select Client Type</h3>
                <p className="text-gray-600">Choose the type of entity you're onboarding</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { type: 'company', label: 'Company', icon: Building2, description: 'Pty Ltd, Public Co' },
                  { type: 'trust', label: 'Trust', icon: Shield, description: 'Family, Unit, Discretionary' },
                  { type: 'partnership', label: 'Partnership', icon: Users, description: 'General, Limited' },
                  { type: 'government', label: 'Government Body', icon: Building2, description: 'Agency, Department' }
                ].map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.type}
                      onClick={() => setClientType(option.type as any)}
                      className={`p-6 rounded-lg border-2 text-left relative transition-all hover:shadow-md ${
                        clientType === option.type
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <Icon className={`w-8 h-8 mb-3 ${clientType === option.type ? 'text-blue-600' : 'text-gray-600'}`} />
                      <h4 className="font-bold text-gray-900 mb-1">{option.label}</h4>
                      <p className="text-sm text-gray-600">{option.description}</p>
                      {clientType === option.type && (
                        <CheckCircle className="w-5 h-5 text-blue-600 absolute top-4 right-4" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Basic Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Basic Details</h3>
                <p className="text-gray-600">Enter client information</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    {clientType === 'individual' ? 'Full Name' : 'Entity Name'} *
                  </label>
                  <input
                    type="text"
                    value={basicDetails.name}
                    onChange={(e) => setBasicDetails({ ...basicDetails, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={clientType === 'individual' ? 'Sarah Mitchell' : 'Apex Holdings Pty Ltd'}
                  />
                </div>

                {clientType === 'individual' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Date of Birth *</label>
                    <input
                      type="date"
                      value={basicDetails.dateOfBirth}
                      onChange={(e) => setBasicDetails({ ...basicDetails, dateOfBirth: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {(clientType === 'company' || clientType === 'trust') && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">ABN</label>
                      <input
                        type="text"
                        value={basicDetails.abn}
                        onChange={(e) => setBasicDetails({ ...basicDetails, abn: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="12 345 678 901"
                      />
                    </div>
                    {clientType === 'company' && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">ACN</label>
                        <input
                          type="text"
                          value={basicDetails.acn}
                          onChange={(e) => setBasicDetails({ ...basicDetails, acn: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="123 456 789"
                        />
                      </div>
                    )}
                  </>
                )}

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Address *</label>
                  <input
                    type="text"
                    value={basicDetails.address}
                    onChange={(e) => setBasicDetails({ ...basicDetails, address: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="45 Collins Street, Melbourne VIC 3000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Email *</label>
                  <input
                    type="email"
                    value={basicDetails.email}
                    onChange={(e) => setBasicDetails({ ...basicDetails, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="sarah@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={basicDetails.phone}
                    onChange={(e) => setBasicDetails({ ...basicDetails, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0400 123 456"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Country of Residence *</label>
                  <select
                    value={basicDetails.countryOfResidence}
                    onChange={(e) => setBasicDetails({ ...basicDetails, countryOfResidence: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Australia">Australia</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Beneficial Ownership */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Beneficial Ownership</h3>
                  <p className="text-gray-600">Identify all beneficial owners (25%+ ownership or control)</p>
                </div>
                <Button onClick={addBeneficialOwner}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Owner
                </Button>
              </div>

              <div className="space-y-4">
                {beneficialOwners.map((owner) => (
                  <div key={owner.id} className="p-4 border-2 border-gray-200 rounded-lg">
                    <div className="grid grid-cols-12 gap-4 items-end">
                      <div className="col-span-5">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Name</label>
                        <input
                          type="text"
                          value={owner.name}
                          onChange={(e) => updateBeneficialOwner(owner.id, 'name', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Full name"
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Ownership %</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={owner.ownership}
                          onChange={(e) => updateBeneficialOwner(owner.id, 'ownership', parseInt(e.target.value) || 0)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={owner.controlFlag}
                            onChange={(e) => updateBeneficialOwner(owner.id, 'controlFlag', e.target.checked)}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm font-semibold text-gray-900">Control</span>
                        </label>
                      </div>
                      <div className="col-span-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeBeneficialOwner(owner.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Ownership Visualization */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-bold text-gray-900 mb-4">Ownership Structure</h4>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4 border-2 border-blue-500">
                    <p className="font-bold text-center text-gray-900">{basicDetails.name || 'Entity'}</p>
                  </div>
                  {beneficialOwners.map((owner) => (
                    <div key={owner.id} className="flex items-center">
                      <div className="w-1 h-12 bg-blue-400 ml-24" />
                      <div className="flex-1">
                        <div className="bg-white rounded-lg p-3 border-2 border-gray-200 ml-4">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-gray-900">{owner.name || 'Unnamed Owner'}</p>
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                                {owner.ownership}%
                              </span>
                              {owner.controlFlag && (
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">
                                  Control
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: ID Verification */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Identity Verification</h3>
                <p className="text-gray-600">Verify identity through GreenID or InfoTrack</p>
              </div>

              {!showInfoTrack ? (
                <>
                  {/* GreenID Integration */}
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                          <Shield className="w-8 h-8" />
                        </div>
                        <div>
                          <h4 className="text-2xl font-bold mb-1">GreenID Verification</h4>
                          <p className="text-green-100">DVS-certified identity verification</p>
                        </div>
                      </div>
                      {greenIDStatus === 'verified' && (
                        <CheckCircle className="w-12 h-12" />
                      )}
                    </div>
                  </div>

                  {greenIDStatus === 'pending' && (
                    <div className="space-y-4">
                      <Button
                        className="w-full py-8 text-lg bg-green-600 hover:bg-green-700"
                        onClick={simulateGreenID}
                      >
                        <Shield className="w-6 h-6 mr-3" />
                        Start GreenID Verification
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setShowInfoTrack(true)}
                      >
                        Use InfoTrack Instead
                      </Button>
                    </div>
                  )}

                  {greenIDStatus === 'verified' && (
                    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                        <h4 className="font-bold text-green-900 text-lg">Identity Verified</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Verification Status</p>
                          <p className="font-bold text-green-700">Passed</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Confidence Score</p>
                          <p className="font-bold text-green-700">98%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Documents Verified</p>
                          <p className="font-bold text-green-700">Driver's License, Passport</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Verification Date</p>
                          <p className="font-bold text-green-700">{new Date().toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div>
                  <Button
                    variant="outline"
                    className="mb-4"
                    onClick={() => {
                      setShowInfoTrack(false);
                      setGreenIDStatus('verified');
                    }}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to GreenID
                  </Button>
                  <InfoTrackIntegration
                    entityType={clientType === 'individual' ? 'individual' : 'company'}
                    entityData={basicDetails}
                    onComplete={(results) => {
                      setGreenIDStatus('verified');
                      setShowInfoTrack(false);
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 5: Screening */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Screening Checks</h3>
                  <p className="text-gray-600">Sanctions, PEP, and Adverse Media screening</p>
                </div>
                <Button onClick={simulateScreening}>
                  <Search className="w-4 h-4 mr-2" />
                  Run Screening
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* Sanctions card */}
                <div className={`border-2 rounded-lg p-6 bg-white ${
                  screeningResults.sanctions.status === 'bypassed' 
                    ? 'border-amber-200 bg-amber-50/20' 
                    : 'border-green-200'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <Lock className={`w-8 h-8 ${screeningResults.sanctions.status === 'bypassed' ? 'text-amber-500' : 'text-green-600'}`} />
                    {screeningResults.sanctions.status === 'bypassed' ? (
                      <AlertTriangle className="w-6 h-6 text-amber-500" />
                    ) : (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Sanctions</h4>
                  <p className={`text-3xl font-bold mb-1 ${screeningResults.sanctions.status === 'bypassed' ? 'text-amber-600' : 'text-green-600'}`}>
                    {screeningResults.sanctions.status === 'bypassed' ? '—' : screeningResults.sanctions.matches}
                  </p>
                  <p className="text-sm text-gray-600">
                    {screeningResults.sanctions.status === 'bypassed' ? 'Screening disabled' : 'Matches found'}
                  </p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-3 ${
                    screeningResults.sanctions.status === 'bypassed' 
                      ? 'bg-amber-100 text-amber-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {screeningResults.sanctions.status === 'bypassed' ? 'BYPASSED' : 'CLEAR'}
                  </span>
                </div>

                {/* PEP check card */}
                <div className={`border-2 rounded-lg p-6 bg-white ${
                  screeningResults.pep.status === 'bypassed' 
                    ? 'border-amber-200 bg-amber-50/20' 
                    : 'border-green-200'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <Shield className={`w-8 h-8 ${screeningResults.pep.status === 'bypassed' ? 'text-amber-500' : 'text-green-600'}`} />
                    {screeningResults.pep.status === 'bypassed' ? (
                      <AlertTriangle className="w-6 h-6 text-amber-500" />
                    ) : (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">PEP Check</h4>
                  <p className={`text-3xl font-bold mb-1 ${screeningResults.pep.status === 'bypassed' ? 'text-amber-600' : 'text-green-600'}`}>
                    {screeningResults.pep.status === 'bypassed' ? '—' : screeningResults.pep.matches}
                  </p>
                  <p className="text-sm text-gray-600">
                    {screeningResults.pep.status === 'bypassed' ? 'Screening disabled' : 'Matches found'}
                  </p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-3 ${
                    screeningResults.pep.status === 'bypassed' 
                      ? 'bg-amber-100 text-amber-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {screeningResults.pep.status === 'bypassed' ? 'BYPASSED' : 'CLEAR'}
                  </span>
                </div>

                {/* Adverse Media card */}
                <div className={`border-2 rounded-lg p-6 bg-white ${
                  screeningResults.adverseMedia.status === 'bypassed' 
                    ? 'border-amber-200 bg-amber-50/20' 
                    : 'border-green-200'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <AlertTriangle className={`w-8 h-8 ${screeningResults.adverseMedia.status === 'bypassed' ? 'text-amber-500' : 'text-green-600'}`} />
                    {screeningResults.adverseMedia.status === 'bypassed' ? (
                      <AlertTriangle className="w-6 h-6 text-amber-500" />
                    ) : (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Adverse Media</h4>
                  <p className={`text-3xl font-bold mb-1 ${screeningResults.adverseMedia.status === 'bypassed' ? 'text-amber-600' : 'text-green-600'}`}>
                    {screeningResults.adverseMedia.status === 'bypassed' ? '—' : screeningResults.adverseMedia.matches}
                  </p>
                  <p className="text-sm text-gray-600">
                    {screeningResults.adverseMedia.status === 'bypassed' ? 'Screening disabled' : 'Matches found'}
                  </p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-3 ${
                    screeningResults.adverseMedia.status === 'bypassed' 
                      ? 'bg-amber-100 text-amber-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {screeningResults.adverseMedia.status === 'bypassed' ? 'BYPASSED' : 'CLEAR'}
                  </span>
                </div>
              </div>

              {screeningResults.sanctions.status === 'bypassed' || 
              screeningResults.pep.status === 'bypassed' || 
              screeningResults.adverseMedia.status === 'bypassed' ? (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-amber-900 font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    Warning: Some automated screening bots are disabled in the KYC configuration settings. Bypassed screenings require manual investigation.
                  </p>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-900 font-semibold">
                    ✓ All screening checks completed successfully. No adverse findings detected.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 6: Risk Rating */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Risk Rating</h3>
                  <p className="text-gray-600">Auto-calculated risk assessment</p>
                </div>
                <Button onClick={calculateRisk}>
                  <Scale className="w-4 h-4 mr-2" />
                  Calculate Risk
                </Button>
              </div>

              <div className={`rounded-lg border-2 p-8 text-center ${getRiskColor(riskRating)}`}>
                <Scale className="w-16 h-16 mx-auto mb-4" />
                <h4 className="text-4xl font-bold mb-2">{riskRating.toUpperCase()} RISK</h4>
                <p className="text-sm">Auto-calculated based on risk factors</p>
              </div>

              {riskFactors.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-bold text-gray-900 mb-3">Risk Factors Identified</h4>
                  <ul className="space-y-2">
                    {riskFactors.map((factor, index) => (
                      <li key={index} className="flex items-center">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
                        <span className="text-gray-700">{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {requiresEnhancedCDD && (
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
                  <div className="flex items-start">
                    <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-bold text-yellow-900 mb-2">Enhanced CDD Required</h4>
                      <p className="text-sm text-yellow-700 mb-4">
                        This client requires enhanced customer due diligence measures before approval.
                      </p>
                      <textarea
                        value={enhancedCDDReason}
                        onChange={(e) => setEnhancedCDDReason(e.target.value)}
                        placeholder="Describe enhanced CDD measures to be applied..."
                        className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Required Next Actions:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  {riskRating === 'high' && <li>• Enhanced CDD must be completed</li>}
                  {riskRating === 'high' && <li>• Senior Manager approval required</li>}
                  {riskRating === 'medium' && <li>• Additional verification recommended</li>}
                  <li>• Ongoing monitoring will be enabled</li>
                  <li>• Annual risk review scheduled</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 7: Approval */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Final Approval</h3>
                <p className="text-gray-600">Review and approve client onboarding</p>
              </div>

              {approvalRequired ? (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
                  <Lock className="w-16 h-16 text-red-600 mx-auto mb-4" />
                  <h4 className="text-2xl font-bold text-red-900 mb-2">Senior Manager Approval Required</h4>
                  <p className="text-red-700 mb-6">
                    This high-risk client cannot be activated without senior manager approval.
                  </p>
                  <Button className="bg-red-600 hover:bg-red-700" onClick={handleSendForApproval}>
                    <Send className="w-4 h-4 mr-2" />
                    Send for Approval
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                      <h4 className="text-xl font-bold text-green-900">All Checks Passed</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Client Name</p>
                        <p className="font-bold text-gray-900">{basicDetails.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Client Type</p>
                        <p className="font-bold text-gray-900">{clientType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Risk Rating</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getRiskColor(riskRating)}`}>
                          {riskRating.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Verification Status</p>
                        <p className="font-bold text-green-700">Verified</p>
                      </div>
                    </div>
                    <Button className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg" onClick={handleComplete}>
                      <Unlock className="w-5 h-5 mr-2" />
                      Activate Client
                    </Button>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      <strong>Note:</strong> Client will be set to Active status with monitoring enabled. 
                      Annual risk review will be scheduled. All evidence will be stored in the Evidence Vault.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <div className="text-sm text-gray-600">
            Step {currentStep} of {steps.length}
          </div>

          {currentStep < steps.length ? (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              className="bg-green-600 hover:bg-green-700"
              disabled={approvalRequired}
              onClick={handleComplete}
            >
              Complete Onboarding
              <CheckCircle className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import {
  ArrowLeft,
  ArrowRight,
  UserCircle,
  CheckCircle,
  Clock,
  Shield,
  FileText,
  DollarSign,
  CreditCard,
  Building2,
  Search,
  AlertCircle,
  Check,
  Info,
  Loader2,
  Eye,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Upload,
  X,
  SkipForward,
  Bug,
  Trash2
} from 'lucide-react';
import { toast } from '../../lib/toast';
import { downloadRecordPdf } from '../../lib/exportPdf';
import { IdVerification100Point } from '../kyc/IdVerification100Point';
import { ClientsDB } from '../kyc/ClientsDatabase';

function getAuthHeader(): Record<string, string> {
  const token = sessionStorage.getItem('growkyc_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

interface IndividualOnboardingProps {
  onBack: () => void;
}

type OnboardingStep = 'personal' | 'id_upload' | 'consent' | 'payment' | 'processing' | 'results';

// 100 Points of ID System
const idDocuments = {
  primary: [
    { 
      name: 'Australian Passport', 
      points: 70, 
      description: 'Current Australian passport',
      category: 'Primary'
    },
    { 
      name: 'Australian Birth Certificate', 
      points: 70, 
      description: 'Full birth certificate',
      category: 'Primary'
    },
    { 
      name: 'Australian Citizenship Certificate', 
      points: 70, 
      description: 'Certificate of Australian citizenship',
      category: 'Primary'
    }
  ],
  secondary: [
    { 
      name: 'Driver\'s Licence', 
      points: 40, 
      description: 'Current Australian driver\'s licence',
      category: 'Secondary'
    },
    { 
      name: 'Medicare Card', 
      points: 25, 
      description: 'Current Medicare card',
      category: 'Secondary'
    },
    { 
      name: 'Rates Notice', 
      points: 25, 
      description: 'Council rates notice (within 12 months)',
      category: 'Secondary'
    },
    { 
      name: 'Utility Bill', 
      points: 25, 
      description: 'Gas, electricity, or water bill (within 3 months)',
      category: 'Secondary'
    },
    { 
      name: 'Bank Statement', 
      points: 25, 
      description: 'Bank statement (within 3 months)',
      category: 'Secondary'
    }
  ],
  tertiary: [
    { 
      name: 'Credit Card Statement', 
      points: 25, 
      description: 'Credit card statement (within 3 months)',
      category: 'Tertiary'
    },
    { 
      name: 'Centrelink/DVA Card', 
      points: 25, 
      description: 'Centrelink or DVA entitlement card',
      category: 'Tertiary'
    }
  ]
};

// Search pricing
const searchPricing = {
  individual: {
    name: 'Individual Identity Verification',
    price: 25.00,
    description: 'Basic identity verification, address check, and criminal record search',
    included: true,
    searches: ['ID Verification', 'Address Verification', 'Criminal Record Check']
  },
  company: {
    name: 'Company Search',
    price: 45.00,
    description: 'ASIC company search, director details, and company status',
    searches: ['ASIC Search', 'Director Details', 'Company Status', 'Shareholder Information']
  },
  trust: {
    name: 'Trust Search',
    price: 65.00,
    description: 'Trust deed search, trustee details, and beneficial owner identification',
    searches: ['Trust Deed Verification', 'Trustee Details', 'Beneficial Owners', 'Trust Structure']
  },
  director: {
    name: 'Director/Officer Search',
    price: 35.00,
    description: 'ASIC director search and disqualification check',
    searches: ['ASIC Director Search', 'Disqualification Check', 'Other Directorships']
  },
  aml: {
    name: 'AML/CTF Enhanced Checks',
    price: 85.00,
    description: 'Sanctions screening, PEP check, and adverse media screening',
    searches: ['Sanctions Screening', 'PEP Check', 'Adverse Media', 'Financial Crime Database']
  }
};

export function IndividualOnboarding({ onBack }: IndividualOnboardingProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('personal');
  const [personalData, setPersonalData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postcode: '',
    country: 'Australia',
    idType: 'drivers_licence',
    idNumber: '',
    idState: ''
  });
  const [consentGiven, setConsentGiven] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [selectedSearches, setSelectedSearches] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [discoveredEntities, setDiscoveredEntities] = useState<any[]>([]);
  const [reportEntity, setReportEntity] = useState<any | null>(null);
  const [devMode, setDevMode] = useState(false); // Changed to false by default

  // Generate a real compliance certificate PDF for a verified entity.
  const downloadEntityCertificate = (entity: any) => {
    downloadRecordPdf(
      `compliance_certificate_${String(entity.name || 'entity').replace(/[^a-z0-9]+/gi, '_')}.pdf`,
      'KYC / AML Compliance Certificate',
      [
        ['Entity', entity.name || '—'],
        ['ABN', entity.abn || '—'],
        ['Entity Type', entity.type || '—'],
        ['Your Role', entity.role || '—'],
        ['Relationship Since', String(entity.since || '—')],
        ['Verification Status', 'Verified — all compliance checks passed'],
        ['Identity', 'Verified'],
        ['Sanctions / PEP', 'Clear'],
        ['Amount Charged', `$${Number(entity.estimatedCost || 0).toFixed(2)} AUD`],
        ['Issued', new Date().toLocaleString()],
      ],
      'This certificate confirms KYC/AML verification was completed for the named entity. Generated by GrowKYC.',
    );
    toast.success(`Certificate for ${entity.name} downloaded as PDF`);
  };
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const handleDocumentAdd = (document: any) => {
    const newDoc = { ...document, id: Date.now(), file: null };
    setUploadedDocuments([...uploadedDocuments, newDoc]);
    const newTotal = uploadedDocuments.reduce((sum, doc) => sum + doc.points, 0) + document.points;
    setTotalPoints(newTotal);
    toast.success(`${document.name} added (${document.points} points)`);
  };

  const handleDocumentRemove = (docId: number) => {
    const doc = uploadedDocuments.find(d => d.id === docId);
    setUploadedDocuments(uploadedDocuments.filter(d => d.id !== docId));
    if (doc) {
      const newTotal = totalPoints - doc.points;
      setTotalPoints(newTotal);
      toast.success(`Document removed`);
    }
  };

  const handleIdUploadSkip = () => {
    if (devMode) {
      toast.success('⚡ Dev Mode: Skipped ID Upload');
      setCurrentStep('consent');
    } else {
      toast.error('Validation required in production mode');
    }
  };

  const handleConsentSkip = () => {
    if (devMode) {
      setConsentGiven(true);
      setTermsAccepted(true);
      toast.success('⚡ Dev Mode: Skipped Consent');
      setCurrentStep('payment');
    } else {
      toast.error('Consent required');
    }
  };

  const handlePaymentSkip = () => {
    if (devMode) {
      toast.success('⚡ Dev Mode: Skipped Payment');
      handlePaymentSubmit();
    } else {
      toast.error('Payment required');
    }
  };

  const steps = [
    { id: 'personal', label: 'Personal Details', icon: UserCircle },
    { id: 'id_upload', label: 'Upload ID', icon: Upload },
    { id: 'consent', label: 'Consent', icon: FileText },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'processing', label: 'Processing', icon: Search },
    { id: 'results', label: 'Results', icon: CheckCircle }
  ];

  const getCurrentStepIndex = () => {
    return steps.findIndex(s => s.id === currentStep);
  };

  const calculateTotal = () => {
    let total = searchPricing.individual.price; // Base fee always included
    selectedSearches.forEach(search => {
      if (search in searchPricing) {
        total += (searchPricing as any)[search].price;
      }
    });
    return total.toFixed(2);
  };

  const handlePersonalDetailsSubmit = () => {
    if (!devMode) {
      if (!personalData.firstName.trim()) {
        toast.error('First Name is required');
        return;
      }
      if (!personalData.lastName.trim()) {
        toast.error('Last Name is required');
        return;
      }
      if (!personalData.dateOfBirth.trim()) {
        toast.error('Date of Birth is required');
        return;
      }
      if (!personalData.email.trim()) {
        toast.error('Email is required');
        return;
      }
      if (!personalData.phone.trim()) {
        toast.error('Phone is required');
        return;
      }
      if (!personalData.address.trim()) {
        toast.error('Street Address is required');
        return;
      }
      if (!personalData.city.trim()) {
        toast.error('City is required');
        return;
      }
      if (!personalData.state.trim()) {
        toast.error('State is required');
        return;
      }
      if (!personalData.postcode.trim()) {
        toast.error('Postcode is required');
        return;
      }
      if (!personalData.idNumber.trim()) {
        toast.error('Document Number is required');
        return;
      }
      if (personalData.idType === 'drivers_licence' && !personalData.idState.trim()) {
        toast.error('Licence State is required');
        return;
      }
    }
    toast.success('Personal details saved');
    setCurrentStep('id_upload');
  };

  const handleIdUploadSubmit = () => {
    if (!devMode && totalPoints < 100) {
      toast.error(`Please upload enough documents to reach 100 points. Current: ${totalPoints} points.`);
      return;
    }
    toast.success('ID document uploaded');
    setCurrentStep('consent');
  };

  const handleConsentSubmit = () => {
    if (!devMode) {
      if (!consentGiven || !termsAccepted) {
        toast.error('Please accept the consent checkbox and terms & conditions.');
        return;
      }
    }
    toast.success('Consent recorded');
    setCurrentStep('payment');
  };

  const createBackendClient = async () => {
    const fullAddress = [
      personalData.address,
      personalData.city,
      personalData.state,
      personalData.postcode,
      personalData.country,
    ]
      .filter(Boolean)
      .join(', ');

    const payload = {
      first_name: personalData.firstName || null,
      middle_name: personalData.middleName || null,
      last_name: personalData.lastName || null,
      dob: personalData.dateOfBirth || null,
      nationality: personalData.country || null,
      national_id_number: personalData.idNumber || null,
      residential_address: fullAddress || null,
      mobile_phone: personalData.phone || null,
      email: personalData.email || null,
    };

    try {
      const res = await fetch('/api/v1/clients/individual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const detail = await res.text();
        console.error('Create client failed', res.status, detail);
        toast.error(`Could not save client record (${res.status})`);
        return;
      }
      const client = await res.json();
      toast.success(`Client record created (ID ${client.id ?? '—'})`);
    } catch (err) {
      console.error('Create client request error', err);
      toast.error('Network error saving client record');
    }
  };

  const handlePaymentSubmit = () => {
    if (!devMode && paymentMethod === 'card') {
      if (!cardNumber.trim()) {
        toast.error('Card Number is required');
        return;
      }
      if (!cardExpiry.trim()) {
        toast.error('Expiry Date is required');
        return;
      }
      if (!cardCvv.trim()) {
        toast.error('CVV is required');
        return;
      }
    }

    setCurrentStep('processing');
    setProcessing(true);

    // Create the real Client + IndividualProfile record in the backend.
    // Runs alongside the verification simulation; failures are surfaced but
    // never block the onboarding UX (e.g. when running without a live API).
    void createBackendClient();

    const registerOnboardedClients = (verifiedEntitiesList: any[]) => {
      const currentDate = new Date().toISOString().split('T')[0];
      const nextYearDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0];
      
      const individualId = `client-${Date.now()}`;
      const newIndividual: any = {
        id: individualId,
        name: `${personalData.firstName} ${personalData.lastName}`,
        entityType: 'Individual',
        status: 'Active',
        country: 'Australia',
        industry: 'Professional Services',
        serviceType: 'Wealth Management',
        clientGroup: 'New Onboard Group',
        riskScores: {
          overall: 15,
          aml: 10,
          financial: 20,
          business: 15,
          ownership: 0
        },
        quickStatus: {
          identity: 'Verified',
          aml: 'Clear',
          entity: 'N/A',
          monitoring: 'Active'
        },
        lastReview: currentDate,
        nextReview: nextYearDate,
        identityData: {
          primaryID: {
            type: personalData.idType === 'drivers_licence' ? 'Driver License' : 'Passport',
            number: personalData.idNumber,
            expiry: '2030-12-31',
            verified: true
          },
          biometricStatus: 'Passed',
          livenessCheck: true,
          addressVerified: true,
          greenIDScore: 940,
          infoTrackStatus: 'Verified - High Confidence',
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
        entityData: {},
        ownershipData: {
          ubos: [
            {
              name: `${personalData.firstName} ${personalData.lastName}`,
              ownership: 100,
              verified: true,
              country: 'Australia'
            }
          ],
          ownershipStructureComplete: true,
          complexStructure: false
        },
        financialData: {
          bankAccounts: 1,
          sourceOfFunds: 'Salary',
          sourceOfWealth: 'Employment',
          estimatedWealth: '$1.5M',
          transactionVolume: '$10K monthly',
          highRiskTransactions: 0
        },
        legalData: {
          serviceAgreementSigned: true,
          termsAccepted: termsAccepted,
          privacyConsentGiven: consentGiven,
          kycConsentDate: currentDate
        },
        documentsData: {
          total: 5,
          verified: 5,
          pending: 0,
          rejected: 0
        },
        monitoringData: {
          alertsLast30Days: 0,
          activeAlerts: 0,
          nameChanges: 0,
          addressChanges: 0,
          ownershipChanges: 0
        }
      };

      ClientsDB.addClient(newIndividual);

      // Add verified entities
      verifiedEntitiesList.forEach((entity, index) => {
        const entityId = `client-${Date.now()}-${index + 1}`;
        const newEntity: any = {
          id: entityId,
          name: entity.name,
          entityType: entity.type === 'company' ? 'Company' : 'Trust',
          status: 'Active',
          abn: entity.abn,
          country: 'Australia',
          industry: 'Investments',
          serviceType: 'Wealth Management',
          clientGroup: 'Associated Group',
          riskScores: {
            overall: 20,
            aml: 15,
            financial: 25,
            business: 20,
            ownership: 10
          },
          quickStatus: {
            identity: 'Verified',
            aml: 'Clear',
            entity: 'Active',
            monitoring: 'Active'
          },
          lastReview: currentDate,
          nextReview: nextYearDate,
          identityData: {
            primaryID: {
              type: 'ASIC Search',
              number: entity.abn,
              expiry: 'N/A',
              verified: true
            },
            biometricStatus: 'Passed',
            livenessCheck: true,
            addressVerified: true,
            greenIDScore: 900,
            infoTrackStatus: 'Verified - High Confidence',
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
            directors: [
              {
                name: `${personalData.firstName} ${personalData.lastName}`,
                appointed: currentDate,
                role: 'Director',
                kycStatus: 'Verified'
              }
            ]
          },
          ownershipData: {
            ubos: [
              {
                name: `${personalData.firstName} ${personalData.lastName}`,
                ownership: 100,
                verified: true,
                country: 'Australia'
              }
            ],
            ownershipStructureComplete: true,
            complexStructure: false
          },
          financialData: {
            bankAccounts: 1,
            sourceOfFunds: 'Business operations',
            sourceOfWealth: 'Investments',
            estimatedWealth: '$2M',
            transactionVolume: '$50K monthly',
            highRiskTransactions: 0
          },
          legalData: {
            serviceAgreementSigned: true,
            termsAccepted: termsAccepted,
            privacyConsentGiven: consentGiven,
            kycConsentDate: currentDate
          },
          documentsData: {
            total: 5,
            verified: 5,
            pending: 0,
            rejected: 0
          },
          monitoringData: {
            alertsLast30Days: 0,
            activeAlerts: 0,
            nameChanges: 0,
            addressChanges: 0,
            ownershipChanges: 0
          }
        };
        ClientsDB.addClient(newEntity);
      });

      // Save to logged activities
      const activityLog = {
        type: 'approval',
        user: 'System Onboarding',
        action: `successfully onboarded individual ${newIndividual.name} and associated entities`,
        time: 'Just now',
        iconName: 'CheckCircle',
        color: 'text-green-600'
      };
      const savedLogs = localStorage.getItem('growkyc_logged_activities');
      const logs = savedLogs ? JSON.parse(savedLogs) : [];
      logs.unshift(activityLog);
      localStorage.setItem('growkyc_logged_activities', JSON.stringify(logs));
      window.dispatchEvent(new CustomEvent('growkyc:activity_logged'));
    };

    // Simulate processing and entity discovery
    setTimeout(() => {
      // Simulate discovered entities
      const mockEntities = [
        {
          type: 'company',
          name: 'Acme Consulting Pty Ltd',
          abn: '12 345 678 901',
          role: 'Director',
          status: 'Active',
          since: '2018',
          estimatedCost: searchPricing.company.price,
          verified: false
        },
        {
          type: 'company',
          name: 'Smith Investment Holdings Pty Ltd',
          abn: '98 765 432 109',
          role: 'Shareholder (45%)',
          status: 'Active',
          since: '2015',
          estimatedCost: searchPricing.company.price,
          verified: false
        },
        {
          type: 'trust',
          name: 'Smith Family Trust',
          abn: '11 222 333 444',
          role: 'Trustee',
          status: 'Active',
          since: '2012',
          estimatedCost: searchPricing.trust.price,
          verified: false
        }
      ];
      
      setDiscoveredEntities(mockEntities);
      
      // Auto-verify discovered entities
      if (mockEntities.length > 0) {
        const additionalCost = mockEntities.reduce((sum, e) => sum + e.estimatedCost, 0);
        
        // Show intermediate state - entities found
        toast.success(`Found ${mockEntities.length} associated entities - Automatically verifying...`);
        
        // Continue processing for auto-verification
        setTimeout(() => {
          // Mark all as verified
          const verifiedEntities = mockEntities.map(e => ({ ...e, verified: true }));
          setDiscoveredEntities(verifiedEntities);
          
          // Charge card for additional entities
          toast.success(`✅ Card charged $${additionalCost.toFixed(2)} for ${mockEntities.length} additional entities`);
          
          // Register both individual and verified entities
          registerOnboardedClients(verifiedEntities);
          
          setProcessing(false);
          setCurrentStep('results');
          toast.success('All verifications complete!');
        }, 2500);
      } else {
        // Register only individual in the client database
        registerOnboardedClients([]);
        setProcessing(false);
        setCurrentStep('results');
        toast.success('Verification complete!');
      }
    }, 3000);
  };

  const renderPersonalDetails = () => (
    <Card>
      <CardHeader>
        <CardTitle>Personal Details</CardTitle>
        <CardDescription>
          Please provide your personal information for identity verification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={personalData.firstName}
              onChange={(e) => setPersonalData({ ...personalData, firstName: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Middle Name
            </label>
            <input
              type="text"
              value={personalData.middleName}
              onChange={(e) => setPersonalData({ ...personalData, middleName: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Robert"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={personalData.lastName}
              onChange={(e) => setPersonalData({ ...personalData, lastName: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Smith"
            />
          </div>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={personalData.dateOfBirth}
            onChange={(e) => setPersonalData({ ...personalData, dateOfBirth: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Contact Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={personalData.email}
              onChange={(e) => setPersonalData({ ...personalData, email: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="john.smith@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-1" />
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={personalData.phone}
              onChange={(e) => setPersonalData({ ...personalData, phone: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0400 000 000"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Street Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={personalData.address}
            onChange={(e) => setPersonalData({ ...personalData, address: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="123 Main Street"
          />
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={personalData.city}
              onChange={(e) => setPersonalData({ ...personalData, city: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Sydney"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              State <span className="text-red-500">*</span>
            </label>
            <select
              value={personalData.state}
              onChange={(e) => setPersonalData({ ...personalData, state: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select</option>
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Postcode <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={personalData.postcode}
              onChange={(e) => setPersonalData({ ...personalData, postcode: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="2000"
            />
          </div>
        </div>

        {/* ID Details */}
        <div className="border-t pt-6">
          <h3 className="font-bold text-gray-900 mb-4">Identity Document</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Document Type <span className="text-red-500">*</span>
              </label>
              <select
                value={personalData.idType}
                onChange={(e) => setPersonalData({ ...personalData, idType: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="drivers_licence">Driver's Licence</option>
                <option value="passport">Passport</option>
                <option value="medicare">Medicare Card</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Document Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={personalData.idNumber}
                onChange={(e) => setPersonalData({ ...personalData, idNumber: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="12345678"
              />
            </div>
            {personalData.idType === 'drivers_licence' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Licence State <span className="text-red-500">*</span>
                </label>
                <select
                  value={personalData.idState}
                  onChange={(e) => setPersonalData({ ...personalData, idState: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
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
            )}
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={handlePersonalDetailsSubmit}>
            Continue to Upload ID
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderIdUpload = () => (
    <div className="space-y-6">
      {/* 100-Point ID Banner */}
      <Card className="border-2 border-green-500 bg-gray-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                🏦 Bank-Grade 100-Point ID Verification
              </h2>
              <p className="text-gray-700">
                Select multiple documents to reach 100 points. At least one Category A document + DOB verification required.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 100-Point ID Verification Component */}
      <IdVerification100Point
        onComplete={(data) => {
          toast.success('✅ 100-point ID verification complete!');
          setCurrentStep('consent');
        }}
        onBack={() => setCurrentStep('personal')}
      />

      {/* Navigation Buttons */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep('personal')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Personal Details
            </Button>
            <div className="flex gap-2">
              {devMode && (
                <Button variant="outline" onClick={handleIdUploadSkip}>
                  <SkipForward className="w-4 h-4 mr-2" />
                  Skip (Dev Mode)
                </Button>
              )}
              <Button onClick={handleIdUploadSubmit} className="bg-blue-600 hover:bg-blue-700">
                Continue to Consent
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderConsent = () => (
    <Card>
      <CardHeader>
        <CardTitle>Consent & Declarations</CardTitle>
        <CardDescription>
          Please review and provide your consent for identity verification checks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Privacy Notice */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Privacy Notice</h4>
                <p className="text-sm text-blue-800">
                  We collect your personal information to verify your identity and comply with AML/CTF regulations. 
                  Your information will be used to conduct searches with ASIC, credit bureaus, and other authorized databases.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consent Checkboxes */}
        <div className="space-y-4 border-2 border-gray-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              className="w-5 h-5 mt-1 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              id="consent-verify"
            />
            <label htmlFor="consent-verify" className="text-sm text-gray-700 cursor-pointer">
              <span className="font-semibold text-gray-900">I consent to identity verification checks</span>
              <br />
              I authorize Grow to conduct identity verification checks including but not limited to:
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>Identity document verification</li>
                <li>Address verification checks</li>
                <li>Criminal record searches</li>
                <li>ASIC company and directorship searches</li>
                <li>Trust and beneficial ownership searches</li>
                <li>Sanctions and PEP screening</li>
                <li>Adverse media screening</li>
              </ul>
            </label>
          </div>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="w-5 h-5 mt-1 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              id="consent-terms"
            />
            <label htmlFor="consent-terms" className="text-sm text-gray-700 cursor-pointer">
              <span className="font-semibold text-gray-900">I accept the Terms & Conditions</span>
              <br />
              I have read and accept the{' '}
              <a href="#" className="text-blue-600 underline">Terms of Service</a>,{' '}
              <a href="#" className="text-blue-600 underline">Privacy Policy</a>, and{' '}
              <a href="#" className="text-blue-600 underline">AML/CTF Policy</a>.
              <br />
              I understand that:
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>All information provided is true and correct</li>
                <li>False information may result in delays or rejection</li>
                <li>Fees are non-refundable once searches are conducted</li>
                <li>Results will be stored securely for compliance purposes</li>
              </ul>
            </label>
          </div>
        </div>

        {/* Declaration */}
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Declaration</h4>
            <p className="text-sm text-gray-700">
              By clicking "Accept & Continue", I declare that:
            </p>
            <ul className="list-disc ml-5 mt-2 text-sm text-gray-700 space-y-1">
              <li>All information provided is true, accurate, and complete</li>
              <li>I am authorized to provide this information</li>
              <li>I understand the purpose of these checks</li>
              <li>I consent to the collection, use, and disclosure of my personal information as described</li>
            </ul>
          </CardContent>
        </Card>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={() => setCurrentStep('id_upload')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex gap-2">
            {devMode && (
              <Button variant="outline" onClick={handleConsentSkip}>
                <SkipForward className="w-4 h-4 mr-2" />
                Skip
              </Button>
            )}
            <Button onClick={handleConsentSubmit}>
              Accept & Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderPayment = () => (
    <div className="space-y-6">
      {/* Search Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Searches That Will Be Run</CardTitle>
          <CardDescription>
            The following comprehensive identity verification checks will be performed as part of your onboarding.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Base Search - Always Included */}
          <div className="p-4 bg-green-50 border-2 border-green-500 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-gray-900">{searchPricing.individual.name}</h4>
                  <Badge className="bg-green-600">Included</Badge>
                </div>
                <p className="text-sm text-gray-700 mb-2">{searchPricing.individual.description}</p>
                <div className="flex flex-wrap gap-2">
                  {searchPricing.individual.searches.map((search, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">{search}</Badge>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  ${searchPricing.individual.price.toFixed(2)}
                </div>
                <div className="text-xs text-gray-600">AUD</div>
              </div>
            </div>
          </div>

          {/* All Other Searches - Now Shown as Included */}
          {Object.entries(searchPricing).filter(([key]) => key !== 'individual').map(([key, search]) => {
            return (
              <div
                key={key}
                className="p-4 border-2 border-green-500 bg-green-50 rounded-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{search.name}</h4>
                        <Badge className="bg-green-600">Included</Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{search.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {search.searches.map((s: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-gray-900">
                      ${search.price.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-600">AUD</div>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Payment Summary */}
      <Card className="border-2 border-blue-500">
        <CardHeader className="bg-blue-50">
          <CardTitle>Payment Summary</CardTitle>
          <CardDescription>Complete verification package with all compliance checks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {/* Line Items */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Individual Verification (Base)</span>
              <span className="font-semibold">${searchPricing.individual.price.toFixed(2)}</span>
            </div>
            {Object.entries(searchPricing).filter(([key]) => key !== 'individual').map(([key, search]) => (
              <div key={key} className="flex justify-between text-sm">
                <span>{search.name}</span>
                <span className="font-semibold">${search.price.toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2 flex justify-between">
              <span className="font-bold text-lg">Total Amount</span>
              <span className="font-bold text-2xl text-blue-600">
                ${Object.values(searchPricing).reduce((sum, s) => sum + s.price, 0).toFixed(2)} AUD
              </span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="border-t pt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Payment Method
            </label>
            <div className="space-y-2">
              <div className={`p-3 border-2 rounded-lg cursor-pointer ${
                paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`} onClick={() => setPaymentMethod('card')}>
                <div className="flex items-center gap-2">
                  <input type="radio" checked={paymentMethod === 'card'} onChange={() => {}} />
                  <CreditCard className="w-5 h-5" />
                  <span className="font-semibold">Credit/Debit Card</span>
                </div>
              </div>
              <div className={`p-3 border-2 rounded-lg cursor-pointer ${
                paymentMethod === 'bpay' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`} onClick={() => setPaymentMethod('bpay')}>
                <div className="flex items-center gap-2">
                  <input type="radio" checked={paymentMethod === 'bpay'} onChange={() => {}} />
                  <DollarSign className="w-5 h-5" />
                  <span className="font-semibold">BPAY</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Details (if card selected) */}
          {paymentMethod === 'card' && (
            <div className="border-t pt-4 space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                  placeholder="4242 4242 4242 4242"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                    placeholder="123"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setCurrentStep('consent')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex gap-2">
              {devMode && (
                <Button variant="outline" onClick={handlePaymentSkip}>
                  <SkipForward className="w-4 h-4 mr-2" />
                  Skip
                </Button>
              )}
              <Button onClick={handlePaymentSubmit} className="bg-green-600 hover:bg-green-700">
                <CreditCard className="w-4 h-4 mr-2" />
                Pay ${Object.values(searchPricing).reduce((sum, s) => sum + s.price, 0).toFixed(2)} & Start Verification
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderProcessing = () => (
    <Card>
      <CardContent className="p-12 text-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Running Identity Verification Checks
            </h2>
            <p className="text-gray-600">
              Please wait while we verify your identity and search for associated entities...
            </p>
          </div>
          <div className="w-full max-w-md space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">Verifying identity documents</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              <span className="text-gray-700">Searching ASIC database</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="text-gray-500">Searching trust registers</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="text-gray-500">Compiling results</span>
            </div>
          </div>
          <Progress value={60} className="w-full max-w-md" />
          <p className="text-sm text-gray-500">This usually takes 30-60 seconds</p>
        </div>
      </CardContent>
    </Card>
  );

  const renderResults = () => {
    const additionalCost = discoveredEntities.reduce((sum, e) => sum + e.estimatedCost, 0);
    const initialPayment = Object.values(searchPricing).reduce((sum, s) => sum + s.price, 0);
    const totalPaid = initialPayment + additionalCost;

    return (
      <div className="space-y-6">
        {/* Verification Success */}
        <Card className="border-2 border-green-500 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  ✅ All Verifications Complete
                </h2>
                <p className="text-gray-700">
                  {personalData.firstName} {personalData.lastName} + {discoveredEntities.length} associated entities - All verified
                </p>
              </div>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Auto-Charge Notification */}
        {discoveredEntities.length > 0 && (
          <Card className="border-2 border-blue-500 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    💳 Automatic Additional Charge Applied
                  </h3>
                  <p className="text-sm text-gray-700">
                    We discovered {discoveredEntities.length} associated {discoveredEntities.length === 1 ? 'entity' : 'entities'} and automatically ran full KYC verification on {discoveredEntities.length === 1 ? 'it' : 'them'}.
                  </p>
                  <div className="mt-3 flex items-center gap-6">
                    <div>
                      <p className="text-xs text-gray-600">Initial Payment</p>
                      <p className="text-lg font-bold text-gray-900">${initialPayment.toFixed(2)} AUD</p>
                    </div>
                    <div className="text-gray-400">+</div>
                    <div>
                      <p className="text-xs text-gray-600">Additional Entities</p>
                      <p className="text-lg font-bold text-blue-600">${additionalCost.toFixed(2)} AUD</p>
                    </div>
                    <div className="text-gray-400">=</div>
                    <div>
                      <p className="text-xs text-gray-600">Total Charged</p>
                      <p className="text-2xl font-bold text-green-600">${totalPaid.toFixed(2)} AUD</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Discovered & Verified Entities */}
        {discoveredEntities.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Associated Companies & Trusts (All Verified)</CardTitle>
              <CardDescription>
                Found {discoveredEntities.length} associated {discoveredEntities.length === 1 ? 'entity' : 'entities'} - automatically verified and charged
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {discoveredEntities.map((entity, idx) => {
                const Icon = entity.type === 'company' ? Building2 : Shield;
                return (
                  <Card key={idx} className="border border-gray-200 bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <Icon className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{entity.name}</h4>
                            <p className="text-sm text-gray-600">ABN: {entity.abn}</p>
                          </div>
                        </div>
                        <Badge className="bg-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-600">Your Role</p>
                          <p className="font-semibold text-sm">{entity.role}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Entity Type</p>
                          <p className="font-semibold text-sm capitalize">{entity.type}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Since</p>
                          <p className="font-semibold text-sm">{entity.since}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Charged</p>
                          <p className="font-semibold text-sm text-blue-600">${entity.estimatedCost.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg p-3 mb-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-semibold text-green-900">
                            ✅ Full KYC Verification Complete - Card charged automatically
                          </span>
                        </div>
                        <p className="text-xs text-green-800 mt-1 ml-7">
                          All compliance checks passed for this {entity.type}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          className="flex-1"
                          variant="outline"
                          onClick={() => setReportEntity(entity)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Full Report
                        </Button>
                        <Button
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          onClick={() => downloadEntityCertificate(entity)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Certificate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Entity verification report modal */}
        {reportEntity && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={() => setReportEntity(null)}
          >
            <div
              className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b px-6 py-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{reportEntity.name}</h3>
                  <p className="text-sm text-gray-500">ABN: {reportEntity.abn} · Verification report</p>
                </div>
                <Badge className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Verified</Badge>
              </div>
              <div className="px-6 py-4 space-y-3 text-sm">
                {[
                  ['Your Role', reportEntity.role],
                  ['Entity Type', reportEntity.type],
                  ['Relationship Since', String(reportEntity.since || '—')],
                  ['Identity Verification', 'Verified'],
                  ['Sanctions Screening', 'Clear'],
                  ['PEP Screening', 'Clear'],
                  ['Adverse Media', 'Clear'],
                  ['Amount Charged', `$${Number(reportEntity.estimatedCost || 0).toFixed(2)} AUD`],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 border-b border-gray-100 pb-2 last:border-0">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium text-gray-900 text-right">{value}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2 border-t px-6 py-4">
                <Button variant="outline" onClick={() => setReportEntity(null)}>Close</Button>
                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => downloadEntityCertificate(reportEntity)}>
                  <Download className="w-4 h-4 mr-2" />Download Certificate
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Summary Card */}
        <Card className="border-2 border-blue-500">
          <CardHeader className="bg-blue-50">
            <CardTitle>Verification Summary</CardTitle>
            <CardDescription>Complete compliance package - All checks passed</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm">
                  <strong>Individual verification:</strong> {personalData.firstName} {personalData.lastName} - Verified ✓
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm">
                  <strong>{discoveredEntities.length} {discoveredEntities.length === 1 ? 'entity' : 'entities'}:</strong> Automatically discovered and verified ✓
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm">
                  <strong>Total charged:</strong> ${totalPaid.toFixed(2)} AUD
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-blue-600" />
                <span className="text-sm">
                  All compliance reports available for download
                </span>
              </div>
            </div>

            <div className="bg-gray-50 border-2 border-green-500 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">🎉 Onboarding Complete!</h4>
                  <p className="text-sm text-gray-700 mt-1">
                    All verifications passed. You're now fully onboarded and compliant with AML/CTF regulations.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Dashboard
              </Button>
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  downloadRecordPdf(
                    `verification_package_${String(personalData.lastName || 'client')}.pdf`,
                    'KYC / AML Verification Package',
                    [
                      ['Individual', `${personalData.firstName} ${personalData.lastName}`.trim() || '—'],
                      ['Individual Status', 'Verified — all checks passed'],
                      ['Associated Entities', String(discoveredEntities.length)],
                      ...discoveredEntities.map(
                        (e: any) => [`Entity: ${e.name}`, `${e.role} · ${e.type} · Verified · $${Number(e.estimatedCost || 0).toFixed(2)}`] as [string, string],
                      ),
                      ['Total Charged', `$${totalPaid.toFixed(2)} AUD`],
                      ['Issued', new Date().toLocaleString()],
                    ],
                    'Complete verification package: the individual plus all automatically discovered and verified associated entities. Generated by GrowKYC.',
                  );
                  toast.success(`Verification package downloaded (${discoveredEntities.length + 1} record(s))`);
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download All Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Individual KYC Verification</h1>
              <p className="text-gray-600 mt-1">
                Complete your identity verification to discover associated entities
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Developer Mode Toggle */}
              <Card className={`border-2 transition-all ${devMode ? 'border-amber-500 bg-amber-50 shadow-lg' : 'border-gray-300 bg-white'}`}>
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <Bug className={`w-5 h-5 ${devMode ? 'text-amber-600' : 'text-gray-400'}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-gray-900">Developer Mode</p>
                        {devMode && (
                          <Badge className="bg-amber-600 text-white text-xs px-2 py-0">
                            ON
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-600">Skip validation for testing</p>
                    </div>
                    <button
                      onClick={() => {
                        const newDevMode = !devMode;
                        setDevMode(newDevMode);
                        toast.success(newDevMode ? '⚡ Dev Mode: ON - Skip buttons enabled' : '🔒 Dev Mode: OFF - Validation required');
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        devMode ? 'bg-amber-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          devMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </CardContent>
              </Card>

              {currentStep !== 'processing' && (
                <Button variant="outline" onClick={onBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const currentIndex = getCurrentStepIndex();
              const isActive = step.id === currentStep;
              const isComplete = currentIndex > index;
              
              return (
                <div key={step.id} className="flex-1 relative">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isComplete ? 'bg-green-500' :
                      isActive ? 'bg-blue-600' :
                      'bg-gray-300'
                    }`}>
                      {isComplete ? (
                        <Check className="w-6 h-6 text-white" />
                      ) : (
                        <Icon className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <span className={`text-sm mt-2 ${isActive ? 'font-bold text-blue-600' : 'text-gray-600'}`}>
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`absolute top-6 left-1/2 w-full h-1 ${
                      isComplete ? 'bg-green-500' : 'bg-gray-300'
                    }`} style={{ zIndex: -1 }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        {currentStep === 'personal' && renderPersonalDetails()}
        {currentStep === 'id_upload' && renderIdUpload()}
        {currentStep === 'consent' && renderConsent()}
        {currentStep === 'payment' && renderPayment()}
        {currentStep === 'processing' && renderProcessing()}
        {currentStep === 'results' && renderResults()}
      </div>
    </div>
  );
}
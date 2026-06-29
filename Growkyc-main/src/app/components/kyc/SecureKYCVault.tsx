// Secure KYC Vault - Centralized secure storage for all client KYC/CDD data
import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  Search,
  Filter,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Building2,
  FileText,
  Calendar,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Globe,
  Users,
  Briefcase,
  DollarSign,
  AlertCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  History
} from 'lucide-react';
import { toast } from 'sonner';

interface KYCRecord {
  id: string;
  clientName: string;
  entityType: string;
  riskRating: 'low' | 'medium' | 'high';
  kycStatus: 'complete' | 'pending' | 'expired';
  submittedDate: string;
  lastReviewDate: string;
  nextReviewDate: string;
  onboardedBy: string;
  
  // Personal/Entity Details (Sensitive)
  personalDetails: {
    fullLegalName?: string;
    formerNames?: string;
    dateOfBirth?: string;
    residentialAddress?: string;
    postalAddress?: string;
    email?: string;
    phone?: string;
    occupation?: string;
    employer?: string;
    tfn?: string;
    taxResidenceCountry?: string;
    foreignTaxId?: string;
  };
  
  // Entity Details (Sensitive)
  entityDetails: {
    acn?: string;
    abn?: string;
    registeredOffice?: string;
    principalPlace?: string;
    industry?: string;
    dateIncorporated?: string;
    trustName?: string;
    trustType?: string;
    governingState?: string;
    dateEstablished?: string;
  };
  
  // Risk Indicators (Sensitive)
  riskIndicators: {
    cashInvolvement?: boolean;
    cryptoInvolvement?: boolean;
    pepStatus?: boolean;
    relatedPartyPep?: boolean;
    unexplainedWealth?: boolean;
    charityNpo?: boolean;
    sanctionsScreened?: boolean;
    sanctionsResult?: 'clear' | 'hit' | 'pending';
    pepScreened?: boolean;
    pepResult?: 'clear' | 'hit' | 'pending';
  };
  
  // Source of Wealth/Funds (Sensitive)
  sourceOfWealth: {
    sourceOfFunds?: string;
    sourceOfWealth?: string;
    wealthDescription?: string;
  };
  
  // Beneficial Ownership (Sensitive)
  beneficialOwnership: {
    shareholders?: any[];
    directors?: any[];
    beneficialOwners?: any[];
    trustees?: any[];
    appointors?: any[];
    beneficiaries?: any[];
  };
  
  // Documents (Sensitive)
  documents: {
    idDocuments?: any[];
    companyDocuments?: any[];
    trustDocuments?: any[];
    proofOfAddress?: any[];
    sourceOfWealthDocs?: any[];
  };
  
  // Verification Status
  verification: {
    idVerified: boolean;
    addressVerified: boolean;
    sourceOfWealthVerified: boolean;
    beneficialOwnersVerified: boolean;
    screeningComplete: boolean;
  };
  
  // Audit Trail
  auditLog: {
    timestamp: string;
    action: string;
    user: string;
    details: string;
  }[];
}

export function SecureKYCVault() {
  const [kycRecords, setKycRecords] = useState<KYCRecord[]>([
    {
      id: 'kyc-001',
      clientName: 'Tech Solutions Pty Ltd',
      entityType: 'Company',
      riskRating: 'low',
      kycStatus: 'complete',
      submittedDate: '2024-02-20T14:30:00Z',
      lastReviewDate: '2024-02-20T14:30:00Z',
      nextReviewDate: '2025-02-20T14:30:00Z',
      onboardedBy: 'Sarah Johnson',
      personalDetails: {
        fullLegalName: 'John Michael Smith',
        dateOfBirth: '1985-05-15',
        residentialAddress: '123 Collins Street, Melbourne VIC 3000',
        postalAddress: '123 Collins Street, Melbourne VIC 3000',
        email: 'john.smith@techsolutions.com.au',
        phone: '+61 3 9876 5432',
        occupation: 'Managing Director',
        tfn: '*** *** ***',
        taxResidenceCountry: 'Australia'
      },
      entityDetails: {
        acn: '123 456 789',
        abn: '12 345 678 901',
        registeredOffice: '123 Collins Street, Melbourne VIC 3000',
        principalPlace: '123 Collins Street, Melbourne VIC 3000',
        industry: 'Information Technology',
        dateIncorporated: '2020-01-15'
      },
      riskIndicators: {
        cashInvolvement: false,
        cryptoInvolvement: false,
        pepStatus: false,
        relatedPartyPep: false,
        unexplainedWealth: false,
        charityNpo: false,
        sanctionsScreened: true,
        sanctionsResult: 'clear',
        pepScreened: true,
        pepResult: 'clear'
      },
      sourceOfWealth: {
        sourceOfFunds: 'Business operations and director salary',
        sourceOfWealth: 'IT consulting business established 2020',
        wealthDescription: 'Built successful IT consulting practice over 4 years'
      },
      beneficialOwnership: {
        shareholders: [
          { name: 'John Smith', percentage: 100, type: 'individual' }
        ],
        directors: [
          { name: 'John Smith', position: 'Managing Director' }
        ],
        beneficialOwners: [
          { name: 'John Smith', percentage: 100, verified: true }
        ]
      },
      documents: {
        idDocuments: [
          { type: 'Drivers License', status: 'verified', uploadDate: '2024-02-20' }
        ],
        companyDocuments: [
          { type: 'ASIC Extract', status: 'verified', uploadDate: '2024-02-20' }
        ],
        proofOfAddress: [
          { type: 'Utility Bill', status: 'verified', uploadDate: '2024-02-20' }
        ]
      },
      verification: {
        idVerified: true,
        addressVerified: true,
        sourceOfWealthVerified: true,
        beneficialOwnersVerified: true,
        screeningComplete: true
      },
      auditLog: [
        {
          timestamp: '2024-02-20T14:30:00Z',
          action: 'KYC Record Created',
          user: 'Sarah Johnson',
          details: 'Client onboarding completed - KYC data transferred to vault'
        },
        {
          timestamp: '2024-02-20T14:35:00Z',
          action: 'Sanctions Screening',
          user: 'System',
          details: 'Result: CLEAR'
        },
        {
          timestamp: '2024-02-20T14:35:00Z',
          action: 'PEP Screening',
          user: 'System',
          details: 'Result: CLEAR'
        },
        {
          timestamp: '2024-02-20T14:40:00Z',
          action: 'KYC Verification Complete',
          user: 'Sarah Johnson',
          details: 'All verification checks passed'
        }
      ]
    }
  ]);

  const [selectedRecord, setSelectedRecord] = useState<KYCRecord | null>(null);
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const maskSensitiveData = (data: string) => {
    if (showSensitiveData) return data;
    return '●●●●●●●●●●';
  };

  const getRiskBadge = (risk: string) => {
    const config = {
      low: { bg: 'bg-green-500/15', text: 'text-green-300', label: 'Low Risk' },
      medium: { bg: 'bg-amber-500/15', text: 'text-amber-300', label: 'Medium Risk' },
      high: { bg: 'bg-red-500/15', text: 'text-red-300', label: 'High Risk' }
    };
    const { bg, text, label } = config[risk as keyof typeof config];
    return <span className={`px-3 py-1 rounded-full text-xs font-bold ${bg} ${text}`}>{label}</span>;
  };

  const getStatusBadge = (status: string) => {
    const config = {
      complete: { bg: 'bg-green-500/15', text: 'text-green-300', icon: CheckCircle, label: 'Complete' },
      pending: { bg: 'bg-amber-500/15', text: 'text-amber-300', icon: Clock, label: 'Pending' },
      expired: { bg: 'bg-red-500/15', text: 'text-red-300', icon: AlertTriangle, label: 'Expired' }
    };
    const { bg, text, icon: Icon, label } = config[status as keyof typeof config];
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${bg} ${text}`}>
        <Icon className="w-3 h-3" />
        {label}
      </span>
    );
  };

  const filteredRecords = kycRecords.filter(record => {
    const matchesSearch = record.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = filterRisk === 'all' || record.riskRating === filterRisk;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="space-y-6">
      {/* Secure Header */}
      <div className="bg-gradient-to-r from-red-700 to-red-900 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
              <Shield className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">Secure KYC Vault</h1>
              <p className="text-red-100">Centralized secure repository for all client KYC/CDD data</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <p className="text-sm font-semibold">Access Level:</p>
              <p className="text-lg font-bold">MLRO / Compliance</p>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">⚠️ Restricted Access - Sensitive Data</p>
              <p className="text-sm text-red-100">
                This vault contains highly sensitive client information including TFNs, addresses, beneficial ownership, 
                and screening results. Access is logged and monitored. Only authorized compliance personnel may view this data.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border-2 border-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-300">Total Records</span>
            <Shield className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">{kycRecords.length}</p>
        </div>

        <div className="bg-white border-2 border-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-300">Complete</span>
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">
            {kycRecords.filter(r => r.kycStatus === 'complete').length}
          </p>
        </div>

        <div className="bg-white border-2 border-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-300">High Risk</span>
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">
            {kycRecords.filter(r => r.riskRating === 'high').length}
          </p>
        </div>

        <div className="bg-white border-2 border-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-300">Due Review</span>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">0</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white border-2 border-white/10 rounded-lg p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by client name or ID..."
              className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg"
            />
          </div>
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value as any)}
            className="px-4 py-2 border border-white/10 rounded-lg"
          >
            <option value="all">All Risk Levels</option>
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
          </select>
          <button
            onClick={() => setShowSensitiveData(!showSensitiveData)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
              showSensitiveData
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-white/10 text-slate-300 hover:bg-gray-300'
            }`}
          >
            {showSensitiveData ? (
              <>
                <Eye className="w-5 h-5" />
                Hide Sensitive Data
              </>
            ) : (
              <>
                <EyeOff className="w-5 h-5" />
                Show Sensitive Data
              </>
            )}
          </button>
        </div>
      </div>

      {/* KYC Records List */}
      <div className="space-y-4">
        {filteredRecords.map((record) => (
          <div
            key={record.id}
            className="bg-white border-2 border-white/10 rounded-lg p-6 hover:border-blue-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 rounded-lg bg-blue-500/15 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-slate-100">{record.clientName}</h3>
                    {getRiskBadge(record.riskRating)}
                    {getStatusBadge(record.kycStatus)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-300 mb-3">
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      ID: {record.id}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {record.entityType}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      Onboarded by {record.onboardedBy}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(record.submittedDate).toLocaleDateString('en-AU')}
                    </span>
                  </div>

                  {/* Verification Status */}
                  <div className="grid grid-cols-5 gap-2 mb-3">
                    {[
                      { label: 'ID', verified: record.verification.idVerified },
                      { label: 'Address', verified: record.verification.addressVerified },
                      { label: 'Source of Wealth', verified: record.verification.sourceOfWealthVerified },
                      { label: 'Beneficial Owners', verified: record.verification.beneficialOwnersVerified },
                      { label: 'Screening', verified: record.verification.screeningComplete }
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className={`text-center py-1 px-2 rounded text-xs font-semibold ${
                          item.verified
                            ? 'bg-green-500/15 text-green-300'
                            : 'bg-white/5 text-slate-300'
                        }`}
                      >
                        {item.verified ? '✓' : '○'} {item.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4 border-t border-white/10">
              <button
                onClick={() => setSelectedRecord(selectedRecord?.id === record.id ? null : record)}
                className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                {selectedRecord?.id === record.id ? (
                  <>
                    <ChevronUp className="w-5 h-5" />
                    Hide Secure Data
                  </>
                ) : (
                  <>
                    <Eye className="w-5 h-5" />
                    View Secure KYC Data
                  </>
                )}
              </button>
            </div>

            {/* Expanded Secure Data View */}
            {selectedRecord?.id === record.id && (
              <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
                {/* Personal Details */}
                <div className="bg-red-500/10 border-2 border-red-500/30 rounded-lg p-4">
                  <button
                    onClick={() => toggleSection('personal')}
                    className="flex items-center justify-between w-full"
                  >
                    <h4 className="font-bold text-red-300 flex items-center gap-2">
                      <Lock className="w-5 h-5" />
                      Personal Details (Sensitive)
                    </h4>
                    {expandedSections.has('personal') ? (
                      <ChevronUp className="w-5 h-5 text-red-300" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-red-300" />
                    )}
                  </button>
                  
                  {expandedSections.has('personal') && (
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      {Object.entries(record.personalDetails).map(([key, value]) => (
                        value && (
                          <div key={key} className="text-sm">
                            <p className="text-red-300 font-semibold mb-1">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                            </p>
                            <p className="text-red-300">
                              {key.includes('tfn') || key.includes('tax') 
                                ? maskSensitiveData(value) 
                                : value}
                            </p>
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>

                {/* Entity Details */}
                <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-lg p-4">
                  <button
                    onClick={() => toggleSection('entity')}
                    className="flex items-center justify-between w-full"
                  >
                    <h4 className="font-bold text-blue-300 flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Entity Details
                    </h4>
                    {expandedSections.has('entity') ? (
                      <ChevronUp className="w-5 h-5 text-blue-300" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-blue-300" />
                    )}
                  </button>
                  
                  {expandedSections.has('entity') && (
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      {Object.entries(record.entityDetails).map(([key, value]) => (
                        value && (
                          <div key={key} className="text-sm">
                            <p className="text-blue-300 font-semibold mb-1">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                            </p>
                            <p className="text-blue-300">{value}</p>
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>

                {/* Risk Indicators & Screening */}
                <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-lg p-4">
                  <button
                    onClick={() => toggleSection('risk')}
                    className="flex items-center justify-between w-full"
                  >
                    <h4 className="font-bold text-amber-300 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Risk Indicators & Screening Results (Sensitive)
                    </h4>
                    {expandedSections.has('risk') ? (
                      <ChevronUp className="w-5 h-5 text-amber-300" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-amber-300" />
                    )}
                  </button>
                  
                  {expandedSections.has('risk') && (
                    <div className="mt-4 space-y-3">
                      <div className="grid grid-cols-3 gap-3">
                        {Object.entries(record.riskIndicators).map(([key, value]) => {
                          if (typeof value === 'boolean') {
                            return (
                              <div key={key} className="text-sm">
                                <p className="text-amber-300 font-semibold">
                                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                </p>
                                <p className={`font-bold ${value ? 'text-red-400' : 'text-green-400'}`}>
                                  {value ? '✓ YES' : '○ NO'}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                      <div className="pt-3 border-t border-amber-300">
                        <p className="text-sm font-semibold text-amber-300 mb-2">Screening Results:</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white rounded p-3">
                            <p className="text-xs text-amber-300 mb-1">Sanctions Screening:</p>
                            <p className={`font-bold ${
                              record.riskIndicators.sanctionsResult === 'clear' ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {record.riskIndicators.sanctionsResult?.toUpperCase()}
                            </p>
                          </div>
                          <div className="bg-white rounded p-3">
                            <p className="text-xs text-amber-300 mb-1">PEP Screening:</p>
                            <p className={`font-bold ${
                              record.riskIndicators.pepResult === 'clear' ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {record.riskIndicators.pepResult?.toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Source of Wealth */}
                <div className="bg-green-500/10 border-2 border-green-500/30 rounded-lg p-4">
                  <button
                    onClick={() => toggleSection('wealth')}
                    className="flex items-center justify-between w-full"
                  >
                    <h4 className="font-bold text-green-300 flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Source of Wealth/Funds (Sensitive)
                    </h4>
                    {expandedSections.has('wealth') ? (
                      <ChevronUp className="w-5 h-5 text-green-300" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-green-300" />
                    )}
                  </button>
                  
                  {expandedSections.has('wealth') && (
                    <div className="mt-4 space-y-3">
                      {Object.entries(record.sourceOfWealth).map(([key, value]) => (
                        value && (
                          <div key={key} className="text-sm">
                            <p className="text-green-300 font-semibold mb-1">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                            </p>
                            <p className="text-green-300">{value}</p>
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>

                {/* Beneficial Ownership */}
                <div className="bg-purple-500/10 border-2 border-purple-500/30 rounded-lg p-4">
                  <button
                    onClick={() => toggleSection('ownership')}
                    className="flex items-center justify-between w-full"
                  >
                    <h4 className="font-bold text-purple-300 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Beneficial Ownership Structure (Sensitive)
                    </h4>
                    {expandedSections.has('ownership') ? (
                      <ChevronUp className="w-5 h-5 text-purple-300" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-purple-300" />
                    )}
                  </button>
                  
                  {expandedSections.has('ownership') && (
                    <div className="mt-4 space-y-4">
                      {Object.entries(record.beneficialOwnership).map(([key, value]) => (
                        value && Array.isArray(value) && value.length > 0 && (
                          <div key={key}>
                            <p className="text-purple-300 font-semibold mb-2">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                            </p>
                            <div className="space-y-2">
                              {value.map((item: any, idx: number) => (
                                <div key={idx} className="bg-white rounded p-3 text-sm">
                                  <p className="font-semibold text-purple-300">{item.name}</p>
                                  {item.percentage && (
                                    <p className="text-purple-300">Ownership: {item.percentage}%</p>
                                  )}
                                  {item.position && (
                                    <p className="text-purple-300">Position: {item.position}</p>
                                  )}
                                  {item.verified !== undefined && (
                                    <p className={`font-semibold ${item.verified ? 'text-green-400' : 'text-amber-400'}`}>
                                      {item.verified ? '✓ Verified' : '○ Pending'}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>

                {/* Audit Log */}
                <div className="bg-white/5 border-2 border-white/10 rounded-lg p-4">
                  <button
                    onClick={() => toggleSection('audit')}
                    className="flex items-center justify-between w-full"
                  >
                    <h4 className="font-bold text-slate-100 flex items-center gap-2">
                      <History className="w-5 h-5" />
                      Audit Trail
                    </h4>
                    {expandedSections.has('audit') ? (
                      <ChevronUp className="w-5 h-5 text-slate-100" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-100" />
                    )}
                  </button>
                  
                  {expandedSections.has('audit') && (
                    <div className="mt-4 space-y-2">
                      {record.auditLog.map((log, idx) => (
                        <div key={idx} className="bg-white rounded p-3 text-sm">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-slate-100">{log.action}</p>
                            <p className="text-xs text-slate-300">
                              {new Date(log.timestamp).toLocaleString('en-AU')}
                            </p>
                          </div>
                          <p className="text-slate-300 text-xs">{log.details}</p>
                          <p className="text-slate-300 text-xs mt-1">By: {log.user}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredRecords.length === 0 && (
        <div className="bg-white border-2 border-dashed border-white/10 rounded-lg p-12 text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-100 mb-2">No KYC Records Found</h3>
          <p className="text-slate-300">No records match your search criteria.</p>
        </div>
      )}
    </div>
  );
}

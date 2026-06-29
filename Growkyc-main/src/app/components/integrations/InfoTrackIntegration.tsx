import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Building2,
  FileText,
  Search,
  CreditCard,
  MapPin,
  Briefcase,
  Scale,
  Home,
  DollarSign,
  Calendar,
  TrendingUp,
  Info,
  RefreshCw,
  Download,
  ExternalLink,
  Clock
} from 'lucide-react';

interface InfoTrackIntegrationProps {
  entityType: 'individual' | 'company' | 'property';
  entityData: any;
  onComplete?: (results: any) => void;
}

export function InfoTrackIntegration({ entityType, entityData, onComplete }: InfoTrackIntegrationProps) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [selectedChecks, setSelectedChecks] = useState<string[]>([
    'identity',
    'credit',
    'property',
    'bankruptcy',
    'court'
  ]);

  // Mock InfoTrack API call
  const runInfoTrackChecks = async () => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock comprehensive InfoTrack results
    const mockResults = {
      requestId: 'IT-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      timestamp: new Date().toISOString(),
      entityType,
      checks: {
        identity: {
          status: 'verified',
          confidence: 98,
          documents: [
            {
              type: 'Drivers License',
              state: 'VIC',
              number: 'DL*****789',
              status: 'verified',
              expiryDate: '2028-06-15',
              verified: true
            },
            {
              type: 'Passport',
              country: 'Australia',
              number: 'PA*****123',
              status: 'verified',
              expiryDate: '2030-03-20',
              verified: true
            }
          ],
          dvs: {
            status: 'verified',
            documentVerificationService: 'Passed',
            score: 98
          },
          aml: {
            status: 'clear',
            pepCheck: 'No matches',
            sanctionsList: 'No matches',
            adverseMedia: 'No matches'
          }
        },
        credit: {
          status: 'good',
          score: 742,
          rating: 'Very Good',
          defaults: [] as any[],
          judgements: [] as any[],
          bankruptcies: [] as any[],
          commercialDefaults: [] as any[],
          creditEnquiries: 3,
          lastEnquiryDate: '2024-01-15',
          summary: {
            totalDefaults: 0,
            totalJudgements: 0,
            totalBankruptcies: 0,
            adverseEvents: 0
          }
        },
        property: {
          status: 'verified',
          ownership: [
            {
              address: '45 Collins Street, Melbourne VIC 3000',
              titleReference: 'Vol 12345 Fol 678',
              proprietors: ['Sarah Mitchell', 'John Mitchell'],
              purchaseDate: '2018-03-15',
              purchasePrice: 1250000,
              currentValuation: 1850000,
              mortgages: [
                {
                  mortgagee: 'ANZ Bank',
                  amount: 750000,
                  registeredDate: '2018-03-15'
                }
              ],
              caveats: [] as any[],
              encumbrances: [] as any[]
            }
          ],
          titleSearch: {
            status: 'clear',
            restrictions: 'None',
            easements: 'Standard services easement',
            covenants: 'Standard residential covenants'
          }
        },
        bankruptcy: {
          status: 'clear',
          bankruptcySearches: [] as any[],
          personalInsolvency: 'No records found',
          debtAgreements: [] as any[]
        },
        court: {
          status: 'clear',
          judgements: [] as any[],
          litigationSearch: 'No active litigation',
          courtOrders: [] as any[]
        },
        asic: entityType === 'company' ? {
          status: 'active',
          abn: '12 345 678 901',
          acn: '123 456 789',
          companyName: 'Mitchell Property Group Pty Ltd',
          registrationDate: '2015-06-01',
          status_: 'Registered',
          type: 'Australian Proprietary Company',
          directors: [
            {
              name: 'Sarah Mitchell',
              appointmentDate: '2015-06-01',
              status: 'Active'
            }
          ],
          officeholders: [
            {
              name: 'Sarah Mitchell',
              role: 'Director & Secretary',
              address: 'Melbourne VIC 3000'
            }
          ]
        } : null
      },
      overallRiskScore: 12,
      riskLevel: 'Low',
      recommendation: 'Approve',
      warnings: [] as any[],
      flags: [] as any[]
    };
    
    setResults(mockResults);
    setLoading(false);
    
    if (onComplete) {
      onComplete(mockResults);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
      case 'clear':
      case 'good':
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'failed':
      case 'adverse':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Info className="w-5 h-5 text-slate-300" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
      case 'clear':
      case 'good':
      case 'active':
        return 'bg-green-500/10 text-green-300 border-green-500/30';
      case 'warning':
        return 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30';
      case 'failed':
      case 'adverse':
        return 'bg-red-500/10 text-red-300 border-red-500/30';
      default:
        return 'bg-white/5 text-slate-300 border-white/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* InfoTrack Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">InfoTrack Verification</h2>
              <p className="text-blue-100">Comprehensive identity, credit & property checks</p>
            </div>
          </div>
          <img 
            src="https://images.unsplash.com/photo-1633158829875-e5316a358c6f?w=120&h=40&fit=crop" 
            alt="InfoTrack" 
            className="h-8 bg-white rounded px-3 py-1"
          />
        </div>
      </div>

      {!results ? (
        <>
          {/* Select Checks */}
          <div className="bg-white rounded-lg border border-white/10 p-6">
            <h3 className="font-bold text-slate-100 mb-4">Select Verification Checks</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'identity', label: 'Identity Verification (DVS)', icon: User, description: 'Document verification via government databases' },
                { id: 'credit', label: 'Credit Check', icon: CreditCard, description: 'Comprehensive credit history and score' },
                { id: 'property', label: 'Property Search', icon: Home, description: 'Title searches and ownership verification' },
                { id: 'bankruptcy', label: 'Bankruptcy Search', icon: AlertCircle, description: 'NPII and bankruptcy records' },
                { id: 'court', label: 'Court Records', icon: Scale, description: 'Judgements and litigation history' },
                { id: 'asic', label: 'ASIC Search', icon: Building2, description: 'Company and directorship searches', disabled: entityType !== 'company' }
              ].map((check) => {
                const Icon = check.icon;
                const isSelected = selectedChecks.includes(check.id);
                
                return (
                  <button
                    key={check.id}
                    disabled={check.disabled}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedChecks(selectedChecks.filter(c => c !== check.id));
                      } else {
                        setSelectedChecks([...selectedChecks, check.id]);
                      }
                    }}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      check.disabled ? 'opacity-50 cursor-not-allowed bg-white/5' :
                      isSelected 
                        ? 'border-blue-500 bg-blue-500/10' 
                        : 'border-white/10 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-400' : 'text-slate-300'}`} />
                      {isSelected && <CheckCircle className="w-5 h-5 text-blue-400" />}
                    </div>
                    <h4 className="font-semibold text-slate-100 mb-1">{check.label}</h4>
                    <p className="text-sm text-slate-300">{check.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Entity Details */}
          <div className="bg-white rounded-lg border border-white/10 p-6">
            <h3 className="font-bold text-slate-100 mb-4">Entity Details</h3>
            <div className="space-y-3">
              {entityType === 'individual' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Full Name:</span>
                    <span className="font-semibold">{entityData.name || 'Sarah Mitchell'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Date of Birth:</span>
                    <span className="font-semibold">{entityData.dob || '15/06/1985'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">License Number:</span>
                    <span className="font-semibold">{entityData.license || 'DL12345789'}</span>
                  </div>
                </>
              )}
              {entityType === 'company' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Company Name:</span>
                    <span className="font-semibold">{entityData.name || 'Mitchell Property Group'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">ACN:</span>
                    <span className="font-semibold">{entityData.acn || '123 456 789'}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="text-slate-300">Address:</span>
                <span className="font-semibold text-right">{entityData.address || '45 Collins St, Melbourne VIC 3000'}</span>
              </div>
            </div>
          </div>

          {/* Run Checks Button */}
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
            onClick={runInfoTrackChecks}
            disabled={loading || selectedChecks.length === 0}
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Running InfoTrack Checks...
              </>
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                Run InfoTrack Verification ({selectedChecks.length} checks)
              </>
            )}
          </Button>
        </>
      ) : (
        <>
          {/* Results Header */}
          <div className="bg-white rounded-lg border-2 border-green-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mr-4 ${
                  results.riskLevel === 'Low' ? 'bg-green-500/15' :
                  results.riskLevel === 'Medium' ? 'bg-yellow-500/15' : 'bg-red-500/15'
                }`}>
                  <Shield className={`w-8 h-8 ${
                    results.riskLevel === 'Low' ? 'text-green-400' :
                    results.riskLevel === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                  }`} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-100">Verification Complete</h3>
                  <p className="text-slate-300">Request ID: {results.requestId}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-4xl font-bold mb-1 ${
                  results.riskLevel === 'Low' ? 'text-green-400' :
                  results.riskLevel === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {results.overallRiskScore}
                </div>
                <div className="text-sm text-slate-300">Risk Score</div>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${
                  results.riskLevel === 'Low' ? 'bg-green-500/15 text-green-300' :
                  results.riskLevel === 'Medium' ? 'bg-yellow-500/15 text-yellow-300' : 'bg-red-500/15 text-red-300'
                }`}>
                  {results.riskLevel} Risk
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 pt-4 border-t">
              <Button className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
              <Button variant="outline" className="flex-1">
                <ExternalLink className="w-4 h-4 mr-2" />
                View in InfoTrack
              </Button>
              <Button variant="outline" onClick={() => setResults(null)}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Run Again
              </Button>
            </div>
          </div>

          {/* Identity Verification Results */}
          {results.checks.identity && (
            <div className="bg-white rounded-lg border border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-100 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-400" />
                  Identity Verification
                </h3>
                {getStatusIcon(results.checks.identity.status)}
              </div>

              <div className="space-y-4">
                <div className={`p-4 rounded-lg border ${getStatusColor(results.checks.identity.dvs.status)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Document Verification Service (DVS)</span>
                    <span className="text-sm font-bold">{results.checks.identity.dvs.score}% Match</span>
                  </div>
                  <p className="text-sm">{results.checks.identity.dvs.documentVerificationService}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-100 mb-2">Verified Documents</h4>
                  <div className="space-y-2">
                    {results.checks.identity.documents.map((doc: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-slate-300 mr-3" />
                          <div>
                            <p className="font-medium text-slate-100">{doc.type}</p>
                            <p className="text-sm text-slate-300">{doc.number} • Exp: {doc.expiryDate}</p>
                          </div>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-100 mb-2">AML/CTF Checks</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                      <p className="text-sm text-slate-300 mb-1">PEP Check</p>
                      <p className="font-semibold text-green-300">{results.checks.identity.aml.pepCheck}</p>
                    </div>
                    <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                      <p className="text-sm text-slate-300 mb-1">Sanctions List</p>
                      <p className="font-semibold text-green-300">{results.checks.identity.aml.sanctionsList}</p>
                    </div>
                    <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                      <p className="text-sm text-slate-300 mb-1">Adverse Media</p>
                      <p className="font-semibold text-green-300">{results.checks.identity.aml.adverseMedia}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Credit Check Results */}
          {results.checks.credit && (
            <div className="bg-white rounded-lg border border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-100 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-purple-400" />
                  Credit Check
                </h3>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-3xl font-bold text-purple-400">{results.checks.credit.score}</div>
                    <div className="text-sm text-slate-300">{results.checks.credit.rating}</div>
                  </div>
                  {getStatusIcon(results.checks.credit.status)}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30 text-center">
                  <div className="text-2xl font-bold text-green-300">{results.checks.credit.summary.totalDefaults}</div>
                  <div className="text-sm text-slate-300">Defaults</div>
                </div>
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30 text-center">
                  <div className="text-2xl font-bold text-green-300">{results.checks.credit.summary.totalJudgements}</div>
                  <div className="text-sm text-slate-300">Judgements</div>
                </div>
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30 text-center">
                  <div className="text-2xl font-bold text-green-300">{results.checks.credit.summary.totalBankruptcies}</div>
                  <div className="text-sm text-slate-300">Bankruptcies</div>
                </div>
                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30 text-center">
                  <div className="text-2xl font-bold text-blue-300">{results.checks.credit.creditEnquiries}</div>
                  <div className="text-sm text-slate-300">Enquiries (12mo)</div>
                </div>
              </div>

              <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                <p className="text-sm font-semibold text-green-300">
                  ✓ Clean credit history with no adverse events
                </p>
              </div>
            </div>
          )}

          {/* Property Results */}
          {results.checks.property && (
            <div className="bg-white rounded-lg border border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-100 flex items-center">
                  <Home className="w-5 h-5 mr-2 text-orange-400" />
                  Property Ownership
                </h3>
                {getStatusIcon(results.checks.property.status)}
              </div>

              {results.checks.property.ownership.map((property: any, index: number) => (
                <div key={index} className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-slate-100 mb-1">{property.address}</p>
                        <p className="text-sm text-slate-300">Title: {property.titleReference}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-400 text-lg">
                          ${(property.currentValuation).toLocaleString()}
                        </p>
                        <p className="text-sm text-slate-300">Current Value</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <p className="text-sm text-slate-300">Purchase Date</p>
                        <p className="font-semibold">{property.purchaseDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-300">Purchase Price</p>
                        <p className="font-semibold">${property.purchasePrice.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm text-slate-300 mb-1">Proprietors</p>
                      <p className="font-semibold">{property.proprietors.join(', ')}</p>
                    </div>

                    {property.mortgages.length > 0 && (
                      <div>
                        <p className="text-sm text-slate-300 mb-2">Mortgages</p>
                        {property.mortgages.map((mortgage: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-white rounded border">
                            <div>
                              <p className="font-semibold">{mortgage.mortgagee}</p>
                              <p className="text-sm text-slate-300">Registered: {mortgage.registeredDate}</p>
                            </div>
                            <p className="font-bold text-slate-100">${mortgage.amount.toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                      <p className="text-sm text-slate-300 mb-1">Caveats</p>
                      <p className="font-semibold text-green-300">None</p>
                    </div>
                    <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                      <p className="text-sm text-slate-300 mb-1">Encumbrances</p>
                      <p className="font-semibold text-green-300">None</p>
                    </div>
                    <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                      <p className="text-sm text-slate-300 mb-1">Title Status</p>
                      <p className="font-semibold text-blue-300">Clear</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bankruptcy & Court Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.checks.bankruptcy && (
              <div className="bg-white rounded-lg border border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-100 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-yellow-400" />
                    Bankruptcy Search
                  </h3>
                  {getStatusIcon(results.checks.bankruptcy.status)}
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                    <p className="text-sm text-slate-300 mb-1">NPII Search</p>
                    <p className="font-semibold text-green-300">{results.checks.bankruptcy.personalInsolvency}</p>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                    <p className="text-sm text-slate-300 mb-1">Bankruptcy Records</p>
                    <p className="font-semibold text-green-300">No records found</p>
                  </div>
                </div>
              </div>
            )}

            {results.checks.court && (
              <div className="bg-white rounded-lg border border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-100 flex items-center">
                    <Scale className="w-5 h-5 mr-2 text-indigo-400" />
                    Court Records
                  </h3>
                  {getStatusIcon(results.checks.court.status)}
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                    <p className="text-sm text-slate-300 mb-1">Judgements</p>
                    <p className="font-semibold text-green-300">No records found</p>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                    <p className="text-sm text-slate-300 mb-1">Active Litigation</p>
                    <p className="font-semibold text-green-300">{results.checks.court.litigationSearch}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ASIC Results (for companies) */}
          {results.checks.asic && (
            <div className="bg-white rounded-lg border border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-100 flex items-center">
                  <Building2 className="w-5 h-5 mr-2 text-teal-400" />
                  ASIC Company Search
                </h3>
                {getStatusIcon(results.checks.asic.status)}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-slate-300">ABN</p>
                  <p className="font-semibold">{results.checks.asic.abn}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-300">ACN</p>
                  <p className="font-semibold">{results.checks.asic.acn}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-300">Status</p>
                  <span className="inline-block px-2 py-1 bg-green-500/15 text-green-300 text-sm font-semibold rounded">
                    {results.checks.asic.status_}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-slate-300">Type</p>
                  <p className="font-semibold text-sm">{results.checks.asic.type}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-100 mb-2">Directors & Officers</h4>
                <div className="space-y-2">
                  {results.checks.asic.officeholders.map((officer: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-100">{officer.name}</p>
                        <p className="text-sm text-slate-300">{officer.role}</p>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Recommendation */}
          <div className={`rounded-lg border-2 p-6 ${
            results.recommendation === 'Approve' ? 'bg-green-500/10 border-green-500/30' :
            results.recommendation === 'Review' ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-red-500/10 border-red-500/30'
          }`}>
            <h3 className="text-lg font-bold mb-2 flex items-center">
              {results.recommendation === 'Approve' ? (
                <CheckCircle className="w-6 h-6 text-green-400 mr-2" />
              ) : results.recommendation === 'Review' ? (
                <AlertCircle className="w-6 h-6 text-yellow-400 mr-2" />
              ) : (
                <XCircle className="w-6 h-6 text-red-400 mr-2" />
              )}
              Recommendation: {results.recommendation}
            </h3>
            <p className={`${
              results.recommendation === 'Approve' ? 'text-green-300' :
              results.recommendation === 'Review' ? 'text-yellow-300' : 'text-red-300'
            }`}>
              {results.recommendation === 'Approve' && 
                'All verification checks passed. This entity has been verified and shows low risk indicators. Safe to proceed with approval.'}
              {results.recommendation === 'Review' && 
                'Some checks require manual review. Please review the flagged items before making a decision.'}
              {results.recommendation === 'Reject' && 
                'Verification checks failed or high-risk indicators detected. Recommend rejection or further investigation.'}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

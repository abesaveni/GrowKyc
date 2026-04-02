import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Shield,
  AlertTriangle,
  FileText,
  DollarSign,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  User,
  Building,
  Calendar,
  Globe,
  TrendingUp,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { SuspiciousMatterReport } from './AustracReportingData';

interface EnhancedAustracTabProps {
  smrs: SuspiciousMatterReport[];
  summary: {
    totalSMRs: number;
    totalTTRs: number;
    lastReportDate: string;
    activeConcerns: boolean;
  };
}

export function EnhancedAustracTab({ smrs, summary }: EnhancedAustracTabProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('subject');
  const [selectedSMR, setSelectedSMR] = useState(0);

  const smr = smrs[selectedSMR];

  if (!smr) {
    // No SMRs - Clean state
    return (
      <div className="space-y-6">
        <Card className="border-2 border-green-300 shadow-lg">
          <CardContent className="p-12 text-center">
            <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-800 mb-2">No AUSTRAC Reports Filed</h3>
            <p className="text-gray-600 mb-6">This client has a clean AUSTRAC reporting history</p>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-sm text-gray-600 mb-1">SMRs Filed</p>
                <p className="text-3xl font-bold text-green-600">{summary.totalSMRs}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">TTRs Filed</p>
                <p className="text-3xl font-bold text-blue-600">{summary.totalTTRs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    // In real app this should surface via a user-visible toast.
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const SectionHeader = ({ id, title, icon: Icon, priority }: { id: string; title: string; icon: React.ComponentType<{ className?: string }>; priority?: boolean }) => {
    const isExpanded = expandedSection === id;
    return (
      <button
        onClick={() => toggleSection(id)}
        className={`w-full p-4 flex items-center justify-between border-b-2 transition-colors ${
          isExpanded ? 'bg-cyan-50' : 'bg-white hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className={`w-6 h-6 ${isExpanded ? 'text-cyan-600' : 'text-gray-600'}`} />
          <span className="font-semibold text-lg">{title}</span>
          {priority && (
            <Badge className="bg-red-600 text-white">Required for AUSTRAC Portal</Badge>
          )}
        </div>
        {isExpanded ? (
          <ChevronDown className="w-5 h-5 text-cyan-600" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-400" />
        )}
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Alert */}
      <Card className={`border-4 shadow-xl ${summary.activeConcerns ? 'bg-red-50 border-red-400' : 'bg-green-50 border-green-400'}`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              {summary.activeConcerns ? (
                <AlertTriangle className="w-12 h-12 text-red-600" />
              ) : (
                <CheckCircle className="w-12 h-12 text-green-600" />
              )}
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {summary.activeConcerns ? 'AUSTRAC Reporting Required' : 'No Active Concerns'}
                </h2>
                <p className="text-gray-700 mb-4">
                  {summary.activeConcerns 
                    ? 'Suspicious Matter Reports filed. See details below for AUSTRAC online portal submission.'
                    : 'Client has clean AUSTRAC reporting history'
                  }
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/80 rounded-lg p-3 border">
                    <p className="text-xs text-gray-600 mb-1">SMRs Filed</p>
                    <p className="text-2xl font-bold text-red-600">{summary.totalSMRs}</p>
                  </div>
                  <div className="bg-white/80 rounded-lg p-3 border">
                    <p className="text-xs text-gray-600 mb-1">TTRs Filed</p>
                    <p className="text-2xl font-bold text-blue-600">{summary.totalTTRs}</p>
                  </div>
                  <div className="bg-white/80 rounded-lg p-3 border">
                    <p className="text-xs text-gray-600 mb-1">Last Report</p>
                    <p className="text-sm font-bold text-gray-800">{summary.lastReportDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SMR Details - Ready for Portal Submission */}
      <Card className="border-2 border-cyan-300 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 border-b">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-cyan-600" />
              Suspicious Matter Report Details
            </div>
            <div className="flex gap-2">
              <Badge className={`${smr.reportPriority === 'Urgent' ? 'bg-red-600' : 'bg-orange-600'} text-white px-3 py-1`}>
                {smr.reportPriority} Priority
              </Badge>
              <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open AUSTRAC Portal
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Report Meta */}
          <div className="p-6 bg-gray-50 border-b">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">SMR Number</p>
                <div className="flex items-center gap-2">
                  <p className="font-bold">{smr.smrNumber}</p>
                  <button onClick={() => copyToClipboard(smr.smrNumber, 'SMR Number')}>
                    <Copy className="w-4 h-4 text-gray-400 hover:text-cyan-600" />
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Filing Date</p>
                <p className="font-bold">{smr.filingDate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Reporting Officer</p>
                <p className="font-bold">{smr.reportingOfficer}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">AUSTRAC Reference</p>
                <p className="font-bold text-cyan-600">{smr.austracReferenceNumber || 'Pending'}</p>
              </div>
            </div>
          </div>

          {/* Section 1: Subject Details */}
          <div>
            <SectionHeader id="subject" title="Section 1: Subject Details" icon={User} priority />
            {expandedSection === 'subject' && (
              <div className="p-6 bg-white border-b space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">Subject Type</label>
                    <p className="font-semibold">{smr.subjectDetails.subjectType}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">Full Legal Name</label>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{smr.subjectDetails.fullLegalName}</p>
                      <button onClick={() => copyToClipboard(smr.subjectDetails.fullLegalName, 'Name')}>
                        <Copy className="w-4 h-4 text-gray-400 hover:text-cyan-600" />
                      </button>
                    </div>
                  </div>
                  {smr.subjectDetails.abn && (
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">ABN</label>
                      <p className="font-semibold">{smr.subjectDetails.abn}</p>
                    </div>
                  )}
                  {smr.subjectDetails.acn && (
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">ACN</label>
                      <p className="font-semibold">{smr.subjectDetails.acn}</p>
                    </div>
                  )}
                </div>

                {smr.subjectDetails.addresses && (
                  <div>
                    <label className="text-xs text-gray-600 block mb-2">Addresses</label>
                    {smr.subjectDetails.addresses.map((addr, idx) => (
                      <div key={idx} className="bg-gray-50 rounded p-3 mb-2 border">
                        <Badge variant="outline" className="mb-2">{addr.type}</Badge>
                        <p className="text-sm">{addr.address}</p>
                        <p className="text-xs text-gray-600 mt-1">{addr.country}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 2: Directors/Controllers */}
          {smr.directorsControllers && (
            <div>
              <SectionHeader id="directors" title="Section 2: Directors & Controllers" icon={Building} priority />
              {expandedSection === 'directors' && (
                <div className="p-6 bg-white border-b space-y-3">
                  {smr.directorsControllers.map((director, idx) => (
                    <div key={idx} className="bg-red-50 rounded-lg p-4 border-2 border-red-200">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-lg">{director.name}</h4>
                          <p className="text-sm text-gray-600">{director.role}</p>
                        </div>
                        <Badge className="bg-red-600 text-white">Concern Identified</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                        {director.dateOfBirth && (
                          <div>
                            <p className="text-xs text-gray-600">DOB</p>
                            <p className="font-semibold">{director.dateOfBirth}</p>
                          </div>
                        )}
                        {director.nationality && (
                          <div>
                            <p className="text-xs text-gray-600">Nationality</p>
                            <p className="font-semibold">{director.nationality}</p>
                          </div>
                        )}
                      </div>
                      <div className="bg-white rounded p-3 border">
                        <p className="text-xs text-gray-600 mb-2">Concerns Identified:</p>
                        <ul className="space-y-1">
                          {director.concernsIdentified.map((concern, cidx) => (
                            <li key={cidx} className="flex items-start gap-2 text-sm text-red-800">
                              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              <span>{concern}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Section 3: Suspicious Activity Summary */}
          <div>
            <SectionHeader id="summary" title="Section 3: Suspicious Activity Summary" icon={AlertTriangle} priority />
            {expandedSection === 'summary' && (
              <div className="p-6 bg-white border-b space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-orange-50 rounded p-3 border border-orange-200">
                    <p className="text-xs text-gray-600 mb-1">Date Commenced</p>
                    <p className="font-bold">{smr.suspiciousActivitySummary.dateActivityCommenced}</p>
                  </div>
                  <div className="bg-red-50 rounded p-3 border border-red-200">
                    <p className="text-xs text-gray-600 mb-1">Date Identified</p>
                    <p className="font-bold">{smr.suspiciousActivitySummary.dateActivityIdentified}</p>
                  </div>
                  <div className="bg-purple-50 rounded p-3 border border-purple-200">
                    <p className="text-xs text-gray-600 mb-1">Total Value</p>
                    <p className="font-bold text-lg">${smr.suspiciousActivitySummary.totalValueInvolved.toLocaleString()}</p>
                  </div>
                  <div className="bg-blue-50 rounded p-3 border border-blue-200">
                    <p className="text-xs text-gray-600 mb-1">Transactions</p>
                    <p className="font-bold text-lg">{smr.suspiciousActivitySummary.numberOfTransactions}</p>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold mb-3">Primary Concerns</h5>
                  <div className="space-y-3">
                    {smr.suspiciousActivitySummary.primaryConcerns.map((concern, idx) => (
                      <div key={idx} className={`rounded-lg p-4 border-2 ${
                        concern.severity === 'Critical' ? 'bg-red-50 border-red-300' :
                        concern.severity === 'High' ? 'bg-orange-50 border-orange-300' :
                        'bg-yellow-50 border-yellow-300'
                      }`}>
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h6 className="font-bold">{concern.category}</h6>
                              <Badge className={`${
                                concern.severity === 'Critical' ? 'bg-red-600' : 'bg-orange-600'
                              } text-white`}>
                                {concern.severity}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-800">{concern.description}</p>
                          </div>
                          <button onClick={() => copyToClipboard(concern.description, concern.category)}>
                            <Copy className="w-4 h-4 text-gray-400 hover:text-cyan-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold mb-3">ML/TF Indicators Identified ({smr.suspiciousActivitySummary.indicatorsIdentified.length})</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {smr.suspiciousActivitySummary.indicatorsIdentified.map((indicator, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm bg-red-50 rounded p-2 border border-red-200">
                        <CheckCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                        <span>{indicator}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Transaction Details */}
          <div>
            <SectionHeader id="transactions" title="Section 4: Suspicious Transactions" icon={DollarSign} priority />
            {expandedSection === 'transactions' && (
              <div className="p-6 bg-white border-b space-y-3">
                {smr.suspiciousTransactions.map((txn, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="bg-blue-600 text-white">{txn.type}</Badge>
                          <span className="text-xs text-gray-600">{txn.date}</span>
                        </div>
                        <p className="text-2xl font-bold text-cyan-700">
                          {txn.currency} ${txn.amount.toLocaleString()}
                        </p>
                      </div>
                      <button onClick={() => copyToClipboard(JSON.stringify(txn, null, 2), `Transaction ${txn.transactionId}`)}>
                        <Copy className="w-4 h-4 text-gray-400 hover:text-cyan-600" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div>
                        <p className="text-xs text-gray-600">Transaction ID</p>
                        <p className="font-semibold">{txn.transactionId}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Method</p>
                        <p className="font-semibold">{txn.method}</p>
                      </div>
                      {txn.fromAccount && (
                        <div>
                          <p className="text-xs text-gray-600">From Account</p>
                          <p className="font-semibold">{txn.fromAccount}</p>
                        </div>
                      )}
                      {txn.toAccount && (
                        <div>
                          <p className="text-xs text-gray-600">To Account</p>
                          <p className="font-semibold">{txn.toAccount}</p>
                        </div>
                      )}
                      {txn.destination && (
                        <div>
                          <p className="text-xs text-gray-600">Destination</p>
                          <p className="font-semibold">{txn.destination}</p>
                        </div>
                      )}
                      {txn.purpose && (
                        <div>
                          <p className="text-xs text-gray-600">Purpose</p>
                          <p className="font-semibold">{txn.purpose}</p>
                        </div>
                      )}
                    </div>

                    <div className="bg-red-50 rounded p-3 border border-red-200">
                      <p className="text-xs text-red-700 font-semibold mb-2">Red Flags:</p>
                      <ul className="space-y-1">
                        {txn.redFlags.map((flag, fidx) => (
                          <li key={fidx} className="flex items-start gap-2 text-sm text-red-800">
                            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{flag}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 5: ML/TF Indicators */}
          <div>
            <SectionHeader id="indicators" title="Section 5: ML/TF Indicators Detail" icon={Shield} priority />
            {expandedSection === 'indicators' && (
              <div className="p-6 bg-white border-b space-y-4">
                {Object.entries(smr.mlTfIndicators).filter(([key, value]) => key !== 'other' && value === true).map(([key, _]) => {
                  const detailsKey = `${key}Details` as keyof typeof smr.mlTfIndicators;
                  const details = smr.mlTfIndicators[detailsKey];
                  if (typeof details !== 'string') return null;
                  
                  return (
                    <div key={key} className="bg-red-50 rounded-lg p-4 border-2 border-red-200">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-red-600" />
                        <h6 className="font-bold capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h6>
                      </div>
                      <p className="text-sm text-gray-800">{details}</p>
                    </div>
                  );
                })}

                {smr.mlTfIndicators.other.length > 0 && (
                  <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-200">
                    <h6 className="font-bold mb-2">Other Indicators</h6>
                    <ul className="space-y-1">
                      {smr.mlTfIndicators.other.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 9: Declaration */}
          <div>
            <SectionHeader id="declaration" title="Section 9: Reporting Officer Declaration" icon={FileText} priority />
            {expandedSection === 'declaration' && (
              <div className="p-6 bg-white">
                <div className="bg-cyan-50 rounded-lg p-6 border-2 border-cyan-200">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Officer Name</p>
                      <p className="font-bold">{smr.declarationDetails.officerName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Title</p>
                      <p className="font-bold">{smr.declarationDetails.officerTitle}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Contact</p>
                      <p className="font-semibold text-sm">{smr.declarationDetails.officerContact}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Declaration Date</p>
                      <p className="font-bold">{smr.declarationDetails.declarationDate}</p>
                    </div>
                  </div>
                  <div className="bg-white rounded p-4 border">
                    <p className="text-sm text-gray-700 mb-2">Electronic Signature:</p>
                    <p className="font-signature text-2xl text-cyan-700">{smr.declarationDetails.signature}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button className="bg-cyan-600 hover:bg-cyan-700 flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Complete SMR (PDF)
        </Button>
        <Button className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2">
          <ExternalLink className="w-4 h-4" />
          Submit to AUSTRAC Portal
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Copy className="w-4 h-4" />
          Copy All Data
        </Button>
      </div>
    </div>
  );
}

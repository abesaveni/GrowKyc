import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  AlertTriangle,
  Users,
  ShieldAlert,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Eye,
  Scale,
  Building,
  User,
  FileText,
  Newspaper
} from 'lucide-react';
import { NetworkLegalRisk, AssociateLegalRecord } from './AssociateLegalData';

interface NetworkLegalRiskDisplayProps {
  networkData: NetworkLegalRisk;
}

export function NetworkLegalRiskDisplay({ networkData }: NetworkLegalRiskDisplayProps) {
  const [expandedAssociateId, setExpandedAssociateId] = useState<string | null>(null);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Critical': return 'bg-red-500';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getRiskBg = (risk: string) => {
    switch (risk) {
      case 'Critical': return 'bg-red-50 border-red-400';
      case 'High': return 'bg-orange-50 border-orange-400';
      case 'Medium': return 'bg-yellow-50 border-yellow-400';
      default: return 'bg-green-50 border-green-400';
    }
  };

  const getAssociateIcon = (type: string) => {
    switch (type) {
      case 'Director': return <User className="w-5 h-5 text-blue-600" />;
      case 'Shareholder': return <Users className="w-5 h-5 text-purple-600" />;
      case 'UBO': return <ShieldAlert className="w-5 h-5 text-orange-600" />;
      case 'Related Entity': return <Building className="w-5 h-5 text-cyan-600" />;
      case 'Trustee': return <Scale className="w-5 h-5 text-indigo-600" />;
      case 'Beneficiary': return <User className="w-5 h-5 text-green-600" />;
      default: return <User className="w-5 h-5 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'text-red-600';
      case 'High': return 'text-orange-600';
      case 'Medium': return 'text-yellow-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* NETWORK RISK OVERVIEW */}
      <Card className={`border-2 shadow-lg ${
        networkData.overallNetworkRisk === 'Critical' ? 'border-red-500 bg-red-50' :
        networkData.overallNetworkRisk === 'High' ? 'border-orange-500 bg-orange-50' :
        networkData.overallNetworkRisk === 'Medium' ? 'border-yellow-500 bg-yellow-50' :
        'border-green-500 bg-green-50'
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-start gap-4">
            <ShieldAlert className={`w-12 h-12 flex-shrink-0 ${
              networkData.overallNetworkRisk === 'Critical' ? 'text-red-600' :
              networkData.overallNetworkRisk === 'High' ? 'text-orange-600' :
              networkData.overallNetworkRisk === 'Medium' ? 'text-yellow-600' :
              'text-green-600'
            }`} />
            <div className="flex-1">
              <h3 className={`text-2xl font-bold mb-2 ${
                networkData.overallNetworkRisk === 'Critical' ? 'text-red-900' :
                networkData.overallNetworkRisk === 'High' ? 'text-orange-900' :
                networkData.overallNetworkRisk === 'Medium' ? 'text-yellow-900' :
                'text-green-900'
              }`}>
                Network-Wide Legal Risk: {networkData.overallNetworkRisk}
              </h3>
              <p className={`text-sm ${
                networkData.overallNetworkRisk === 'Critical' ? 'text-red-800' :
                networkData.overallNetworkRisk === 'High' ? 'text-orange-800' :
                networkData.overallNetworkRisk === 'Medium' ? 'text-yellow-800' :
                'text-green-800'
              }`}>
                Comprehensive legal screening completed for all directors, shareholders, UBOs, and related entities
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white bg-opacity-70 rounded-lg p-4 border-2 border-gray-300">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-5 h-5 text-blue-600" />
                <p className="text-xs text-gray-600">Total Checked</p>
              </div>
              <p className="text-3xl font-bold text-blue-600">{networkData.totalAssociatesChecked}</p>
            </div>
            <div className={`rounded-lg p-4 border-2 ${networkData.associatesWithIssues > 0 ? 'bg-red-100 border-red-400' : 'bg-green-100 border-green-400'}`}>
              <div className="flex items-center gap-2 mb-1">
                {networkData.associatesWithIssues > 0 ? (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
                <p className="text-xs text-gray-600">With Issues</p>
              </div>
              <p className={`text-3xl font-bold ${networkData.associatesWithIssues > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {networkData.associatesWithIssues}
              </p>
            </div>
            <div className="bg-red-100 rounded-lg p-4 border-2 border-red-400">
              <div className="flex items-center gap-2 mb-1">
                <XCircle className="w-5 h-5 text-red-600" />
                <p className="text-xs text-gray-600">Critical Risk</p>
              </div>
              <p className="text-3xl font-bold text-red-600">{networkData.criticalAssociates}</p>
            </div>
            <div className="bg-orange-100 rounded-lg p-4 border-2 border-orange-400">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <p className="text-xs text-gray-600">High Risk</p>
              </div>
              <p className="text-3xl font-bold text-orange-600">{networkData.highRiskAssociates}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ASSOCIATES WITH LEGAL ISSUES */}
      {networkData.associatesWithIssues > 0 && (
        <Card className="border-2 border-red-400 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b-2 border-red-200">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              Associates with Legal Issues ({networkData.associatesWithIssues})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {networkData.associateLegalRecords
                .filter(associate => associate.hasLegalIssues)
                .map((associate) => {
                  const isExpanded = expandedAssociateId === associate.associateId;
                  
                  return (
                    <div key={associate.associateId} className={`border-2 rounded-lg ${getRiskBg(associate.legalRisk)}`}>
                      {/* Associate Header */}
                      <div 
                        className="p-4 cursor-pointer hover:bg-opacity-70 transition-all"
                        onClick={() => setExpandedAssociateId(isExpanded ? null : associate.associateId)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getAssociateIcon(associate.associateType)}
                              <h4 className="font-bold text-lg text-gray-900">{associate.associateName}</h4>
                              <Badge className={`${getRiskColor(associate.legalRisk)} text-white`}>
                                {associate.legalRisk} Risk
                              </Badge>
                              <Badge variant="outline" className="bg-white">
                                {associate.associateType}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{associate.relationship}</p>
                            <div className="flex items-center gap-4 flex-wrap text-xs">
                              {associate.criminalRecord.length > 0 && (
                                <div className="flex items-center gap-1 bg-red-200 px-2 py-1 rounded">
                                  <XCircle className="w-3 h-3 text-red-700" />
                                  <span className="font-bold text-red-900">{associate.criminalRecord.length} Criminal Record(s)</span>
                                </div>
                              )}
                              {associate.civilLitigation.length > 0 && (
                                <div className="flex items-center gap-1 bg-orange-200 px-2 py-1 rounded">
                                  <Scale className="w-3 h-3 text-orange-700" />
                                  <span className="font-bold text-orange-900">{associate.civilLitigation.length} Civil Case(s)</span>
                                </div>
                              )}
                              {associate.disqualifications.length > 0 && (
                                <div className="flex items-center gap-1 bg-purple-200 px-2 py-1 rounded">
                                  <ShieldAlert className="w-3 h-3 text-purple-700" />
                                  <span className="font-bold text-purple-900">{associate.disqualifications.length} Disqualification(s)</span>
                                </div>
                              )}
                              {associate.bankruptcies.length > 0 && (
                                <div className="flex items-center gap-1 bg-yellow-200 px-2 py-1 rounded">
                                  <AlertTriangle className="w-3 h-3 text-yellow-700" />
                                  <span className="font-bold text-yellow-900">{associate.bankruptcies.length} Bankruptcy(ies)</span>
                                </div>
                              )}
                              {associate.adverseMedia.length > 0 && (
                                <div className="flex items-center gap-1 bg-red-200 px-2 py-1 rounded">
                                  <Newspaper className="w-3 h-3 text-red-700" />
                                  <span className="font-bold text-red-900">{associate.adverseMedia.length} Adverse Media</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="border-t-2 border-gray-300 p-4 space-y-4 bg-white bg-opacity-50">
                          
                          {/* CRIMINAL RECORDS */}
                          {associate.criminalRecord.length > 0 && (
                            <div className="bg-red-100 border-2 border-red-400 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <XCircle className="w-5 h-5 text-red-600" />
                                <h5 className="font-bold text-red-900">Criminal Records ({associate.criminalRecord.length})</h5>
                              </div>
                              <div className="space-y-3">
                                {associate.criminalRecord.map((record) => (
                                  <div key={record.id} className="bg-white rounded-lg p-3 border border-red-300">
                                    <div className="flex items-start justify-between mb-2">
                                      <div className="flex-1">
                                        <h6 className="font-bold text-gray-900">{record.offense}</h6>
                                        <div className="flex items-center gap-2 mt-1">
                                          <Badge className={record.status === 'Convicted' ? 'bg-red-600 text-white' : 
                                                          record.status === 'Under Investigation' ? 'bg-orange-600 text-white' :
                                                          'bg-gray-600 text-white'}>
                                            {record.status}
                                          </Badge>
                                          <Badge className={`${getRiskColor(record.severity)} text-white`}>
                                            {record.severity} Severity
                                          </Badge>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                                      <div>
                                        <p className="text-gray-600">Jurisdiction</p>
                                        <p className="font-semibold text-gray-900">{record.jurisdiction}</p>
                                      </div>
                                      <div>
                                        <p className="text-gray-600">Date</p>
                                        <p className="font-semibold text-gray-900">{record.date}</p>
                                      </div>
                                    </div>
                                    <p className="text-sm text-gray-800 mb-2">{record.details}</p>
                                    {record.sentence && (
                                      <div className="bg-red-50 border border-red-300 rounded p-2">
                                        <p className="text-xs text-gray-600">Sentence</p>
                                        <p className="text-sm font-bold text-red-900">{record.sentence}</p>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* CIVIL LITIGATION */}
                          {associate.civilLitigation.length > 0 && (
                            <div className="bg-orange-100 border-2 border-orange-400 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <Scale className="w-5 h-5 text-orange-600" />
                                <h5 className="font-bold text-orange-900">Civil Litigation ({associate.civilLitigation.length})</h5>
                              </div>
                              <div className="space-y-3">
                                {associate.civilLitigation.map((case_) => (
                                  <div key={case_.id} className="bg-white rounded-lg p-3 border border-orange-300">
                                    <div className="flex items-start justify-between mb-2">
                                      <div className="flex-1">
                                        <h6 className="font-bold text-gray-900">{case_.caseType}</h6>
                                        <Badge className={case_.status === 'Open' ? 'bg-red-600 text-white' : 
                                                        case_.status === 'Settled' ? 'bg-green-600 text-white' :
                                                        'bg-gray-600 text-white'}>
                                          {case_.status}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                                      <div>
                                        <p className="text-gray-600">Plaintiff</p>
                                        <p className="font-semibold text-gray-900">{case_.plaintiff}</p>
                                      </div>
                                      <div>
                                        <p className="text-gray-600">Defendant</p>
                                        <p className="font-semibold text-gray-900">{case_.defendant}</p>
                                      </div>
                                    </div>
                                    {case_.amount && (
                                      <div className="bg-orange-50 border border-orange-300 rounded p-2 mb-2">
                                        <p className="text-xs text-gray-600">Claim Amount</p>
                                        <p className="text-lg font-bold text-orange-900">{case_.amount}</p>
                                      </div>
                                    )}
                                    <div className="text-xs text-gray-600">Date: {case_.date}</div>
                                    {case_.outcome && (
                                      <div className="mt-2 text-sm text-gray-800">
                                        <span className="font-semibold">Outcome:</span> {case_.outcome}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* DISQUALIFICATIONS */}
                          {associate.disqualifications.length > 0 && (
                            <div className="bg-purple-100 border-2 border-purple-400 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <ShieldAlert className="w-5 h-5 text-purple-600" />
                                <h5 className="font-bold text-purple-900">Disqualifications ({associate.disqualifications.length})</h5>
                              </div>
                              <div className="space-y-3">
                                {associate.disqualifications.map((dq) => (
                                  <div key={dq.id} className="bg-white rounded-lg p-3 border border-purple-300">
                                    <div className="flex items-start justify-between mb-2">
                                      <div className="flex-1">
                                        <h6 className="font-bold text-gray-900">{dq.type}</h6>
                                        <Badge className={dq.status === 'Active' ? 'bg-red-600 text-white' : 'bg-gray-600 text-white'}>
                                          {dq.status}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                                      <div>
                                        <p className="text-gray-600">Jurisdiction</p>
                                        <p className="font-semibold text-gray-900">{dq.jurisdiction}</p>
                                      </div>
                                      <div>
                                        <p className="text-gray-600">Period</p>
                                        <p className="font-semibold text-gray-900">{dq.startDate} - {dq.endDate || 'Ongoing'}</p>
                                      </div>
                                    </div>
                                    <div className="bg-purple-50 border border-purple-300 rounded p-2 mb-2">
                                      <p className="text-xs text-gray-600">Reason</p>
                                      <p className="text-sm font-semibold text-purple-900">{dq.reason}</p>
                                    </div>
                                    <div className="text-xs text-gray-600">Issued by: {dq.issuingAuthority}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* BANKRUPTCIES */}
                          {associate.bankruptcies.length > 0 && (
                            <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                                <h5 className="font-bold text-yellow-900">Bankruptcies ({associate.bankruptcies.length})</h5>
                              </div>
                              <div className="space-y-3">
                                {associate.bankruptcies.map((bk) => (
                                  <div key={bk.id} className="bg-white rounded-lg p-3 border border-yellow-300">
                                    <div className="flex items-start justify-between mb-2">
                                      <div className="flex-1">
                                        <h6 className="font-bold text-gray-900">{bk.type}</h6>
                                        <Badge className={bk.status === 'Active' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}>
                                          {bk.status}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                                      <div>
                                        <p className="text-gray-600">Filing Date</p>
                                        <p className="font-semibold text-gray-900">{bk.filingDate}</p>
                                      </div>
                                      <div>
                                        <p className="text-gray-600">Discharge Date</p>
                                        <p className="font-semibold text-gray-900">{bk.dischargeDate || 'Pending'}</p>
                                      </div>
                                    </div>
                                    {bk.liabilities && (
                                      <div className="bg-yellow-50 border border-yellow-300 rounded p-2 mb-2">
                                        <p className="text-xs text-gray-600">Total Liabilities</p>
                                        <p className="text-lg font-bold text-yellow-900">{bk.liabilities}</p>
                                        {bk.creditorCount && (
                                          <p className="text-xs text-gray-700">{bk.creditorCount} creditors</p>
                                        )}
                                      </div>
                                    )}
                                    <div className="text-xs text-gray-600">Jurisdiction: {bk.jurisdiction}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* REGULATORY ACTIONS */}
                          {associate.regulatoryActions.length > 0 && (
                            <div className="bg-orange-100 border-2 border-orange-400 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <ShieldAlert className="w-5 h-5 text-orange-600" />
                                <h5 className="font-bold text-orange-900">Regulatory Actions ({associate.regulatoryActions.length})</h5>
                              </div>
                              <div className="space-y-3">
                                {associate.regulatoryActions.map((action) => (
                                  <div key={action.id} className="bg-white rounded-lg p-3 border border-orange-300">
                                    <div className="flex items-start justify-between mb-2">
                                      <div className="flex-1">
                                        <h6 className="font-bold text-gray-900">{action.regulator}</h6>
                                        <Badge className="bg-orange-600 text-white">{action.actionType}</Badge>
                                      </div>
                                    </div>
                                    <p className="text-sm text-gray-800 mb-2">{action.details}</p>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                      <div>
                                        <p className="text-gray-600">Date</p>
                                        <p className="font-semibold text-gray-900">{action.date}</p>
                                      </div>
                                      <div>
                                        <p className="text-gray-600">Status</p>
                                        <p className="font-semibold text-gray-900">{action.status}</p>
                                      </div>
                                    </div>
                                    {action.amount && (
                                      <div className="bg-orange-50 border border-orange-300 rounded p-2 mt-2">
                                        <p className="text-xs text-gray-600">Amount</p>
                                        <p className="text-lg font-bold text-orange-900">{action.amount}</p>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* ADVERSE MEDIA */}
                          {associate.adverseMedia.length > 0 && (
                            <div className="bg-red-100 border-2 border-red-400 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <Newspaper className="w-5 h-5 text-red-600" />
                                <h5 className="font-bold text-red-900">Adverse Media ({associate.adverseMedia.length})</h5>
                              </div>
                              <div className="space-y-3">
                                {associate.adverseMedia.map((media) => (
                                  <div key={media.id} className="bg-white rounded-lg p-3 border border-red-300">
                                    <div className="flex items-start justify-between mb-2">
                                      <div className="flex-1">
                                        <h6 className="font-bold text-gray-900">{media.headline}</h6>
                                        <div className="flex items-center gap-2 mt-1">
                                          <Badge className={`${getRiskColor(media.severity)} text-white`}>
                                            {media.severity}
                                          </Badge>
                                          <Badge className="bg-blue-600 text-white">{media.category}</Badge>
                                          {media.verified && (
                                            <Badge className="bg-green-600 text-white flex items-center gap-1">
                                              <CheckCircle className="w-3 h-3" />
                                              Verified
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <p className="text-sm text-gray-800 mb-2">{media.summary}</p>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                      <div>
                                        <p className="text-gray-600">Source</p>
                                        <p className="font-semibold text-gray-900">{media.source}</p>
                                      </div>
                                      <div>
                                        <p className="text-gray-600">Date</p>
                                        <p className="font-semibold text-gray-900">{media.date}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* CLEAN ASSOCIATES */}
      {networkData.associateLegalRecords.filter(a => !a.hasLegalIssues).length > 0 && (
        <Card className="border-2 border-green-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Clean Associates ({networkData.associateLegalRecords.filter(a => !a.hasLegalIssues).length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-3">
              {networkData.associateLegalRecords
                .filter(associate => !associate.hasLegalIssues)
                .map((associate) => (
                  <div key={associate.associateId} className="bg-green-50 border border-green-300 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      {getAssociateIcon(associate.associateType)}
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{associate.associateName}</p>
                        <p className="text-xs text-gray-600">{associate.relationship}</p>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <Badge variant="outline" className="bg-white text-green-700 border-green-400">
                      {associate.associateType}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ALL CLEAN MESSAGE */}
      {networkData.associatesWithIssues === 0 && (
        <Card className="border-2 border-green-400 bg-green-50 shadow-lg">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-900 mb-2">All Associates Clean</h3>
            <p className="text-green-800 mb-4">
              Comprehensive legal screening completed for all {networkData.totalAssociatesChecked} directors, shareholders, UBOs, and related entities. No legal issues identified.
            </p>
            <div className="inline-block bg-green-200 border-2 border-green-400 rounded-lg px-6 py-3">
              <p className="font-bold text-green-900">Network Legal Risk: {networkData.overallNetworkRisk}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

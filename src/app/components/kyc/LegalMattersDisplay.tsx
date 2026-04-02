import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  AlertTriangle,
  Scale,
  Building,
  FileText,
  XCircle,
  CheckCircle,
  Clock,
  ShieldAlert,
  TrendingDown,
  Eye,
  ChevronDown,
  ChevronUp,
  Users
} from 'lucide-react';
import { ClientLegalData, LegalMatter, RegulatoryAction, CompanyStrikeOff, LegalConcern } from './LegalMattersData';
import { NetworkLegalRiskDisplay } from './NetworkLegalRiskDisplay';
import { ASSOCIATE_LEGAL_DATABASE } from './AssociateLegalData';

interface LegalMattersDisplayProps {
  legalData: ClientLegalData;
}

export function LegalMattersDisplay({ legalData }: LegalMattersDisplayProps) {
  const [expandedMatterId, setExpandedMatterId] = useState<string | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-500';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-50 border-red-300';
      case 'High': return 'bg-orange-50 border-orange-300';
      case 'Medium': return 'bg-yellow-50 border-yellow-300';
      default: return 'bg-blue-50 border-blue-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-700 border-red-300';
      case 'Under Investigation': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'Pending Appeal': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Settled': return 'bg-green-100 text-green-700 border-green-300';
      case 'Closed': return 'bg-gray-100 text-gray-700 border-gray-300';
      default: return 'bg-blue-100 text-blue-700 border-blue-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Criminal Investigation': return <ShieldAlert className="w-6 h-6 text-red-600" />;
      case 'Regulatory Action': return <AlertTriangle className="w-6 h-6 text-orange-600" />;
      case 'Company Strike-off': return <TrendingDown className="w-6 h-6 text-red-600" />;
      case 'Litigation': return <Scale className="w-6 h-6 text-blue-600" />;
      default: return <FileText className="w-6 h-6 text-gray-600" />;
    }
  };

  const openMatters = legalData.legalMatters.filter(m => m.status === 'Open' || m.status === 'Under Investigation' || m.status === 'Pending Appeal');
  const closedMatters = legalData.legalMatters.filter(m => m.status === 'Closed' || m.status === 'Settled');

  return (
    <div className="space-y-6">
      {/* NETWORK-WIDE ASSOCIATE LEGAL SCREENING */}
      <Card className="border-2 border-purple-400 shadow-lg bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardHeader className="border-b-2 border-purple-200">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-600" />
            Network-Wide Legal Risk Screening
          </CardTitle>
          <p className="text-sm text-purple-800 mt-2">
            Comprehensive legal background checks on all directors, shareholders, beneficial owners, trustees, and related entities
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <NetworkLegalRiskDisplay 
            networkData={ASSOCIATE_LEGAL_DATABASE[legalData.clientId] || {
              clientId: legalData.clientId,
              overallNetworkRisk: 'Low',
              totalAssociatesChecked: 0,
              associatesWithIssues: 0,
              criticalAssociates: 0,
              highRiskAssociates: 0,
              associateLegalRecords: []
            }}
          />
        </CardContent>
      </Card>

      {/* OVERALL RISK ALERT */}
      {legalData.hasLegalIssues && (
        <Card className={`border-2 shadow-lg ${
          legalData.overallLegalRisk === 'Critical' ? 'border-red-500 bg-red-50' :
          legalData.overallLegalRisk === 'High' ? 'border-orange-500 bg-orange-50' :
          legalData.overallLegalRisk === 'Medium' ? 'border-yellow-500 bg-yellow-50' :
          'border-blue-500 bg-blue-50'
        }`}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className={`w-12 h-12 flex-shrink-0 ${
                legalData.overallLegalRisk === 'Critical' ? 'text-red-600' :
                legalData.overallLegalRisk === 'High' ? 'text-orange-600' :
                legalData.overallLegalRisk === 'Medium' ? 'text-yellow-600' :
                'text-blue-600'
              }`} />
              <div className="flex-1">
                <h3 className={`text-2xl font-bold mb-2 ${
                  legalData.overallLegalRisk === 'Critical' ? 'text-red-900' :
                  legalData.overallLegalRisk === 'High' ? 'text-orange-900' :
                  legalData.overallLegalRisk === 'Medium' ? 'text-yellow-900' :
                  'text-blue-900'
                }`}>
                  {legalData.overallLegalRisk} Legal Risk Profile
                </h3>
                <div className="grid grid-cols-4 gap-3 mt-3">
                  <div className="bg-white bg-opacity-70 rounded p-3 border">
                    <p className="text-xs text-gray-600">Open Matters</p>
                    <p className="text-2xl font-bold text-red-600">{openMatters.length}</p>
                  </div>
                  <div className="bg-white bg-opacity-70 rounded p-3 border">
                    <p className="text-xs text-gray-600">Regulatory Actions</p>
                    <p className="text-2xl font-bold text-orange-600">{legalData.regulatoryActions.length}</p>
                  </div>
                  <div className="bg-white bg-opacity-70 rounded p-3 border">
                    <p className="text-xs text-gray-600">Strike-offs</p>
                    <p className="text-2xl font-bold text-red-600">{legalData.companyStrikeOffs.length}</p>
                  </div>
                  <div className="bg-white bg-opacity-70 rounded p-3 border">
                    <p className="text-xs text-gray-600">Legal Concerns</p>
                    <p className="text-2xl font-bold text-yellow-600">{legalData.legalConcerns.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* OPEN LEGAL MATTERS */}
      {openMatters.length > 0 && (
        <Card className="border-2 border-red-400 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b-2 border-red-200">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              Open Legal Matters ({openMatters.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {openMatters.map((matter) => {
                const isExpanded = expandedMatterId === matter.id;
                
                return (
                  <div key={matter.id} className={`border-2 rounded-lg ${getSeverityBg(matter.severity)}`}>
                    {/* Matter Header */}
                    <div 
                      className="p-4 cursor-pointer hover:bg-opacity-70 transition-all"
                      onClick={() => setExpandedMatterId(isExpanded ? null : matter.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getTypeIcon(matter.type)}
                            <h4 className="font-bold text-lg text-gray-900">{matter.title}</h4>
                            <Badge className={`${getSeverityColor(matter.severity)} text-white`}>
                              {matter.severity}
                            </Badge>
                            <Badge className={`border ${getStatusColor(matter.status)}`}>
                              {matter.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-xs text-gray-600">Type</p>
                              <p className="font-semibold text-gray-900">{matter.type}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Opened</p>
                              <p className="font-semibold text-gray-900">{matter.dateOpened}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Jurisdiction</p>
                              <p className="font-semibold text-gray-900">{matter.jurisdiction}</p>
                            </div>
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

                      {/* Quick Summary */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <Scale className="w-4 h-4 text-gray-600" />
                        <span className="text-xs text-gray-700">{matter.description.substring(0, 100)}...</span>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="border-t-2 border-gray-300 p-4 space-y-4 bg-white bg-opacity-50">
                        {/* Full Description */}
                        <div className="bg-gray-100 border border-gray-300 rounded-lg p-3">
                          <h5 className="font-bold text-sm text-gray-900 mb-2">Description</h5>
                          <p className="text-sm text-gray-800">{matter.description}</p>
                        </div>

                        {/* Court & Case Details */}
                        {matter.court && (
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-blue-100 border border-blue-300 rounded-lg p-3">
                              <p className="text-xs text-gray-600 mb-1">Court</p>
                              <p className="font-semibold text-gray-900">{matter.court}</p>
                            </div>
                            {matter.caseNumber && (
                              <div className="bg-purple-100 border border-purple-300 rounded-lg p-3">
                                <p className="text-xs text-gray-600 mb-1">Case Number</p>
                                <p className="font-semibold text-gray-900">{matter.caseNumber}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Parties Involved */}
                        <div className="bg-cyan-100 border border-cyan-300 rounded-lg p-3">
                          <h5 className="font-bold text-sm text-gray-900 mb-2">Parties Involved</h5>
                          <div className="flex flex-wrap gap-2">
                            {matter.parties.map((party, idx) => (
                              <Badge key={idx} variant="outline" className="bg-white">
                                {party}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Financial Impact */}
                        {matter.financialImpact && (
                          <div className="bg-red-100 border-2 border-red-400 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <AlertTriangle className="w-4 h-4 text-red-600" />
                              <h5 className="font-bold text-sm text-red-900">Financial Impact</h5>
                            </div>
                            <p className="text-sm text-red-800 font-semibold">{matter.financialImpact}</p>
                          </div>
                        )}

                        {/* Reputational Risk */}
                        <div className={`border-2 rounded-lg p-3 ${getSeverityBg(matter.reputationalRisk)}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <ShieldAlert className="w-4 h-4 text-gray-700" />
                            <h5 className="font-bold text-sm text-gray-900">Reputational Risk</h5>
                          </div>
                          <Badge className={`${getSeverityColor(matter.reputationalRisk)} text-white`}>
                            {matter.reputationalRisk}
                          </Badge>
                        </div>

                        {/* Related Entities */}
                        {matter.relatedEntities && matter.relatedEntities.length > 0 && (
                          <div className="bg-orange-100 border-2 border-orange-400 rounded-lg p-3">
                            <h5 className="font-bold text-sm text-orange-900 mb-2">Related Entities</h5>
                            <div className="flex flex-wrap gap-2">
                              {matter.relatedEntities.map((entity, idx) => (
                                <Badge key={idx} className="bg-orange-200 text-orange-900 border border-orange-400">
                                  {entity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Documents */}
                        {matter.documents && matter.documents.length > 0 && (
                          <div className="bg-blue-50 border border-blue-300 rounded-lg p-3">
                            <h5 className="font-bold text-sm text-gray-900 mb-2">Documents</h5>
                            <div className="space-y-1">
                              {matter.documents.map((doc, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm">
                                  <FileText className="w-4 h-4 text-blue-600" />
                                  <span className="text-gray-800">{doc}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="text-xs">
                            <Eye className="w-3 h-3 mr-1" />
                            View Full Case File
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs">
                            <FileText className="w-3 h-3 mr-1" />
                            Generate Report
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* REGULATORY ACTIONS */}
      {legalData.regulatoryActions.length > 0 && (
        <Card className="border-2 border-orange-400 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-orange-600" />
              Regulatory Actions ({legalData.regulatoryActions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {legalData.regulatoryActions.map((action) => (
                <div key={action.id} className={`border-2 rounded-lg p-4 ${getSeverityBg(action.severity)}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-bold text-lg text-gray-900">{action.regulator}</h5>
                        <Badge className={`${getSeverityColor(action.severity)} text-white`}>
                          {action.severity}
                        </Badge>
                        <Badge variant="outline" className={
                          action.status === 'Active' ? 'bg-red-100 text-red-700 border-red-300' :
                          action.status === 'Under Appeal' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                          'bg-green-100 text-green-700 border-green-300'
                        }>
                          {action.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                        <div>
                          <p className="text-xs text-gray-600">Action Type</p>
                          <p className="font-semibold text-gray-900">{action.actionType}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Date</p>
                          <p className="font-semibold text-gray-900">{action.date}</p>
                        </div>
                        {action.amount && (
                          <div>
                            <p className="text-xs text-gray-600">Amount</p>
                            <p className="font-bold text-red-600">{action.amount}</p>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-800">{action.details}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* COMPANY STRIKE-OFFS */}
      {legalData.companyStrikeOffs.length > 0 && (
        <Card className="border-2 border-red-400 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-6 h-6 text-red-600" />
              Company Strike-offs ({legalData.companyStrikeOffs.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {legalData.companyStrikeOffs.map((strikeOff) => (
                <div key={strikeOff.id} className="border-2 border-red-300 bg-red-50 rounded-lg p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <Building className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-bold text-lg text-gray-900">{strikeOff.entityName}</h5>
                        <Badge className="bg-red-500 text-white">
                          {strikeOff.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <p className="text-xs text-gray-600">Jurisdiction</p>
                          <p className="font-semibold text-gray-900">{strikeOff.jurisdiction}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Strike-off Date</p>
                          <p className="font-semibold text-gray-900">{strikeOff.strikeOffDate}</p>
                        </div>
                      </div>
                      <div className="bg-red-100 border border-red-300 rounded p-3 mb-3">
                        <p className="text-xs text-gray-600 mb-1">Reason</p>
                        <p className="text-sm font-semibold text-red-900">{strikeOff.reason}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-white bg-opacity-70 rounded p-2">
                          <p className="text-gray-600">Director</p>
                          <p className="font-bold text-gray-900">{strikeOff.directorInvolved}</p>
                        </div>
                        <div className="bg-white bg-opacity-70 rounded p-2">
                          <p className="text-gray-600">Assets</p>
                          <p className="font-bold text-gray-900">{strikeOff.assetsStatus}</p>
                        </div>
                        <div className="bg-white bg-opacity-70 rounded p-2">
                          <p className="text-gray-600">Creditor Claims</p>
                          <p className={`font-bold ${strikeOff.creditorsClaims ? 'text-red-600' : 'text-green-600'}`}>
                            {strikeOff.creditorsClaims ? 'Yes' : 'No'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* LEGAL CONCERNS */}
      {legalData.legalConcerns.length > 0 && (
        <Card className="border-2 border-yellow-400 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
              Legal Concerns ({legalData.legalConcerns.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {legalData.legalConcerns.map((concern) => (
                <div key={concern.id} className={`border-2 rounded-lg p-4 ${getSeverityBg(concern.severity)}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-bold text-gray-900">{concern.concernType}</h5>
                        <Badge className={`${getSeverityColor(concern.severity)} text-white`}>
                          {concern.severity}
                        </Badge>
                        {concern.verified ? (
                          <Badge className="bg-green-500 text-white flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-500 text-white flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            Unverified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-800 mb-2">{concern.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-gray-600">Source</p>
                          <p className="font-semibold text-gray-900">{concern.source}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Date</p>
                          <p className="font-semibold text-gray-900">{concern.date}</p>
                        </div>
                      </div>
                      <div className="mt-2 bg-white bg-opacity-70 rounded p-2">
                        <p className="text-xs text-gray-600">Impact Assessment</p>
                        <p className="text-sm font-semibold text-gray-900">{concern.impact}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* CLOSED LEGAL MATTERS */}
      {closedMatters.length > 0 && (
        <Card className="border-2 border-gray-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-gray-600" />
              Closed Legal Matters ({closedMatters.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {closedMatters.map((matter) => (
                <div key={matter.id} className="border-2 border-gray-200 bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-bold text-gray-900">{matter.title}</h5>
                        <Badge className={`border ${getStatusColor(matter.status)}`}>
                          {matter.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-sm mb-2">
                        <div>
                          <p className="text-xs text-gray-600">Type</p>
                          <p className="font-semibold text-gray-900">{matter.type}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Closed Date</p>
                          <p className="font-semibold text-gray-900">{matter.dateClosed}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Severity</p>
                          <Badge className={`${getSeverityColor(matter.severity)} text-white`}>
                            {matter.severity}
                          </Badge>
                        </div>
                      </div>
                      {matter.outcome && (
                        <div className="bg-green-100 border border-green-300 rounded p-2">
                          <p className="text-xs text-gray-600 mb-1">Outcome</p>
                          <p className="text-sm font-semibold text-green-900">{matter.outcome}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* NO LEGAL ISSUES */}
      {!legalData.hasLegalIssues && (
        <Card className="border-2 border-green-300 bg-green-50 shadow-lg">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-900 mb-2">No Legal Issues Found</h3>
            <p className="text-green-800">
              This client has a clean legal record with no open litigation, regulatory actions, or legal concerns.
            </p>
            <div className="mt-4 inline-block bg-green-200 border-2 border-green-400 rounded-lg px-6 py-3">
              <p className="font-bold text-green-900">Legal Risk: {legalData.overallLegalRisk}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
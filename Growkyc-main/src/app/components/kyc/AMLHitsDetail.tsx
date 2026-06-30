import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Shield,
  AlertTriangle,
  XCircle,
  CheckCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText,
  Globe,
  Calendar,
  Target
} from 'lucide-react';
import { AML_HITS_DATABASE, SanctionsMatch, PEPMatch, AdverseMediaHit } from './AMLHitsData';
import { AdverseMediaCards } from './AdverseMediaCards';

interface AMLHitsDetailProps {
  clientId: string;
  clientName?: string;
}

export function AMLHitsDetail({ clientId, clientName = 'Client' }: AMLHitsDetailProps) {
  const [expandedSanctions, setExpandedSanctions] = useState<Set<string>>(new Set());
  const [expandedPEP, setExpandedPEP] = useState<Set<string>>(new Set());
  const [expandedMedia, setExpandedMedia] = useState<Set<string>>(new Set());

  const hits = AML_HITS_DATABASE[clientId] || { sanctions: [], pep: [], adverseMedia: [] };

  const toggleSanction = (id: string) => {
    const newSet = new Set(expandedSanctions);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedSanctions(newSet);
  };

  const togglePEP = (id: string) => {
    const newSet = new Set(expandedPEP);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedPEP(newSet);
  };

  const toggleMedia = (id: string) => {
    const newSet = new Set(expandedMedia);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedMedia(newSet);
  };

  const getMatchColor = (strength: string) => {
    switch (strength) {
      case 'Exact': return 'bg-red-500';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-500';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* SANCTIONS MATCHES */}
      {hits.sanctions.length > 0 && (
        <Card className="border-2 border-red-400 shadow-lg">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-red-600" />
              Sanctions Screening Results ({hits.sanctions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-red-50/50 border-b-2 border-red-200">
                    <th className="text-left p-4 font-bold text-red-900">List Name</th>
                    <th className="text-left p-4 font-bold text-red-900">Match %</th>
                    <th className="text-left p-4 font-bold text-red-900">Entity Name</th>
                    <th className="text-left p-4 font-bold text-red-900">Match Date</th>
                    <th className="text-center p-4 font-bold text-red-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {hits.sanctions.map((sanction) => (
                    <React.Fragment key={sanction.id}>
                      <tr className="border-b border-red-100 hover:bg-red-50/30 transition-colors">
                        <td className="p-4">
                          <span className="font-semibold text-gray-900">{sanction.listName}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  sanction.matchPercentage >= 95 ? 'bg-red-600' : 
                                  sanction.matchPercentage >= 80 ? 'bg-orange-500' : 
                                  'bg-yellow-500'
                                }`}
                                style={{ width: `${sanction.matchPercentage}%` }}
                              />
                            </div>
                            <span className={`font-bold ${
                              sanction.matchPercentage >= 95 ? 'text-red-700' : 'text-gray-700'
                            }`}>
                              {sanction.matchPercentage}%
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-red-900">{sanction.matchedName}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-gray-600">{sanction.dateAdded}</span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-red-600 hover:text-red-800 hover:bg-red-100"
                              onClick={() => toggleSanction(sanction.id)}
                            >
                              {expandedSanctions.has(sanction.id) ? 'Hide' : 'View'}
                            </Button>
                            <Button 
                              size="sm" 
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              <Target className="w-4 h-4 mr-1" />
                              Action
                            </Button>
                          </div>
                        </td>
                      </tr>
                      {expandedSanctions.has(sanction.id) && (
                        <tr>
                          <td colSpan={5} className="p-6 bg-red-50/20 border-b border-red-200">
                            <div className="grid grid-cols-2 gap-8">
                              <div>
                                <h5 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                                  <FileText className="w-4 h-4" />
                                  Designation Reason
                                </h5>
                                <p className="text-gray-700 text-sm leading-relaxed">{sanction.reason}</p>
                              </div>
                              <div>
                                <h5 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                                  <Globe className="w-4 h-4" />
                                  Source Information
                                </h5>
                                <p className="text-gray-700 text-sm mb-4">{sanction.source}</p>
                                <a
                                  href={sanction.sourceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold text-sm"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  View Official Sanctions List Registry
                                </a>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* PEP MATCHES */}
      {hits.pep.length > 0 && (
        <Card className="border-2 border-orange-400 shadow-lg">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
              Politically Exposed Person (PEP) Matches ({hits.pep.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {hits.pep.map((pep) => (
                <div
                  key={pep.id}
                  className="border-2 border-orange-300 rounded-lg overflow-hidden bg-white"
                >
                  <div
                    className="p-4 bg-orange-50 cursor-pointer hover:bg-orange-100 transition-colors"
                    onClick={() => togglePEP(pep.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={`${getSeverityColor(pep.riskLevel)} text-white`}>
                            {pep.riskLevel} Level
                          </Badge>
                          <Badge variant="outline" className="bg-white">
                            {pep.pepType} Exposure
                          </Badge>
                          <Badge variant="outline" className="bg-white">
                            {pep.country}
                          </Badge>
                        </div>
                        <h4 className="font-bold text-lg text-orange-900 mb-1">{pep.name}</h4>
                        <p className="text-sm text-gray-700 font-semibold">{pep.position}</p>
                        <p className="text-sm text-gray-600">Political Role: {pep.organization}</p>
                        <p className="text-xs text-gray-500 mt-1">Identified: {pep.dateIdentified}</p>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="bg-white text-green-600 border-green-600 hover:bg-green-50"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Clear
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-orange-600 hover:bg-orange-700 text-white"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            Escalate
                          </Button>
                        </div>
                        <button className="text-orange-600 hover:text-orange-800 flex items-center text-sm font-semibold">
                          {expandedPEP.has(pep.id) ? (
                            <>Hide Details <ChevronUp className="w-5 h-5 ml-1" /></>
                          ) : (
                            <>View Details <ChevronDown className="w-5 h-5 ml-1" /></>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {expandedPEP.has(pep.id) && (
                    <div className="p-6 bg-white border-t-2 border-orange-200">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                          <p className="text-xs text-gray-600 mb-1">Position</p>
                          <p className="font-semibold text-gray-900">{pep.position}</p>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                          <p className="text-xs text-gray-600 mb-1">Organization</p>
                          <p className="font-semibold text-gray-900">{pep.organization}</p>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                          <p className="text-xs text-gray-600 mb-1">Country</p>
                          <p className="font-semibold text-gray-900">{pep.country}</p>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                          <p className="text-xs text-gray-600 mb-1">Risk Level</p>
                          <p className="font-semibold text-gray-900">{pep.riskLevel}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Globe className="w-4 h-4 text-gray-600" />
                          <h5 className="font-semibold text-gray-900">Source Database</h5>
                        </div>
                        <p className="text-gray-700 pl-6">{pep.source}</p>
                      </div>

                      <div>
                        <a
                          href={pep.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View Source Information
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ADVERSE MEDIA HITS — Enhanced Article Cards */}
      {hits.adverseMedia.length > 0 && (
        <AdverseMediaCards articles={hits.adverseMedia} clientName={clientName} />
      )}

      {/* NO HITS MESSAGE */}
      {hits.sanctions.length === 0 && hits.pep.length === 0 && hits.adverseMedia.length === 0 && (
        <Card className="border-2 border-green-300 shadow-lg">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-900 mb-2">No AML/CTF Hits Found</h3>
            <p className="text-gray-600">This client has a clean screening record with no sanctions, PEP, or adverse media matches.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Shield,
  AlertTriangle,
  XCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText,
  Globe,
  Calendar,
  Target
} from 'lucide-react';
import { AML_HITS_DATABASE, SanctionsMatch, PEPMatch, AdverseMediaHit } from './AMLHitsData';

interface AMLHitsDetailProps {
  clientId: string;
}

export function AMLHitsDetail({ clientId }: AMLHitsDetailProps) {
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
          <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <XCircle className="w-6 h-6 text-red-600" />
              Sanctions Matches ({hits.sanctions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {hits.sanctions.map((sanction) => (
                <div
                  key={sanction.id}
                  className="border-2 border-red-300 rounded-lg overflow-hidden bg-white"
                >
                  <div
                    className="p-4 bg-red-50 cursor-pointer hover:bg-red-100 transition-colors"
                    onClick={() => toggleSanction(sanction.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={`${getMatchColor(sanction.matchStrength)} text-white`}>
                            {sanction.matchStrength} Match
                          </Badge>
                          <Badge variant="outline" className="bg-white">
                            {sanction.country}
                          </Badge>
                        </div>
                        <h4 className="font-bold text-lg text-red-900 mb-1">{sanction.matchedName}</h4>
                        <p className="text-sm text-gray-700 font-semibold">{sanction.listName}</p>
                        <p className="text-xs text-gray-500 mt-1">Added: {sanction.dateAdded}</p>
                      </div>
                      <button className="text-red-600 hover:text-red-800">
                        {expandedSanctions.has(sanction.id) ? (
                          <ChevronUp className="w-6 h-6" />
                        ) : (
                          <ChevronDown className="w-6 h-6" />
                        )}
                      </button>
                    </div>
                  </div>

                  {expandedSanctions.has(sanction.id) && (
                    <div className="p-6 bg-white border-t-2 border-red-200">
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-gray-600" />
                          <h5 className="font-semibold text-gray-900">Designation Reason</h5>
                        </div>
                        <p className="text-gray-700 leading-relaxed pl-6">{sanction.reason}</p>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Globe className="w-4 h-4 text-gray-600" />
                          <h5 className="font-semibold text-gray-900">Source</h5>
                        </div>
                        <p className="text-gray-700 pl-6">{sanction.source}</p>
                      </div>

                      <div>
                        <a
                          href={sanction.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View Official Sanctions List
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

      {/* PEP MATCHES */}
      {hits.pep.length > 0 && (
        <Card className="border-2 border-orange-400 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b">
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
                            {pep.riskLevel} Risk
                          </Badge>
                          <Badge variant="outline" className="bg-white">
                            {pep.pepType}
                          </Badge>
                          <Badge variant="outline" className="bg-white">
                            {pep.country}
                          </Badge>
                        </div>
                        <h4 className="font-bold text-lg text-orange-900 mb-1">{pep.name}</h4>
                        <p className="text-sm text-gray-700 font-semibold">{pep.position}</p>
                        <p className="text-sm text-gray-600">{pep.organization}</p>
                        <p className="text-xs text-gray-500 mt-1">Identified: {pep.dateIdentified}</p>
                      </div>
                      <button className="text-orange-600 hover:text-orange-800">
                        {expandedPEP.has(pep.id) ? (
                          <ChevronUp className="w-6 h-6" />
                        ) : (
                          <ChevronDown className="w-6 h-6" />
                        )}
                      </button>
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

      {/* ADVERSE MEDIA HITS */}
      {hits.adverseMedia.length > 0 && (
        <Card className="border-2 border-yellow-400 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-yellow-600" />
              Adverse Media Hits ({hits.adverseMedia.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {hits.adverseMedia.map((media) => (
                <div
                  key={media.id}
                  className={`border-2 rounded-lg overflow-hidden bg-white ${
                    media.severity === 'Critical' ? 'border-red-400' :
                    media.severity === 'High' ? 'border-orange-400' :
                    media.severity === 'Medium' ? 'border-yellow-400' :
                    'border-blue-400'
                  }`}
                >
                  <div
                    className={`p-4 cursor-pointer transition-colors ${
                      media.severity === 'Critical' ? 'bg-red-50 hover:bg-red-100' :
                      media.severity === 'High' ? 'bg-orange-50 hover:bg-orange-100' :
                      media.severity === 'Medium' ? 'bg-yellow-50 hover:bg-yellow-100' :
                      'bg-blue-50 hover:bg-blue-100'
                    }`}
                    onClick={() => toggleMedia(media.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <Badge className={`${getSeverityColor(media.severity)} text-white`}>
                            {media.severity}
                          </Badge>
                          <Badge variant="outline" className="bg-white">
                            {media.category}
                          </Badge>
                          <Badge variant="outline" className="bg-white">
                            Relevance: {media.relevanceScore}%
                          </Badge>
                        </div>
                        <h4 className="font-bold text-lg text-gray-900 mb-2">{media.headline}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Globe className="w-4 h-4" />
                            <span>{media.publication}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{media.publishDate}</span>
                          </div>
                        </div>
                      </div>
                      <button className={`${
                        media.severity === 'Critical' ? 'text-red-600 hover:text-red-800' :
                        media.severity === 'High' ? 'text-orange-600 hover:text-orange-800' :
                        media.severity === 'Medium' ? 'text-yellow-600 hover:text-yellow-800' :
                        'text-blue-600 hover:text-blue-800'
                      }`}>
                        {expandedMedia.has(media.id) ? (
                          <ChevronUp className="w-6 h-6" />
                        ) : (
                          <ChevronDown className="w-6 h-6" />
                        )}
                      </button>
                    </div>
                  </div>

                  {expandedMedia.has(media.id) && (
                    <div className="p-6 bg-white border-t-2">
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="w-5 h-5 text-gray-600" />
                          <h5 className="font-semibold text-gray-900 text-lg">Article Summary</h5>
                        </div>
                        <p className="text-gray-700 leading-relaxed pl-7">{media.summary}</p>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <p className="text-xs text-gray-600 mb-1">Publication</p>
                          <p className="font-semibold text-gray-900">{media.publication}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <p className="text-xs text-gray-600 mb-1">Published Date</p>
                          <p className="font-semibold text-gray-900">{media.publishDate}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <p className="text-xs text-gray-600 mb-1">Category</p>
                          <p className="font-semibold text-gray-900">{media.category}</p>
                        </div>
                      </div>

                      <div>
                        <a
                          href={media.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors ${
                            media.severity === 'Critical' ? 'bg-red-600 hover:bg-red-700' :
                            media.severity === 'High' ? 'bg-orange-600 hover:bg-orange-700' :
                            media.severity === 'Medium' ? 'bg-yellow-600 hover:bg-yellow-700' :
                            'bg-blue-600 hover:bg-blue-700'
                          }`}
                        >
                          <ExternalLink className="w-4 h-4" />
                          Read Full Article
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

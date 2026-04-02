import React from 'react';
import { Badge } from '../ui/badge';
import { AlertTriangle, CheckCircle, XCircle, Shield, User, Building } from 'lucide-react';
import { Director, Shareholder } from './RelatedEntitiesData';

interface DirectorsShareholdersDisplayProps {
  directors: Director[];
  shareholders: Shareholder[];
}

export function DirectorsShareholdersDisplay({ directors, shareholders }: DirectorsShareholdersDisplayProps) {
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
      case 'Critical': return 'bg-red-50 border-red-300';
      case 'High': return 'bg-orange-50 border-orange-300';
      case 'Medium': return 'bg-yellow-50 border-yellow-300';
      default: return 'bg-green-50 border-green-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* DIRECTORS */}
      {directors.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <User className="w-5 h-5 text-gray-600" />
            Directors ({directors.length})
          </h4>
          <div className="space-y-3">
            {directors.map((director, idx) => (
              <div key={idx} className={`border-2 rounded-lg p-4 ${getRiskBg(director.amlScreening.riskRating)}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="font-bold text-lg text-gray-900">{director.name}</h5>
                      <Badge className={`${getRiskColor(director.amlScreening.riskRating)} text-white`}>
                        {director.amlScreening.riskRating} Risk
                      </Badge>
                      <Badge variant="outline" className={director.status === 'Active' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-gray-100 text-gray-700'}>
                        {director.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-gray-600">Role</p>
                        <p className="font-semibold text-gray-900">{director.role}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Nationality</p>
                        <p className="font-semibold text-gray-900">{director.nationality}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Appointed</p>
                        <p className="font-semibold text-gray-900">{director.appointedDate}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AML Screening Results */}
                <div className={`mt-3 p-3 rounded-lg border-2 ${
                  director.amlScreening.riskRating === 'Critical' ? 'bg-red-100 border-red-400' :
                  director.amlScreening.riskRating === 'High' ? 'bg-orange-100 border-orange-400' :
                  director.amlScreening.riskRating === 'Medium' ? 'bg-yellow-100 border-yellow-400' :
                  'bg-green-100 border-green-400'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-gray-700" />
                    <p className="font-semibold text-sm text-gray-900">AML/CTF Screening Results</p>
                    <span className="text-xs text-gray-600">Last screened: {director.amlScreening.lastScreened}</span>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <div className={`rounded p-2 text-center ${
                      director.amlScreening.sanctionsMatches > 0 ? 'bg-red-200' : 'bg-white'
                    }`}>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        {director.amlScreening.sanctionsMatches > 0 ? (
                          <XCircle className="w-4 h-4 text-red-600" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600">Sanctions</p>
                      <p className={`font-bold ${director.amlScreening.sanctionsMatches > 0 ? 'text-red-700' : 'text-green-700'}`}>
                        {director.amlScreening.sanctionsMatches}
                      </p>
                    </div>

                    <div className={`rounded p-2 text-center ${
                      director.amlScreening.pepStatus !== 'Not PEP' ? 'bg-orange-200' : 'bg-white'
                    }`}>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        {director.amlScreening.pepStatus !== 'Not PEP' ? (
                          <AlertTriangle className="w-4 h-4 text-orange-600" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600">PEP Status</p>
                      <p className={`text-xs font-bold ${director.amlScreening.pepStatus !== 'Not PEP' ? 'text-orange-700' : 'text-green-700'}`}>
                        {director.amlScreening.pepStatus}
                      </p>
                    </div>

                    <div className={`rounded p-2 text-center ${
                      director.amlScreening.adverseMediaHits > 0 ? 'bg-yellow-200' : 'bg-white'
                    }`}>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        {director.amlScreening.adverseMediaHits > 0 ? (
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600">Adverse Media</p>
                      <p className={`font-bold ${director.amlScreening.adverseMediaHits > 0 ? 'text-yellow-700' : 'text-green-700'}`}>
                        {director.amlScreening.adverseMediaHits}
                      </p>
                    </div>

                    <div className={`rounded p-2 text-center ${getRiskBg(director.amlScreening.riskRating)}`}>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        {director.amlScreening.riskRating === 'Critical' || director.amlScreening.riskRating === 'High' ? (
                          <XCircle className="w-4 h-4 text-red-600" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600">Risk Rating</p>
                      <p className={`text-xs font-bold ${
                        director.amlScreening.riskRating === 'Critical' ? 'text-red-700' :
                        director.amlScreening.riskRating === 'High' ? 'text-orange-700' :
                        director.amlScreening.riskRating === 'Medium' ? 'text-yellow-700' :
                        'text-green-700'
                      }`}>
                        {director.amlScreening.riskRating}
                      </p>
                    </div>
                  </div>

                  {/* Red Flags */}
                  {director.amlScreening.redFlags.length > 0 && (
                    <div className="mt-3 p-2 bg-red-100 border-2 border-red-400 rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <p className="font-bold text-xs text-red-900">Red Flags Identified</p>
                      </div>
                      <ul className="space-y-1">
                        {director.amlScreening.redFlags.map((flag, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs">
                            <XCircle className="w-3 h-3 text-red-600 mt-0.5 flex-shrink-0" />
                            <span className="text-red-900">{flag}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SHAREHOLDERS */}
      {shareholders.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Building className="w-5 h-5 text-gray-600" />
            Shareholders ({shareholders.length})
          </h4>
          <div className="space-y-3">
            {shareholders.map((shareholder, idx) => (
              <div key={idx} className={`border-2 rounded-lg p-4 ${getRiskBg(shareholder.amlScreening.riskRating)}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="font-bold text-lg text-gray-900">{shareholder.name}</h5>
                      <Badge className={`${getRiskColor(shareholder.amlScreening.riskRating)} text-white`}>
                        {shareholder.amlScreening.riskRating} Risk
                      </Badge>
                      <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                        {shareholder.entityType}
                      </Badge>
                      <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
                        {shareholder.percentage}% Ownership
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-gray-600">Shares</p>
                        <p className="font-semibold text-gray-900">{shareholder.shares}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">{shareholder.nationality ? 'Nationality' : 'Jurisdiction'}</p>
                        <p className="font-semibold text-gray-900">{shareholder.nationality || shareholder.jurisdiction}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Acquisition Date</p>
                        <p className="font-semibold text-gray-900">{shareholder.acquisitionDate}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AML Screening Results */}
                <div className={`mt-3 p-3 rounded-lg border-2 ${
                  shareholder.amlScreening.riskRating === 'Critical' ? 'bg-red-100 border-red-400' :
                  shareholder.amlScreening.riskRating === 'High' ? 'bg-orange-100 border-orange-400' :
                  shareholder.amlScreening.riskRating === 'Medium' ? 'bg-yellow-100 border-yellow-400' :
                  'bg-green-100 border-green-400'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-gray-700" />
                    <p className="font-semibold text-sm text-gray-900">AML/CTF Screening Results</p>
                    <span className="text-xs text-gray-600">Last screened: {shareholder.amlScreening.lastScreened}</span>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <div className={`rounded p-2 text-center ${
                      shareholder.amlScreening.sanctionsMatches > 0 ? 'bg-red-200' : 'bg-white'
                    }`}>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        {shareholder.amlScreening.sanctionsMatches > 0 ? (
                          <XCircle className="w-4 h-4 text-red-600" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600">Sanctions</p>
                      <p className={`font-bold ${shareholder.amlScreening.sanctionsMatches > 0 ? 'text-red-700' : 'text-green-700'}`}>
                        {shareholder.amlScreening.sanctionsMatches}
                      </p>
                    </div>

                    <div className={`rounded p-2 text-center ${
                      shareholder.amlScreening.pepStatus !== 'Not PEP' ? 'bg-orange-200' : 'bg-white'
                    }`}>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        {shareholder.amlScreening.pepStatus !== 'Not PEP' ? (
                          <AlertTriangle className="w-4 h-4 text-orange-600" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600">PEP Status</p>
                      <p className={`text-xs font-bold ${shareholder.amlScreening.pepStatus !== 'Not PEP' ? 'text-orange-700' : 'text-green-700'}`}>
                        {shareholder.amlScreening.pepStatus}
                      </p>
                    </div>

                    <div className={`rounded p-2 text-center ${
                      shareholder.amlScreening.adverseMediaHits > 0 ? 'bg-yellow-200' : 'bg-white'
                    }`}>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        {shareholder.amlScreening.adverseMediaHits > 0 ? (
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600">Adverse Media</p>
                      <p className={`font-bold ${shareholder.amlScreening.adverseMediaHits > 0 ? 'text-yellow-700' : 'text-green-700'}`}>
                        {shareholder.amlScreening.adverseMediaHits}
                      </p>
                    </div>

                    <div className={`rounded p-2 text-center ${getRiskBg(shareholder.amlScreening.riskRating)}`}>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        {shareholder.amlScreening.riskRating === 'Critical' || shareholder.amlScreening.riskRating === 'High' ? (
                          <XCircle className="w-4 h-4 text-red-600" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600">Risk Rating</p>
                      <p className={`text-xs font-bold ${
                        shareholder.amlScreening.riskRating === 'Critical' ? 'text-red-700' :
                        shareholder.amlScreening.riskRating === 'High' ? 'text-orange-700' :
                        shareholder.amlScreening.riskRating === 'Medium' ? 'text-yellow-700' :
                        'text-green-700'
                      }`}>
                        {shareholder.amlScreening.riskRating}
                      </p>
                    </div>
                  </div>

                  {/* Red Flags */}
                  {shareholder.amlScreening.redFlags.length > 0 && (
                    <div className="mt-3 p-2 bg-red-100 border-2 border-red-400 rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <p className="font-bold text-xs text-red-900">Red Flags Identified</p>
                      </div>
                      <ul className="space-y-1">
                        {shareholder.amlScreening.redFlags.map((flag, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs">
                            <XCircle className="w-3 h-3 text-red-600 mt-0.5 flex-shrink-0" />
                            <span className="text-red-900">{flag}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {directors.length === 0 && shareholders.length === 0 && (
        <div className="p-6 text-center bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600">No directors or shareholders information available</p>
        </div>
      )}
    </div>
  );
}

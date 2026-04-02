import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Building,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Globe,
  Calendar,
  DollarSign,
  FileText,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';
import { RELATED_ENTITIES_DATABASE, RelatedEntity } from './RelatedEntitiesData';
import { DirectorsShareholdersDisplay } from './DirectorsShareholdersDisplay';

interface RelatedEntitiesTabProps {
  clientId: string;
}

export function RelatedEntitiesTab({ clientId }: RelatedEntitiesTabProps) {
  const [expandedEntities, setExpandedEntities] = useState<Set<string>>(new Set());

  const entities = RELATED_ENTITIES_DATABASE[clientId] || [];

  const toggleEntity = (id: string) => {
    const newSet = new Set(expandedEntities);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedEntities(newSet);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Critical': return 'bg-red-500';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getRiskBorder = (risk: string) => {
    switch (risk) {
      case 'Critical': return 'border-red-400';
      case 'High': return 'border-orange-400';
      case 'Medium': return 'border-yellow-400';
      default: return 'border-green-400';
    }
  };

  const getRiskBg = (risk: string) => {
    switch (risk) {
      case 'Critical': return 'bg-red-50';
      case 'High': return 'bg-orange-50';
      case 'Medium': return 'bg-yellow-50';
      default: return 'bg-green-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500';
      case 'Inactive': return 'bg-gray-500';
      case 'Under Administration': return 'bg-orange-500';
      case 'Deregistered': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const criticalEntities = entities.filter(e => e.riskRating === 'Critical');
  const highRiskEntities = entities.filter(e => e.riskRating === 'High');
  const mediumRiskEntities = entities.filter(e => e.riskRating === 'Medium');
  const lowRiskEntities = entities.filter(e => e.riskRating === 'Low');

  return (
    <div className="space-y-6">
      {/* SUMMARY STATISTICS */}
      <Card className="border-2 border-blue-300 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <CardTitle className="flex items-center gap-2">
            <Building className="w-6 h-6 text-blue-600" />
            Related Entities Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Total Entities</p>
              <p className="text-4xl font-bold text-blue-600">{entities.length}</p>
            </div>
            <div className={`rounded-lg p-4 border ${criticalEntities.length > 0 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-1">
                {criticalEntities.length > 0 && <XCircle className="w-5 h-5 text-red-600" />}
                <p className="text-sm text-gray-600">Critical Risk</p>
              </div>
              <p className={`text-4xl font-bold ${criticalEntities.length > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                {criticalEntities.length}
              </p>
            </div>
            <div className={`rounded-lg p-4 border ${highRiskEntities.length > 0 ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-1">
                {highRiskEntities.length > 0 && <AlertTriangle className="w-5 h-5 text-orange-600" />}
                <p className="text-sm text-gray-600">High Risk</p>
              </div>
              <p className={`text-4xl font-bold ${highRiskEntities.length > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                {highRiskEntities.length}
              </p>
            </div>
            <div className={`rounded-lg p-4 border ${mediumRiskEntities.length > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'}`}>
              <p className="text-sm text-gray-600 mb-1">Medium Risk</p>
              <p className={`text-4xl font-bold ${mediumRiskEntities.length > 0 ? 'text-yellow-600' : 'text-gray-400'}`}>
                {mediumRiskEntities.length}
              </p>
            </div>
            <div className={`rounded-lg p-4 border ${lowRiskEntities.length > 0 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-1">
                {lowRiskEntities.length > 0 && <CheckCircle className="w-5 h-5 text-green-600" />}
                <p className="text-sm text-gray-600">Low Risk</p>
              </div>
              <p className={`text-4xl font-bold ${lowRiskEntities.length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                {lowRiskEntities.length}
              </p>
            </div>
          </div>

          {(criticalEntities.length > 0 || highRiskEntities.length > 0) && (
            <div className="mt-6 p-4 bg-red-50 rounded-lg border-2 border-red-300">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                <div>
                  <p className="font-bold text-lg text-red-900">High Risk Entities Identified</p>
                  <p className="text-sm text-red-700">
                    {criticalEntities.length + highRiskEntities.length} entities require enhanced due diligence and ongoing monitoring
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ENTITIES LIST */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Building className="w-6 h-6 text-gray-700" />
          All Related Entities ({entities.length})
        </h2>
        
        {entities.length === 0 ? (
          <Card className="border-2 border-gray-300">
            <CardContent className="p-8 text-center">
              <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">No Related Entities Found</h3>
              <p className="text-gray-600">
                No entities found where directors or shareholders hold more than 25% ownership
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {entities.map((entity) => (
              <Card key={entity.id} className={`border-2 ${getRiskBorder(entity.riskRating)} shadow-lg overflow-hidden`}>
                <div
                  className={`p-6 ${getRiskBg(entity.riskRating)} cursor-pointer hover:opacity-90 transition-opacity`}
                  onClick={() => toggleEntity(entity.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-gray-900">{entity.entityName}</h3>
                        <Badge className={`${getRiskColor(entity.riskRating)} text-white`}>
                          {entity.riskRating} Risk
                        </Badge>
                        <Badge className={`${getStatusColor(entity.status)} text-white`}>
                          {entity.status}
                        </Badge>
                        {entity.adverseFindings.length > 0 && (
                          <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">
                            {entity.adverseFindings.length} Adverse Finding{entity.adverseFindings.length > 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Related Person</p>
                          <p className="font-semibold text-gray-900">{entity.personName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Relationship</p>
                          <p className="font-semibold text-gray-900">{entity.relationship}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Ownership</p>
                          <p className="font-semibold text-2xl text-blue-600">{entity.ownershipPercentage}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Directorship</p>
                          <div className="flex items-center gap-2">
                            {entity.directorshipActive ? (
                              <>
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <p className="font-semibold text-green-600">Active</p>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-5 h-5 text-gray-400" />
                                <p className="font-semibold text-gray-500">No</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <button className={`ml-4 ${
                      entity.riskRating === 'Critical' ? 'text-red-600 hover:text-red-800' :
                      entity.riskRating === 'High' ? 'text-orange-600 hover:text-orange-800' :
                      entity.riskRating === 'Medium' ? 'text-yellow-600 hover:text-yellow-800' :
                      'text-green-600 hover:text-green-800'
                    }`}>
                      {expandedEntities.has(entity.id) ? (
                        <ChevronUp className="w-8 h-8" />
                      ) : (
                        <ChevronDown className="w-8 h-8" />
                      )}
                    </button>
                  </div>
                </div>

                {expandedEntities.has(entity.id) && (
                  <div className="p-6 bg-white border-t-2">
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      {/* Left Column */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Building className="w-5 h-5 text-gray-600" />
                            Entity Details
                          </h4>
                          <div className="space-y-2">
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                              <p className="text-xs text-gray-600 mb-1">Entity Type</p>
                              <p className="font-semibold text-gray-900">{entity.entityType}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                              <p className="text-xs text-gray-600 mb-1">Industry</p>
                              <p className="font-semibold text-gray-900">{entity.industry}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                              <p className="text-xs text-gray-600 mb-1">Jurisdiction</p>
                              <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-blue-600" />
                                <p className="font-semibold text-gray-900">{entity.jurisdiction}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {entity.registrationNumber && (
                          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                            <p className="text-xs text-gray-600 mb-1">Registration Number</p>
                            <p className="font-semibold text-gray-900">{entity.registrationNumber}</p>
                          </div>
                        )}

                        <div className="bg-cyan-50 rounded-lg p-3 border border-cyan-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="w-4 h-4 text-cyan-600" />
                            <p className="text-xs text-gray-600">Registration Date</p>
                          </div>
                          <p className="font-semibold text-gray-900">{entity.registrationDate}</p>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-gray-600" />
                            Business Information
                          </h4>
                          <div className="space-y-2">
                            {entity.annualRevenue && (
                              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                                <p className="text-xs text-gray-600 mb-1">Annual Revenue</p>
                                <div className="flex items-center gap-2">
                                  <DollarSign className="w-4 h-4 text-green-600" />
                                  <p className="font-semibold text-gray-900">{entity.annualRevenue}</p>
                                </div>
                              </div>
                            )}
                            {entity.employees && (
                              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                                <p className="text-xs text-gray-600 mb-1">Employees</p>
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4 text-purple-600" />
                                  <p className="font-semibold text-gray-900">{entity.employees}</p>
                                </div>
                              </div>
                            )}
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                              <p className="text-xs text-gray-600 mb-1">Last Updated</p>
                              <p className="font-semibold text-gray-900">{entity.lastUpdated}</p>
                            </div>
                          </div>
                        </div>

                        <div className={`rounded-lg p-4 border-2 ${
                          entity.riskRating === 'Critical' ? 'bg-red-50 border-red-300' :
                          entity.riskRating === 'High' ? 'bg-orange-50 border-orange-300' :
                          entity.riskRating === 'Medium' ? 'bg-yellow-50 border-yellow-300' :
                          'bg-green-50 border-green-300'
                        }`}>
                          <p className="text-xs text-gray-600 mb-2">Risk Assessment</p>
                          <div className="flex items-center gap-2">
                            {entity.riskRating === 'Critical' || entity.riskRating === 'High' ? (
                              <AlertTriangle className={`w-6 h-6 ${entity.riskRating === 'Critical' ? 'text-red-600' : 'text-orange-600'}`} />
                            ) : (
                              <CheckCircle className={`w-6 h-6 ${entity.riskRating === 'Medium' ? 'text-yellow-600' : 'text-green-600'}`} />
                            )}
                            <p className={`text-2xl font-bold ${
                              entity.riskRating === 'Critical' ? 'text-red-600' :
                              entity.riskRating === 'High' ? 'text-orange-600' :
                              entity.riskRating === 'Medium' ? 'text-yellow-600' :
                              'text-green-600'
                            }`}>
                              {entity.riskRating} Risk
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Adverse Findings */}
                    {entity.adverseFindings.length > 0 && (
                      <div className="mb-6 p-4 bg-red-50 rounded-lg border-2 border-red-300">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertTriangle className="w-6 h-6 text-red-600" />
                          <h4 className="font-bold text-lg text-red-900">Adverse Findings</h4>
                        </div>
                        <ul className="space-y-2">
                          {entity.adverseFindings.map((finding, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                              <p className="text-gray-900">{finding}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Directors and Shareholders with AML Screening */}
                    <div className="mb-6">
                      <DirectorsShareholdersDisplay 
                        directors={entity.directors}
                        shareholders={entity.shareholders}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                      <Button variant="outline" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        View Full Profile
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        ASIC Search
                      </Button>
                      {entity.riskRating === 'Critical' || entity.riskRating === 'High' ? (
                        <Button className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          Flag for Review
                        </Button>
                      ) : null}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Building,
  User,
  AlertTriangle,
  ChevronRight,
  Network,
  Users,
  TrendingUp,
  Shield
} from 'lucide-react';
import { RELATED_ENTITIES_DATABASE, RelatedEntity } from './RelatedEntitiesData';

interface EntityNetworkChartProps {
  clientId: string;
  clientName: string;
}

interface EntityNode {
  entity: RelatedEntity;
  connectedVia: string; // person name
  relationship: string;
}

export function EntityNetworkChart({ clientId, clientName }: EntityNetworkChartProps) {
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const entities = RELATED_ENTITIES_DATABASE[clientId] || [];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Critical': return 'border-red-500 bg-red-50';
      case 'High': return 'border-orange-500 bg-orange-50';
      case 'Medium': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-green-500 bg-green-50';
    }
  };

  const getRiskDotColor = (risk: string) => {
    switch (risk) {
      case 'Critical': return 'bg-red-500';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  // Group entities by person
  const entitiesByPerson: Record<string, EntityNode[]> = {};
  entities.forEach(entity => {
    if (!entitiesByPerson[entity.personName]) {
      entitiesByPerson[entity.personName] = [];
    }
    entitiesByPerson[entity.personName].push({
      entity,
      connectedVia: entity.personName,
      relationship: entity.relationship
    });
  });

  const people = Object.keys(entitiesByPerson);

  // Calculate statistics
  const totalDirectorships = entities.filter(e => e.relationship === 'Director' || e.relationship === 'Both').length;
  const totalShareholders = entities.filter(e => e.relationship === 'Shareholder' || e.relationship === 'Both').length;
  const highRiskCount = entities.filter(e => e.riskRating === 'Critical' || e.riskRating === 'High').length;

  return (
    <div className="space-y-6">
      {/* NETWORK STATISTICS */}
      <Card className="border-2 border-blue-300 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <CardTitle className="flex items-center gap-2">
            <Network className="w-6 h-6 text-blue-600" />
            Entity Network Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Building className="w-5 h-5 text-blue-600" />
                <p className="text-sm text-gray-600">Total Entities</p>
              </div>
              <p className="text-4xl font-bold text-blue-600">{entities.length}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-purple-600" />
                <p className="text-sm text-gray-600">Connected People</p>
              </div>
              <p className="text-4xl font-bold text-purple-600">{people.length}</p>
            </div>
            <div className="bg-cyan-50 rounded-lg p-4 border-2 border-cyan-200">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-5 h-5 text-cyan-600" />
                <p className="text-sm text-gray-600">Directorships</p>
              </div>
              <p className="text-4xl font-bold text-cyan-600">{totalDirectorships}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <p className="text-sm text-gray-600">High Risk</p>
              </div>
              <p className="text-4xl font-bold text-orange-600">{highRiskCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* VISUAL NETWORK CHART */}
      <Card className="border-2 border-blue-300 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Entity Relationship Map
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-8">
            {/* ROOT ENTITY */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-2xl p-6 border-4 border-blue-700 min-w-[320px]">
                  <div className="flex items-center gap-3 mb-2">
                    <Building className="w-8 h-8" />
                    <div>
                      <p className="text-xs uppercase tracking-wide opacity-90">Primary Entity</p>
                      <h3 className="text-xl font-bold">{clientName}</h3>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-blue-400">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs opacity-75">Related Entities</p>
                        <p className="font-bold text-lg">{entities.length}</p>
                      </div>
                      <div>
                        <p className="text-xs opacity-75">Key People</p>
                        <p className="font-bold text-lg">{people.length}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Vertical line down */}
                {people.length > 0 && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gray-300 h-12 top-full"></div>
                )}
              </div>
            </div>

            {/* PEOPLE AND THEIR ENTITIES */}
            {people.length > 0 && (
              <div className="space-y-12">
                {people.map((personName, personIdx) => {
                  const personEntities = entitiesByPerson[personName];
                  const highestRisk = personEntities.reduce((max, e) => {
                    const riskOrder = { 'Low': 1, 'Medium': 2, 'High': 3, 'Critical': 4 };
                    const currentRisk = riskOrder[e.entity.riskRating] || 0;
                    const maxRisk = riskOrder[max] || 0;
                    return currentRisk > maxRisk ? e.entity.riskRating : max;
                  }, 'Low');

                  return (
                    <div key={personName} className="relative">
                      {/* Connecting line from top */}
                      {personIdx === 0 && (
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gray-300 h-8 -top-8"></div>
                      )}
                      
                      {/* Person Node */}
                      <div className="flex justify-center mb-6">
                        <div className={`relative border-4 rounded-xl shadow-xl p-5 min-w-[280px] ${getRiskColor(highestRisk)}`}>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="relative">
                              <User className="w-10 h-10 text-gray-700" />
                              <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${getRiskDotColor(highestRisk)} border-2 border-white`}></div>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs uppercase tracking-wide text-gray-600">Connected Person</p>
                              <h4 className="text-lg font-bold text-gray-900">{personName}</h4>
                            </div>
                            <Badge className={`${getRiskDotColor(highestRisk)} text-white`}>
                              {highestRisk}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="bg-white bg-opacity-60 rounded p-2 text-center">
                              <p className="text-gray-600">Entities</p>
                              <p className="font-bold text-gray-900">{personEntities.length}</p>
                            </div>
                            <div className="bg-white bg-opacity-60 rounded p-2 text-center">
                              <p className="text-gray-600">Director</p>
                              <p className="font-bold text-gray-900">
                                {personEntities.filter(e => e.relationship === 'Director' || e.relationship === 'Both').length}
                              </p>
                            </div>
                            <div className="bg-white bg-opacity-60 rounded p-2 text-center">
                              <p className="text-gray-600">Shareholder</p>
                              <p className="font-bold text-gray-900">
                                {personEntities.filter(e => e.relationship === 'Shareholder' || e.relationship === 'Both').length}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Vertical line down to entities */}
                        {personEntities.length > 0 && (
                          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gray-300 h-8 top-full"></div>
                        )}
                      </div>

                      {/* Entities connected to this person */}
                      <div className="relative">
                        {/* Horizontal connecting line */}
                        {personEntities.length > 1 && (
                          <div 
                            className="absolute top-0 bg-gray-300 h-1"
                            style={{
                              left: '12.5%',
                              right: '12.5%',
                            }}
                          ></div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                          {personEntities.map((node) => {
                            const entity = node.entity;
                            const isSelected = selectedEntity === entity.id;

                            return (
                              <div key={entity.id} className="relative flex flex-col items-center">
                                {/* Vertical line up to horizontal connector */}
                                <div className="absolute w-1 bg-gray-300 h-8 -top-8 left-1/2 transform -translate-x-1/2"></div>

                                {/* Entity Card */}
                                <div
                                  className={`border-3 rounded-lg shadow-lg p-4 cursor-pointer transition-all hover:shadow-2xl hover:scale-105 w-full ${getRiskColor(entity.riskRating)} ${
                                    isSelected ? 'ring-4 ring-blue-500' : ''
                                  }`}
                                  onClick={() => setSelectedEntity(isSelected ? null : entity.id)}
                                >
                                  <div className="flex items-start gap-2 mb-3">
                                    <Building className={`w-6 h-6 flex-shrink-0 ${
                                      entity.riskRating === 'Critical' ? 'text-red-600' :
                                      entity.riskRating === 'High' ? 'text-orange-600' :
                                      entity.riskRating === 'Medium' ? 'text-yellow-600' :
                                      'text-green-600'
                                    }`} />
                                    <div className="flex-1 min-w-0">
                                      <h5 className="font-bold text-sm text-gray-900 leading-tight mb-1 line-clamp-2">
                                        {entity.entityName}
                                      </h5>
                                      <p className="text-xs text-gray-600 truncate">{entity.jurisdiction}</p>
                                    </div>
                                  </div>

                                  <div className="space-y-2 mb-3">
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="text-gray-600">Relationship:</span>
                                      <Badge variant="outline" className="text-xs">
                                        {entity.relationship}
                                      </Badge>
                                    </div>
                                    {entity.ownershipPercentage > 0 && (
                                      <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-600">Ownership:</span>
                                        <span className="font-bold text-blue-600">{entity.ownershipPercentage}%</span>
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Badge className={`${getRiskDotColor(entity.riskRating)} text-white flex-1 justify-center`}>
                                      {entity.riskRating} Risk
                                    </Badge>
                                    {entity.adverseFindings.length > 0 && (
                                      <div className="bg-red-100 text-red-700 rounded px-2 py-1 text-xs font-bold flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" />
                                        {entity.adverseFindings.length}
                                      </div>
                                    )}
                                  </div>

                                  {/* Expanded Details */}
                                  {isSelected && (
                                    <div className="mt-3 pt-3 border-t border-gray-300 space-y-2 text-xs">
                                      <div className="bg-white bg-opacity-80 rounded p-2">
                                        <p className="text-gray-600">Industry</p>
                                        <p className="font-semibold text-gray-900">{entity.industry}</p>
                                      </div>
                                      <div className="bg-white bg-opacity-80 rounded p-2">
                                        <p className="text-gray-600">Type</p>
                                        <p className="font-semibold text-gray-900">{entity.entityType}</p>
                                      </div>
                                      <div className="bg-white bg-opacity-80 rounded p-2">
                                        <p className="text-gray-600">Status</p>
                                        <p className="font-semibold text-gray-900">{entity.status}</p>
                                      </div>
                                      {entity.directors && entity.directors.length > 0 && (
                                        <div className="bg-white bg-opacity-80 rounded p-2">
                                          <p className="text-gray-600 mb-1">Directors</p>
                                          <div className="space-y-1">
                                            {entity.directors.map((director, idx) => (
                                              <div key={idx} className="flex items-center gap-1">
                                                <div className={`w-2 h-2 rounded-full ${getRiskDotColor(director.amlScreening.riskRating)}`}></div>
                                                <span className="font-semibold text-gray-900 text-xs">{director.name}</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                      {entity.adverseFindings.length > 0 && (
                                        <div className="bg-red-50 border border-red-300 rounded p-2">
                                          <div className="flex items-center gap-1 mb-1">
                                            <AlertTriangle className="w-3 h-3 text-red-600" />
                                            <p className="text-red-900 font-bold">Adverse Findings</p>
                                          </div>
                                          <ul className="space-y-1">
                                            {entity.adverseFindings.slice(0, 2).map((finding, idx) => (
                                              <li key={idx} className="text-red-800 text-xs">• {finding}</li>
                                            ))}
                                            {entity.adverseFindings.length > 2 && (
                                              <li className="text-red-800 text-xs italic">+ {entity.adverseFindings.length - 2} more</li>
                                            )}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Connection to next person */}
                      {personIdx < people.length - 1 && (
                        <div className="flex justify-center mt-8">
                          <div className="w-1 bg-gray-300 h-12"></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Legend */}
            <div className="border-t pt-6 mt-8">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-gray-600" />
                Risk Level Legend
              </h4>
              <div className="grid grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-700">Low Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                  <span className="text-sm text-gray-700">Medium Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                  <span className="text-sm text-gray-700">High Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <span className="text-sm text-gray-700">Critical Risk</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* INSTRUCTIONS */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Network className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">How to Read This Chart:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-800">
                <li>The primary entity appears at the top in blue</li>
                <li>Each connected person (director/shareholder) is shown with their entity network</li>
                <li>Lines show ownership and directorship relationships</li>
                <li>Color coding indicates risk level - red/orange for high risk entities</li>
                <li>Click on any entity card to see more details</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

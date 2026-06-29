import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Network,
  User,
  Building2,
  Crown,
  Shield,
  AlertCircle,
  CheckCircle,
  Users,
  Plus,
  Download,
  Share2,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  TrendingUp,
  AlertTriangle,
  Info
} from 'lucide-react';

interface BeneficialOwner {
  id: string;
  name: string;
  type: 'individual' | 'entity';
  ownership: number;
  role: string;
  verified: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  isPEP: boolean;
  sanctionsMatch: boolean;
}

interface Entity {
  id: string;
  name: string;
  type: 'company' | 'trust' | 'partnership' | 'smsf';
  abn?: string;
  acn?: string;
  owners: BeneficialOwner[];
  controllers: BeneficialOwner[];
}

interface BeneficialOwnershipMapperProps {
  onBack: () => void;
}

export function BeneficialOwnershipMapper({ onBack }: BeneficialOwnershipMapperProps) {
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'graph' | 'table'>('graph');

  // Sample data - would come from API
  const entities: Entity[] = [
    {
      id: 'entity-1',
      name: 'Smith Family Trust',
      type: 'trust',
      abn: '12 345 678 901',
      owners: [],
      controllers: [
        {
          id: 'ubo-1',
          name: 'John Smith',
          type: 'individual',
          ownership: 0,
          role: 'Trustee',
          verified: true,
          riskLevel: 'low',
          isPEP: false,
          sanctionsMatch: false
        },
        {
          id: 'ubo-2',
          name: 'Jane Smith',
          type: 'individual',
          ownership: 0,
          role: 'Appointor',
          verified: true,
          riskLevel: 'low',
          isPEP: false,
          sanctionsMatch: false
        }
      ]
    },
    {
      id: 'entity-2',
      name: 'Smith Holdings Pty Ltd',
      type: 'company',
      abn: '23 456 789 012',
      acn: '123 456 789',
      owners: [
        {
          id: 'ubo-3',
          name: 'Smith Family Trust',
          type: 'entity',
          ownership: 100,
          role: 'Shareholder',
          verified: true,
          riskLevel: 'low',
          isPEP: false,
          sanctionsMatch: false
        }
      ],
      controllers: [
        {
          id: 'ubo-1',
          name: 'John Smith',
          type: 'individual',
          ownership: 0,
          role: 'Director',
          verified: true,
          riskLevel: 'low',
          isPEP: false,
          sanctionsMatch: false
        }
      ]
    },
    {
      id: 'entity-3',
      name: 'Smith Investment Fund',
      type: 'company',
      abn: '34 567 890 123',
      acn: '234 567 890',
      owners: [
        {
          id: 'ubo-4',
          name: 'John Smith',
          type: 'individual',
          ownership: 60,
          role: 'Shareholder',
          verified: true,
          riskLevel: 'low',
          isPEP: false,
          sanctionsMatch: false
        },
        {
          id: 'ubo-5',
          name: 'Jane Smith',
          type: 'individual',
          ownership: 30,
          role: 'Shareholder',
          verified: true,
          riskLevel: 'low',
          isPEP: false,
          sanctionsMatch: false
        },
        {
          id: 'ubo-6',
          name: 'Michael Chen',
          type: 'individual',
          ownership: 10,
          role: 'Shareholder',
          verified: false,
          riskLevel: 'medium',
          isPEP: false,
          sanctionsMatch: false
        }
      ],
      controllers: [
        {
          id: 'ubo-4',
          name: 'John Smith',
          type: 'individual',
          ownership: 60,
          role: 'Director',
          verified: true,
          riskLevel: 'low',
          isPEP: false,
          sanctionsMatch: false
        }
      ]
    },
    {
      id: 'entity-4',
      name: 'Offshore Investment Ltd',
      type: 'company',
      abn: '45 678 901 234',
      acn: '345 678 901',
      owners: [
        {
          id: 'ubo-7',
          name: 'Vladimir Petrov',
          type: 'individual',
          ownership: 75,
          role: 'Shareholder',
          verified: false,
          riskLevel: 'high',
          isPEP: true,
          sanctionsMatch: true
        },
        {
          id: 'ubo-8',
          name: 'Cayman Holdings Corp',
          type: 'entity',
          ownership: 25,
          role: 'Shareholder',
          verified: false,
          riskLevel: 'high',
          isPEP: false,
          sanctionsMatch: false
        }
      ],
      controllers: [
        {
          id: 'ubo-7',
          name: 'Vladimir Petrov',
          type: 'individual',
          ownership: 75,
          role: 'Director',
          verified: false,
          riskLevel: 'high',
          isPEP: true,
          sanctionsMatch: true
        }
      ]
    }
  ];

  const getUltimateBeneficialOwners = (entity: Entity): BeneficialOwner[] => {
    // Get all individuals with 25%+ ownership or control
    const ubos = new Map<string, BeneficialOwner>();
    
    entity.owners.forEach(owner => {
      if (owner.type === 'individual' && owner.ownership >= 25) {
        ubos.set(owner.id, owner);
      }
    });
    
    entity.controllers.forEach(controller => {
      if (controller.type === 'individual') {
        ubos.set(controller.id, controller);
      }
    });
    
    return Array.from(ubos.values());
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-400 bg-red-500/15 border-red-300';
      case 'medium': return 'text-amber-400 bg-amber-500/15 border-amber-300';
      case 'low': return 'text-green-400 bg-green-500/15 border-green-300';
      default: return 'text-slate-300 bg-[#0f172a] border-white/10';
    }
  };

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'company': return Building2;
      case 'trust': return Shield;
      case 'partnership': return Users;
      case 'smsf': return TrendingUp;
      default: return Building2;
    }
  };

  return (
    <div className="min-h-screen bg-[#1e293b]">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-8 py-12">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-white hover:bg-white/20 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/20">
            <Network className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-bold mb-2">Beneficial Ownership Mapper</h1>
            <p className="text-white/90 text-xl">Visual ownership graphs • UBO detection • Layered tracing</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Total Entities</div>
            </div>
            <div className="text-4xl font-bold mb-1">{entities.length}</div>
            <div className="text-xs text-white/70">Mapped with ownership</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Ultimate Beneficial Owners</div>
            </div>
            <div className="text-4xl font-bold mb-1">
              {new Set(entities.flatMap(e => getUltimateBeneficialOwners(e).map(u => u.id))).size}
            </div>
            <div className="text-xs text-white/70">25%+ ownership or control</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">High-Risk UBOs</div>
            </div>
            <div className="text-4xl font-bold mb-1">
              {entities.flatMap(e => getUltimateBeneficialOwners(e)).filter(u => u.riskLevel === 'high').length}
            </div>
            <div className="text-xs text-white/70">Require escalation</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Verified UBOs</div>
            </div>
            <div className="text-4xl font-bold mb-1">
              {entities.flatMap(e => getUltimateBeneficialOwners(e)).filter(u => u.verified).length}
            </div>
            <div className="text-xs text-white/70">ID verification complete</div>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        {/* Controls */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Button
              variant={viewMode === 'graph' ? 'default' : 'outline'}
              onClick={() => setViewMode('graph')}
            >
              <Network className="w-4 h-4 mr-2" />
              Graph View
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              onClick={() => setViewMode('table')}
            >
              <Users className="w-4 h-4 mr-2" />
              Table View
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Entity
            </Button>
          </div>
        </div>

        {viewMode === 'graph' ? (
          <div className="space-y-8">
            {/* Visual Ownership Graph */}
            {entities.map((entity) => {
              const EntityIcon = getEntityIcon(entity.type);
              const ubos = getUltimateBeneficialOwners(entity);
              const hasHighRisk = ubos.some(u => u.riskLevel === 'high' || u.sanctionsMatch || u.isPEP);

              return (
                <Card key={entity.id} className={`border-2 ${hasHighRisk ? 'border-red-300 bg-red-500/10' : 'border-white/10'}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                          hasHighRisk ? 'bg-red-500/15' : 'bg-indigo-500/15'
                        }`}>
                          <EntityIcon className={`w-8 h-8 ${hasHighRisk ? 'text-red-400' : 'text-indigo-400'}`} />
                        </div>
                        <div>
                          <CardTitle className="text-2xl mb-1">{entity.name}</CardTitle>
                          <CardDescription className="flex items-center gap-3">
                            <span className="capitalize">{entity.type}</span>
                            {entity.abn && <span>• ABN: {entity.abn}</span>}
                            {entity.acn && <span>• ACN: {entity.acn}</span>}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {hasHighRisk && (
                          <Badge className="bg-red-600 text-white">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            High Risk
                          </Badge>
                        )}
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Ownership Structure */}
                    <div className="grid grid-cols-2 gap-6">
                      {/* Shareholders/Owners */}
                      {entity.owners.length > 0 && (
                        <div>
                          <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Share2 className="w-4 h-4 text-blue-400" />
                            Ownership ({entity.owners.length})
                          </h4>
                          <div className="space-y-3">
                            {entity.owners.map((owner) => (
                              <div
                                key={owner.id}
                                className={`p-4 rounded-lg border-2 ${
                                  owner.sanctionsMatch || owner.isPEP
                                    ? 'border-red-300 bg-red-500/10'
                                    : owner.verified
                                    ? 'border-green-300 bg-green-500/10'
                                    : 'border-amber-300 bg-amber-500/10'
                                }`}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    {owner.type === 'individual' ? (
                                      <User className="w-4 h-4 text-slate-300" />
                                    ) : (
                                      <Building2 className="w-4 h-4 text-slate-300" />
                                    )}
                                    <span className="font-semibold text-white">{owner.name}</span>
                                  </div>
                                  {owner.verified ? (
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                  ) : (
                                    <AlertCircle className="w-4 h-4 text-amber-400" />
                                  )}
                                </div>
                                <div className="flex items-center gap-3 text-xs">
                                  <Badge variant="outline" className="text-xs">
                                    {owner.role}
                                  </Badge>
                                  <Badge className="bg-indigo-600 text-white text-xs">
                                    {owner.ownership}% ownership
                                  </Badge>
                                  <Badge className={getRiskColor(owner.riskLevel)}>
                                    {owner.riskLevel} risk
                                  </Badge>
                                  {owner.isPEP && (
                                    <Badge className="bg-amber-600 text-white text-xs">PEP</Badge>
                                  )}
                                  {owner.sanctionsMatch && (
                                    <Badge className="bg-red-600 text-white text-xs">Sanctions</Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Controllers */}
                      {entity.controllers.length > 0 && (
                        <div>
                          <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Crown className="w-4 h-4 text-purple-400" />
                            Controllers ({entity.controllers.length})
                          </h4>
                          <div className="space-y-3">
                            {entity.controllers.map((controller) => (
                              <div
                                key={controller.id}
                                className={`p-4 rounded-lg border-2 ${
                                  controller.sanctionsMatch || controller.isPEP
                                    ? 'border-red-300 bg-red-500/10'
                                    : controller.verified
                                    ? 'border-green-300 bg-green-500/10'
                                    : 'border-amber-300 bg-amber-500/10'
                                }`}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    {controller.type === 'individual' ? (
                                      <User className="w-4 h-4 text-slate-300" />
                                    ) : (
                                      <Building2 className="w-4 h-4 text-slate-300" />
                                    )}
                                    <span className="font-semibold text-white">{controller.name}</span>
                                  </div>
                                  {controller.verified ? (
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                  ) : (
                                    <AlertCircle className="w-4 h-4 text-amber-400" />
                                  )}
                                </div>
                                <div className="flex items-center gap-3 text-xs">
                                  <Badge variant="outline" className="text-xs">
                                    {controller.role}
                                  </Badge>
                                  <Badge className={getRiskColor(controller.riskLevel)}>
                                    {controller.riskLevel} risk
                                  </Badge>
                                  {controller.isPEP && (
                                    <Badge className="bg-amber-600 text-white text-xs">PEP</Badge>
                                  )}
                                  {controller.sanctionsMatch && (
                                    <Badge className="bg-red-600 text-white text-xs">Sanctions</Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Ultimate Beneficial Owners Summary */}
                    {ubos.length > 0 && (
                      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-500/30 rounded-xl">
                        <h4 className="font-bold text-purple-300 mb-3 flex items-center gap-2">
                          <Crown className="w-5 h-5 text-purple-400" />
                          Ultimate Beneficial Owners (UBO) - {ubos.length} identified
                        </h4>
                        <div className="grid grid-cols-3 gap-3">
                          {ubos.map((ubo) => (
                            <div
                              key={ubo.id}
                              className={`p-3 rounded-lg border ${
                                ubo.sanctionsMatch || ubo.isPEP
                                  ? 'border-red-300 bg-red-500/15'
                                  : 'border-purple-300 bg-[#1e293b]'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <User className="w-4 h-4 text-purple-400" />
                                <span className="font-semibold text-sm text-white">{ubo.name}</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {ubo.ownership > 0 && (
                                  <Badge className="bg-purple-600 text-white text-xs">
                                    {ubo.ownership}%
                                  </Badge>
                                )}
                                <Badge variant="outline" className="text-xs">
                                  {ubo.role}
                                </Badge>
                                {ubo.verified ? (
                                  <CheckCircle className="w-3 h-3 text-green-400" />
                                ) : (
                                  <AlertCircle className="w-3 h-3 text-amber-400" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          // Table View
          <Card>
            <CardHeader>
              <CardTitle>All Beneficial Owners</CardTitle>
              <CardDescription>Complete list of all UBOs across all entities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-white/10">
                      <th className="text-left py-3 px-4 font-bold">Name</th>
                      <th className="text-left py-3 px-4 font-bold">Entity</th>
                      <th className="text-left py-3 px-4 font-bold">Role</th>
                      <th className="text-center py-3 px-4 font-bold">Ownership %</th>
                      <th className="text-center py-3 px-4 font-bold">Risk Level</th>
                      <th className="text-center py-3 px-4 font-bold">Verified</th>
                      <th className="text-center py-3 px-4 font-bold">Flags</th>
                      <th className="text-right py-3 px-4 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entities.flatMap(entity =>
                      getUltimateBeneficialOwners(entity).map(ubo => ({
                        ...ubo,
                        entityName: entity.name,
                        entityType: entity.type
                      }))
                    ).map((ubo, idx) => (
                      <tr key={idx} className="border-b border-white/10 hover:bg-white/5">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-slate-300" />
                            <span className="font-semibold text-white">{ubo.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-slate-300" />
                            <div>
                              <div className="font-medium text-white">{ubo.entityName}</div>
                              <div className="text-xs text-slate-300 capitalize">{ubo.entityType}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{ubo.role}</Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {ubo.ownership > 0 ? (
                            <Badge className="bg-indigo-600 text-white">{ubo.ownership}%</Badge>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge className={getRiskColor(ubo.riskLevel)}>
                            {ubo.riskLevel}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {ubo.verified ? (
                            <CheckCircle className="w-5 h-5 text-green-400 mx-auto" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-amber-400 mx-auto" />
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {ubo.isPEP && (
                              <Badge className="bg-amber-600 text-white text-xs">PEP</Badge>
                            )}
                            {ubo.sanctionsMatch && (
                              <Badge className="bg-red-600 text-white text-xs">Sanctions</Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Card */}
        <Card className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-400" />
              About Beneficial Ownership
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6 text-sm text-slate-300">
              <div>
                <h4 className="font-bold text-white mb-2">What is a UBO?</h4>
                <p>
                  A Ultimate Beneficial Owner (UBO) is an individual who:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Owns 25% or more of the entity</li>
                  <li>Has control over the entity (director, trustee, appointor)</li>
                  <li>Exercises significant influence or control</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Why it matters</h4>
                <p>
                  Beneficial ownership mapping is critical for:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>AML/CTF compliance (AUSTRAC requirements)</li>
                  <li>Sanctions and PEP screening</li>
                  <li>Financial crime prevention</li>
                  <li>Tranche 2 AML/CTF Program obligations</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

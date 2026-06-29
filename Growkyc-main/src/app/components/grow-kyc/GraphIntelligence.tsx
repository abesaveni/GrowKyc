import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  ArrowLeft,
  Network,
  AlertTriangle,
  Shield,
  Users,
  Building,
  Eye,
  Download,
  Zap,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  Globe
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface GraphIntelligenceProps {
  onBack: () => void;
}

export function GraphIntelligence({ onBack }: GraphIntelligenceProps) {
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);

  const networkData = {
    nodes: [
      { 
        id: 'E001', 
        type: 'company', 
        name: 'Alpha Holdings Pty Ltd',
        risk: 'high',
        pep: false,
        insolvent: false,
        ownership: 45
      },
      { 
        id: 'E002', 
        type: 'company', 
        name: 'Beta Investment Corp',
        risk: 'medium',
        pep: false,
        insolvent: false,
        ownership: 30
      },
      { 
        id: 'P001', 
        type: 'person', 
        name: 'John Smith',
        risk: 'high',
        pep: true,
        insolvent: false,
        role: 'Director'
      },
      { 
        id: 'P002', 
        type: 'person', 
        name: 'Mary Johnson',
        risk: 'medium',
        pep: false,
        insolvent: false,
        role: 'Shareholder'
      },
      { 
        id: 'E003', 
        type: 'company', 
        name: 'Gamma Services Ltd',
        risk: 'low',
        pep: false,
        insolvent: false,
        ownership: 25
      },
      { 
        id: 'P003', 
        type: 'person', 
        name: 'David Chen',
        risk: 'high',
        pep: false,
        insolvent: true,
        role: 'Director'
      }
    ],
    edges: [
      { from: 'P001', to: 'E001', type: 'director', ownership: 35 },
      { from: 'P001', to: 'E002', type: 'director', ownership: 20 },
      { from: 'P002', to: 'E001', type: 'shareholder', ownership: 45 },
      { from: 'E001', to: 'E003', type: 'shareholder', ownership: 60 },
      { from: 'P003', to: 'E002', type: 'director', ownership: 0 },
      { from: 'P003', to: 'E003', type: 'director', ownership: 0 }
    ]
  };

  const riskClusters = [
    {
      id: 'RC-001',
      name: 'High Risk Network - John Smith',
      entities: 4,
      totalRisk: 'high',
      reasons: [
        'PEP involvement (John Smith)',
        'Insolvency flag (David Chen)',
        'Circular ownership detected',
        'Cross-entity director overlap'
      ],
      members: ['Alpha Holdings', 'Beta Investment', 'Gamma Services', 'John Smith']
    },
    {
      id: 'RC-002',
      name: 'Shared Director Cluster',
      entities: 3,
      totalRisk: 'medium',
      reasons: [
        'David Chen director of 2 companies',
        'Recent insolvency (within 12 months)',
        'Unusual address overlap'
      ],
      members: ['Beta Investment', 'Gamma Services', 'David Chen']
    }
  ];

  const controlWithoutEquity = [
    {
      type: 'Same Address',
      entities: ['Alpha Holdings Pty Ltd', 'Beta Investment Corp'],
      address: '123 George Street, Sydney NSW 2000',
      risk: 'medium',
      flagDate: '2024-02-15'
    },
    {
      type: 'Same Phone Number',
      entities: ['Beta Investment Corp', 'Gamma Services Ltd'],
      phone: '+61 2 9123 4567',
      risk: 'medium',
      flagDate: '2024-02-20'
    },
    {
      type: 'Shared Director',
      entities: ['Beta Investment Corp', 'Gamma Services Ltd', 'Delta Enterprises'],
      director: 'David Chen',
      risk: 'high',
      flagDate: '2024-01-10',
      note: 'Director has recent insolvency'
    },
    {
      type: 'Same IP Login',
      entities: ['Alpha Holdings Pty Ltd', 'Epsilon Trading Co'],
      ip: '203.45.67.89',
      risk: 'low',
      flagDate: '2024-02-28'
    }
  ];

  const ownershipHistory = [
    {
      date: '2024-02-15',
      entity: 'Alpha Holdings Pty Ltd',
      change: 'Ownership transfer',
      from: 'Peter Wilson (45%)',
      to: 'Mary Johnson (45%)',
      type: 'major',
      evidence: 'ASIC 484 Form'
    },
    {
      date: '2024-01-10',
      entity: 'Beta Investment Corp',
      change: 'Director appointment',
      from: null,
      to: 'David Chen',
      type: 'minor',
      evidence: 'ASIC 484 Form'
    },
    {
      date: '2023-12-05',
      entity: 'Gamma Services Ltd',
      change: 'Ownership increase',
      from: 'Alpha Holdings (40%)',
      to: 'Alpha Holdings (60%)',
      type: 'major',
      evidence: 'Share Transfer Agreement'
    },
    {
      date: '2023-11-20',
      entity: 'Alpha Holdings Pty Ltd',
      change: 'Director resignation',
      from: 'James Brown',
      to: null,
      type: 'minor',
      evidence: 'ASIC 370 Form'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0e17]">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="h-6 w-px bg-white/30" />
              <Network className="w-6 h-6 text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">Graph Intelligence</h1>
                <p className="text-sm text-white/90">Ownership Network & Risk Cluster Analytics</p>
              </div>
            </div>
            <Badge className="bg-[#0d121d] text-indigo-600 text-sm px-3 py-1">
              <Zap className="w-4 h-4 mr-1" />
              AI Network Scanning Active
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="graph" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="graph">Entity Graph</TabsTrigger>
            <TabsTrigger value="clusters">Risk Clusters</TabsTrigger>
            <TabsTrigger value="control">Control Signals</TabsTrigger>
            <TabsTrigger value="history">Ownership History</TabsTrigger>
          </TabsList>

          {/* Entity Graph View */}
          <TabsContent value="graph" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
              <Card className="border-2 border-purple-300 bg-purple-50">
                <CardContent className="p-6">
                  <div className="text-sm text-purple-700">Total Entities</div>
                  <div className="text-3xl font-bold text-purple-900">148</div>
                  <div className="text-xs text-purple-600 mt-1">In network graph</div>
                </CardContent>
              </Card>
              <Card className="border-2 border-red-300 bg-red-50">
                <CardContent className="p-6">
                  <div className="text-sm text-red-700">High Risk Nodes</div>
                  <div className="text-3xl font-bold text-red-900">12</div>
                  <div className="text-xs text-red-600 mt-1">Require review</div>
                </CardContent>
              </Card>
              <Card className="border-2 border-amber-300 bg-amber-50">
                <CardContent className="p-6">
                  <div className="text-sm text-amber-700">Circular Ownership</div>
                  <div className="text-3xl font-bold text-amber-900">3</div>
                  <div className="text-xs text-amber-600 mt-1">Detected patterns</div>
                </CardContent>
              </Card>
              <Card className="border-2 border-blue-300 bg-blue-50">
                <CardContent className="p-6">
                  <div className="text-sm text-blue-700">Shared Directors</div>
                  <div className="text-3xl font-bold text-blue-900">24</div>
                  <div className="text-xs text-blue-600 mt-1">Cross-entity links</div>
                </CardContent>
              </Card>
            </div>

            {/* Visual Graph Representation */}
            <Card className="border-2 border-indigo-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="w-5 h-5" />
                  Multi-Layer Ownership Network
                </CardTitle>
                <CardDescription>
                  Interactive entity relationship graph with risk scoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Graph Visualization Area */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-200 p-8 min-h-[600px] relative">
                  {/* Central Entity */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-2xl flex flex-col items-center justify-center border-4 border-red-700">
                      <Building className="w-12 h-12 text-white mb-1" />
                      <div className="text-white text-xs font-bold text-center">Alpha Holdings</div>
                      <Badge className="bg-red-900 text-white text-xs mt-1">HIGH RISK</Badge>
                    </div>
                  </div>

                  {/* Connected Entities - Top Left */}
                  <div className="absolute top-20 left-32">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg flex flex-col items-center justify-center border-4 border-blue-700">
                      <Users className="w-8 h-8 text-white mb-1" />
                      <div className="text-white text-xs font-bold">John Smith</div>
                      <Badge className="bg-amber-500 text-white text-xs mt-1">PEP</Badge>
                    </div>
                    <svg className="absolute top-12 left-24 w-48 h-48 pointer-events-none" style={{zIndex: -1}}>
                      <line x1="96" y1="48" x2="192" y2="144" stroke="#4F46E5" strokeWidth="3" strokeDasharray="5,5" />
                    </svg>
                  </div>

                  {/* Connected Entities - Top Right */}
                  <div className="absolute top-20 right-32">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-lg flex flex-col items-center justify-center border-4 border-green-700">
                      <Users className="w-8 h-8 text-white mb-1" />
                      <div className="text-white text-xs font-bold">Mary Johnson</div>
                      <Badge className="bg-green-800 text-white text-xs mt-1">45%</Badge>
                    </div>
                    <svg className="absolute top-12 right-24 w-48 h-48 pointer-events-none" style={{zIndex: -1}}>
                      <line x1="0" y1="48" x2="-96" y2="144" stroke="#10B981" strokeWidth="3" />
                    </svg>
                  </div>

                  {/* Connected Entities - Bottom Left */}
                  <div className="absolute bottom-32 left-48">
                    <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full shadow-lg flex flex-col items-center justify-center border-4 border-amber-700">
                      <Building className="w-8 h-8 text-white mb-1" />
                      <div className="text-white text-xs font-bold text-center">Beta Investment</div>
                      <Badge className="bg-amber-800 text-white text-xs mt-1">MEDIUM</Badge>
                    </div>
                    <svg className="absolute -top-24 left-12 w-48 h-48 pointer-events-none" style={{zIndex: -1}}>
                      <line x1="48" y1="120" x2="120" y2="0" stroke="#F59E0B" strokeWidth="3" />
                    </svg>
                  </div>

                  {/* Connected Entities - Bottom Right */}
                  <div className="absolute bottom-32 right-48">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full shadow-lg flex flex-col items-center justify-center border-4 border-purple-700">
                      <Building className="w-8 h-8 text-white mb-1" />
                      <div className="text-white text-xs font-bold text-center">Gamma Services</div>
                      <Badge className="bg-purple-800 text-white text-xs mt-1">60%</Badge>
                    </div>
                    <svg className="absolute -top-24 right-12 w-48 h-48 pointer-events-none" style={{zIndex: -1}}>
                      <line x1="48" y1="120" x2="-24" y2="0" stroke="#9333EA" strokeWidth="3" strokeDasharray="5,5" />
                    </svg>
                  </div>

                  {/* Connected Entities - Far Bottom */}
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-full shadow-lg flex flex-col items-center justify-center border-4 border-red-800">
                      <Users className="w-6 h-6 text-white mb-1" />
                      <div className="text-white text-xs font-bold">David Chen</div>
                      <Badge className="bg-red-900 text-white text-xs mt-1">INSOLV</Badge>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="absolute bottom-4 right-4 bg-[#0d121d] rounded-lg shadow-lg p-4 border-2 border-indigo-200">
                    <div className="text-xs font-semibold text-white mb-2">Legend</div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                        <span>High Risk</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
                        <span>Medium Risk</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <span>Low Risk</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-0.5 bg-gray-700"></div>
                        <span>Direct Ownership</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-0.5 bg-gray-700" style={{backgroundImage: 'repeating-linear-gradient(to right, currentColor 0, currentColor 3px, transparent 3px, transparent 6px)'}}></div>
                        <span>Director Link</span>
                      </div>
                    </div>
                  </div>

                  {/* Circular Ownership Alert */}
                  <div className="absolute top-4 left-4 bg-amber-100 rounded-lg shadow-lg p-3 border-2 border-amber-500 max-w-xs">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-semibold text-amber-900 mb-1">
                          Circular Ownership Detected
                        </div>
                        <p className="text-xs text-amber-800">
                          Alpha → Gamma → Beta → Alpha (indirect loop)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <Button>
                    <Eye className="w-4 h-4 mr-2" />
                    Expand Full Network
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Graph
                  </Button>
                  <Button variant="outline">
                    <Zap className="w-4 h-4 mr-2" />
                    Run Risk Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Risk Cluster Detection */}
          <TabsContent value="clusters" className="space-y-6">
            <div className="space-y-4">
              {riskClusters.map((cluster) => (
                <Card 
                  key={cluster.id}
                  className={`border-2 ${
                    cluster.totalRisk === 'high' ? 'border-red-300 bg-red-50' : 'border-amber-300 bg-amber-50'
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="font-mono text-sm font-semibold text-slate-300">
                            {cluster.id}
                          </span>
                          <Badge className={
                            cluster.totalRisk === 'high' ? 'bg-red-600' : 'bg-amber-600'
                          }>
                            {cluster.totalRisk.toUpperCase()} RISK CLUSTER
                          </Badge>
                        </div>

                        <h3 className="text-lg font-semibold text-white mb-4">
                          {cluster.name}
                        </h3>

                        <div className="mb-4">
                          <div className="text-sm font-semibold text-slate-300 mb-2">
                            Risk Factors:
                          </div>
                          <div className="space-y-2">
                            {cluster.reasons.map((reason, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-white">{reason}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-semibold text-slate-300 mb-2">
                            Cluster Members ({cluster.entities}):
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            {cluster.members.map((member, idx) => (
                              <Badge key={idx} variant="outline">
                                {member}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-6">
                        <Button size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Network
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-2 border-blue-300 bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Network className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-blue-900 mb-1">
                      AI-Powered Cluster Detection
                    </div>
                    <p className="text-sm text-blue-800">
                      Graph intelligence automatically identifies risk clusters based on shared directors, 
                      ownership patterns, address overlap, and transaction behavior. Clusters are scored 
                      and prioritized for compliance review.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Control Without Equity */}
          <TabsContent value="control" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Control Without Equity Detector</CardTitle>
                <CardDescription>
                  Identify hidden control relationships through non-ownership signals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {controlWithoutEquity.map((signal, idx) => (
                    <Card key={idx} className="border-2 border-amber-200">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <Badge className={`${
                                signal.risk === 'high' ? 'bg-red-600' :
                                signal.risk === 'medium' ? 'bg-amber-600' :
                                'bg-blue-600'
                              }`}>
                                {signal.type}
                              </Badge>
                              <Badge variant="outline" className={`${
                                signal.risk === 'high' ? 'border-red-600 text-red-700' :
                                signal.risk === 'medium' ? 'border-amber-600 text-amber-700' :
                                'border-blue-600 text-blue-700'
                              }`}>
                                {signal.risk.toUpperCase()} RISK
                              </Badge>
                            </div>

                            <div className="space-y-2 mb-3">
                              <div className="text-sm">
                                <span className="font-semibold text-slate-300">Entities:</span>
                                <div className="flex gap-2 flex-wrap mt-1">
                                  {signal.entities.map((entity, idx) => (
                                    <Badge key={idx} variant="outline">{entity}</Badge>
                                  ))}
                                </div>
                              </div>

                              {signal.address && (
                                <div className="flex items-center gap-2 text-sm">
                                  <MapPin className="w-4 h-4 text-slate-400" />
                                  <span className="text-slate-300">{signal.address}</span>
                                </div>
                              )}

                              {signal.phone && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="w-4 h-4 text-slate-400" />
                                  <span className="text-slate-300">{signal.phone}</span>
                                </div>
                              )}

                              {signal.director && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Users className="w-4 h-4 text-slate-400" />
                                  <span className="text-slate-300">Director: {signal.director}</span>
                                </div>
                              )}

                              {signal.ip && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Globe className="w-4 h-4 text-slate-400" />
                                  <span className="text-slate-300 font-mono">{signal.ip}</span>
                                </div>
                              )}

                              {signal.note && (
                                <div className="flex items-start gap-2 text-sm mt-2 p-2 bg-red-100 rounded border border-red-300">
                                  <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                                  <span className="text-red-800">{signal.note}</span>
                                </div>
                              )}
                            </div>

                            <div className="text-xs text-slate-300">
                              Flagged: {new Date(signal.flagDate).toLocaleDateString('en-AU')}
                            </div>
                          </div>

                          <Button size="sm" variant="outline" className="ml-4">
                            <Eye className="w-4 h-4 mr-2" />
                            Investigate
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-4 gap-4">
              <Card className="border-2 border-amber-300 bg-amber-50">
                <CardContent className="p-6">
                  <div className="text-sm text-amber-700">Control Signals</div>
                  <div className="text-3xl font-bold text-amber-900">4</div>
                  <div className="text-xs text-amber-600 mt-1">Detected patterns</div>
                </CardContent>
              </Card>
              <Card className="border-2 border-red-300 bg-red-50">
                <CardContent className="p-6">
                  <div className="text-sm text-red-700">High Risk</div>
                  <div className="text-3xl font-bold text-red-900">1</div>
                </CardContent>
              </Card>
              <Card className="border-2 border-amber-300 bg-amber-50">
                <CardContent className="p-6">
                  <div className="text-sm text-amber-700">Medium Risk</div>
                  <div className="text-3xl font-bold text-amber-900">2</div>
                </CardContent>
              </Card>
              <Card className="border-2 border-blue-300 bg-blue-50">
                <CardContent className="p-6">
                  <div className="text-sm text-blue-700">Low Risk</div>
                  <div className="text-3xl font-bold text-blue-900">1</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Ownership History */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ownership Version History</CardTitle>
                <CardDescription>
                  Complete timeline of ownership and director changes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {ownershipHistory.map((event, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="w-32 flex-shrink-0 text-sm text-slate-300">
                        {new Date(event.date).toLocaleDateString('en-AU', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ${
                        event.type === 'major' ? 'bg-red-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1 pb-6 border-b last:border-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{event.entity}</Badge>
                          <Badge className={event.type === 'major' ? 'bg-red-600' : 'bg-blue-600'}>
                            {event.type.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="font-semibold text-white mb-2">{event.change}</div>
                        {event.from && (
                          <div className="text-sm text-slate-300 mb-1">
                            <span className="text-slate-300">From:</span> {event.from}
                          </div>
                        )}
                        {event.to && (
                          <div className="text-sm text-slate-300 mb-1">
                            <span className="text-slate-300">To:</span> {event.to}
                          </div>
                        )}
                        <div className="text-xs text-slate-300 mt-2">
                          Evidence: {event.evidence}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import {
  ArrowLeft,
  Globe,
  Settings,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Shield,
  Plus,
  Download,
  Upload,
  Eye,
  Edit,
  GitBranch,
  Zap,
  Map,
  Clock
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { toast } from '../../lib/toast';

interface RegulatoryEngineProps {
  onBack: () => void;
}

export function RegulatoryEngine({ onBack }: RegulatoryEngineProps) {
  const [jurisdictions, setJurisdictions] = useState({
    AU: true,
    UK: false,
    EU: false,
    US: false,
    SG: true,
    HK: false,
    NZ: true
  });

  const jurisdictionData = [
    {
      code: 'AU',
      name: 'Australia',
      regulator: 'AUSTRAC',
      ruleSetVersion: '2.4',
      lastUpdated: '2024-02-15',
      policies: ['AML/CTF', 'Privacy Act', 'NCCP'],
      activeRules: 47,
      clientsAffected: 1243,
      status: 'active'
    },
    {
      code: 'UK',
      name: 'United Kingdom',
      regulator: 'FCA',
      ruleSetVersion: '1.0',
      lastUpdated: '2023-11-20',
      policies: ['AML Regulations 2017', 'GDPR'],
      activeRules: 0,
      clientsAffected: 0,
      status: 'inactive'
    },
    {
      code: 'EU',
      name: 'European Union',
      regulator: 'EBA',
      ruleSetVersion: '1.0',
      lastUpdated: '2023-10-05',
      policies: ['5AMLD', '6AMLD', 'GDPR'],
      activeRules: 0,
      clientsAffected: 0,
      status: 'inactive'
    },
    {
      code: 'US',
      name: 'United States',
      regulator: 'FinCEN',
      ruleSetVersion: '1.0',
      lastUpdated: '2023-09-12',
      policies: ['Bank Secrecy Act', 'USA PATRIOT Act'],
      activeRules: 0,
      clientsAffected: 0,
      status: 'inactive'
    },
    {
      code: 'SG',
      name: 'Singapore',
      regulator: 'MAS',
      ruleSetVersion: '1.8',
      lastUpdated: '2024-01-10',
      policies: ['CDSA', 'PDPA'],
      activeRules: 32,
      clientsAffected: 156,
      status: 'active'
    },
    {
      code: 'HK',
      name: 'Hong Kong',
      regulator: 'HKMA',
      ruleSetVersion: '1.0',
      lastUpdated: '2023-08-30',
      policies: ['AMLO', 'PDPO'],
      activeRules: 0,
      clientsAffected: 0,
      status: 'inactive'
    },
    {
      code: 'NZ',
      name: 'New Zealand',
      regulator: 'FMA',
      ruleSetVersion: '1.5',
      lastUpdated: '2024-01-25',
      policies: ['AML/CFT Act 2009'],
      activeRules: 28,
      clientsAffected: 89,
      status: 'active'
    }
  ];

  const rules = [
    {
      id: 'RULE-AU-001',
      name: 'High Risk Corporate EDD',
      jurisdiction: 'AU',
      status: 'active',
      version: '2.1',
      lastModified: '2024-02-15',
      triggeredCount: 23,
      logic: {
        conditions: [
          { field: 'Client Type', operator: '=', value: 'Company' },
          { field: 'Jurisdiction', operator: '=', value: 'AU' },
          { field: 'Risk Rating', operator: '=', value: 'High' }
        ],
        actions: [
          { type: 'Create Case', subtype: 'Enhanced Due Diligence' },
          { type: 'Set Monitoring', frequency: 'Daily' },
          { type: 'Require Approval', role: 'Compliance Officer' }
        ]
      }
    },
    {
      id: 'RULE-AU-002',
      name: 'PEP Enhanced Monitoring',
      jurisdiction: 'AU',
      status: 'active',
      version: '1.9',
      lastModified: '2024-01-20',
      triggeredCount: 8,
      logic: {
        conditions: [
          { field: 'PEP Status', operator: '=', value: 'True' },
          { field: 'Transaction Volume', operator: '>', value: '50000' }
        ],
        actions: [
          { type: 'Alert', severity: 'High' },
          { type: 'Set Monitoring', frequency: 'Real-time' },
          { type: 'Notify', recipient: 'Compliance Officer' }
        ]
      }
    },
    {
      id: 'RULE-SG-001',
      name: 'Singapore MAS CDD Trigger',
      jurisdiction: 'SG',
      status: 'active',
      version: '1.3',
      lastModified: '2024-01-10',
      triggeredCount: 12,
      logic: {
        conditions: [
          { field: 'Client Type', operator: '=', value: 'Individual' },
          { field: 'Transaction Amount', operator: '>', value: 'SGD 20000' }
        ],
        actions: [
          { type: 'Create Case', subtype: 'Customer Due Diligence' },
          { type: 'Request Documents', list: 'Standard CDD' }
        ]
      }
    }
  ];

  const fatfRecommendations = [
    {
      id: 'R1',
      recommendation: 'Assess risks and apply risk-based approach',
      internalControl: 'Risk Assessment Framework',
      status: 'compliant',
      evidence: 'Risk-Assessment-2024.pdf',
      lastReview: '2024-01-15',
      owner: 'Chief Risk Officer'
    },
    {
      id: 'R10',
      recommendation: 'Customer due diligence',
      internalControl: 'CDD/EDD Policy & Procedures',
      status: 'compliant',
      evidence: 'CDD-Policy-v2.4.pdf',
      lastReview: '2024-02-01',
      owner: 'Chief Compliance Officer'
    },
    {
      id: 'R11',
      recommendation: 'Record-keeping',
      internalControl: 'Evidence Vault & 7-year retention',
      status: 'compliant',
      evidence: 'Retention-Policy.pdf',
      lastReview: '2024-01-15',
      owner: 'Chief Compliance Officer'
    },
    {
      id: 'R13',
      recommendation: 'Correspondent banking',
      internalControl: 'Enhanced Due Diligence for Banks',
      status: 'partial',
      evidence: 'Correspondent-Banking-Procedure.pdf',
      lastReview: '2023-10-12',
      owner: 'Chief Risk Officer'
    },
    {
      id: 'R20',
      recommendation: 'Reporting of suspicious transactions',
      internalControl: 'SMR/TTR Reporting Module',
      status: 'compliant',
      evidence: 'SMR-TTR-Reporting-Log.pdf',
      lastReview: '2024-02-10',
      owner: 'Chief Compliance Officer'
    },
    {
      id: 'R26',
      recommendation: 'Regulation and supervision of financial institutions',
      internalControl: 'AFSL/ACL Compliance Framework',
      status: 'compliant',
      evidence: 'AFSL-Compliance-Register.pdf',
      lastReview: '2024-01-20',
      owner: 'Chief Compliance Officer'
    }
  ];

  const regulatoryObligations = [
    {
      category: 'AML',
      obligations: [
        { name: 'Customer Identification', control: 'Client Registry + Verification', status: 'automated' },
        { name: 'CDD/EDD', control: 'Case Management Module', status: 'automated' },
        { name: 'Ongoing Monitoring', control: 'Risk Monitoring Module', status: 'automated' },
        { name: 'Suspicious Matter Reporting', control: 'Breach Module + AUSTRAC API', status: 'automated' },
        { name: 'Record Keeping (7 years)', control: 'Evidence Vault', status: 'automated' }
      ]
    },
    {
      category: 'Credit',
      obligations: [
        { name: 'Responsible Lending', control: 'Credit Module - Serviceability Engine', status: 'automated' },
        { name: 'Unsuitability Assessment', control: 'Credit Module - Unsuitability Test', status: 'manual' },
        { name: 'Credit File Retention', control: 'Evidence Vault - 7 year retention', status: 'automated' }
      ]
    },
    {
      category: 'Privacy',
      obligations: [
        { name: 'APP 1 - Privacy Policy', control: 'Governance - Policy Library', status: 'manual' },
        { name: 'APP 11 - Data Security', control: 'Security Module + Encryption', status: 'automated' },
        { name: 'APP 12 - Data Access Requests', control: 'Privacy Module - Access Workflow', status: 'automated' },
        { name: 'Data Breach Notification', control: 'Privacy Module - Breach Workflow', status: 'automated' }
      ]
    },
    {
      category: 'Conduct',
      obligations: [
        { name: 'ASIC Reportable Situations', control: 'Breach Module - Incident Register', status: 'automated' },
        { name: 'AFSL Breach Reporting', control: 'Breach Module - Regulatory Tracker', status: 'automated' },
        { name: 'Training & Competence', control: 'Training Module - Attestations', status: 'manual' }
      ]
    },
    {
      category: 'Reporting',
      obligations: [
        { name: 'AUSTRAC TTR', control: 'Compliance Reporting Module', status: 'automated' },
        { name: 'AUSTRAC SMR', control: 'Compliance Reporting Module', status: 'manual' },
        { name: 'ASIC RG78 Breach Reports', control: 'Breach Module - Timeline', status: 'manual' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0e17]">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="h-6 w-px bg-white/30" />
              <Globe className="w-6 h-6 text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">Regulatory Engine</h1>
                <p className="text-sm text-white/90">Multi-Jurisdiction Rule Orchestration</p>
              </div>
            </div>
            <Badge className="bg-[#0d121d] text-purple-600 text-sm px-3 py-1">
              <Zap className="w-4 h-4 mr-1" />
              Global Intelligence Active
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="jurisdictions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="jurisdictions">Jurisdiction Control</TabsTrigger>
            <TabsTrigger value="rules">Rule Engine</TabsTrigger>
            <TabsTrigger value="fatf">FATF Alignment</TabsTrigger>
            <TabsTrigger value="obligations">Obligation Map</TabsTrigger>
          </TabsList>

          {/* Jurisdiction Control Panel */}
          <TabsContent value="jurisdictions" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
              <Card className="border-2 border-green-300 bg-green-50">
                <CardContent className="p-6">
                  <div className="text-sm text-green-700">Active Jurisdictions</div>
                  <div className="text-3xl font-bold text-green-900">3</div>
                  <div className="text-xs text-green-600 mt-1">AU, SG, NZ</div>
                </CardContent>
              </Card>
              <Card className="border-2 border-blue-300 bg-blue-50">
                <CardContent className="p-6">
                  <div className="text-sm text-blue-700">Active Rules</div>
                  <div className="text-3xl font-bold text-blue-900">107</div>
                  <div className="text-xs text-blue-600 mt-1">Across all jurisdictions</div>
                </CardContent>
              </Card>
              <Card className="border-2 border-purple-300 bg-purple-50">
                <CardContent className="p-6">
                  <div className="text-sm text-purple-700">Clients Managed</div>
                  <div className="text-3xl font-bold text-purple-900">1,488</div>
                  <div className="text-xs text-purple-600 mt-1">Multi-jurisdiction</div>
                </CardContent>
              </Card>
              <Card className="border-2 border-amber-300 bg-amber-50">
                <CardContent className="p-6">
                  <div className="text-sm text-amber-700">Rule Triggers (7d)</div>
                  <div className="text-3xl font-bold text-amber-900">43</div>
                  <div className="text-xs text-amber-600 mt-1">High confidence</div>
                </CardContent>
              </Card>
            </div>

            {/* Jurisdiction Cards */}
            <div className="space-y-4">
              {jurisdictionData.map((jur) => (
                <Card 
                  key={jur.code}
                  className={`border-2 ${
                    jur.status === 'active' 
                      ? 'border-green-300 bg-gradient-to-r from-green-50 to-blue-50' 
                      : 'border-gray-300 bg-[#0a0e17]'
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-6 flex-1">
                        <div className="w-24 h-24 bg-[#0d121d] rounded-lg shadow-sm flex items-center justify-center border-2 border-white/10">
                          <span className="text-3xl font-bold text-slate-300">{jur.code}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl font-bold text-white">{jur.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {jur.regulator}
                            </Badge>
                            {jur.status === 'active' ? (
                              <Badge className="bg-green-500">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Active
                              </Badge>
                            ) : (
                              <Badge className="bg-gray-400">Inactive</Badge>
                            )}
                          </div>

                          <div className="grid grid-cols-4 gap-6 mb-4">
                            <div>
                              <div className="text-sm text-slate-300">Rule Set Version</div>
                              <div className="font-semibold text-white">v{jur.ruleSetVersion}</div>
                            </div>
                            <div>
                              <div className="text-sm text-slate-300">Last Updated</div>
                              <div className="font-semibold text-white">
                                {new Date(jur.lastUpdated).toLocaleDateString('en-AU')}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-slate-300">Active Rules</div>
                              <div className="font-semibold text-white">{jur.activeRules}</div>
                            </div>
                            <div>
                              <div className="text-sm text-slate-300">Clients Affected</div>
                              <div className="font-semibold text-white">
                                {jur.clientsAffected.toLocaleString()}
                              </div>
                            </div>
                          </div>

                          <div className="mb-3">
                            <div className="text-sm text-slate-300 mb-2">Linked Policies:</div>
                            <div className="flex gap-2 flex-wrap">
                              {jur.policies.map((policy, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {policy}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Label className="text-sm font-medium">Enable for Tenant:</Label>
                            <Switch 
                              checked={jur.status === 'active'}
                              onCheckedChange={() => toast.success(`${jur.code} jurisdiction ${jur.status === 'active' ? 'disabled' : 'enabled'}`)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-6">
                        <Button size="sm" variant="outline">
                          <Settings className="w-4 h-4 mr-2" />
                          Configure
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          View Rules
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
          </TabsContent>

          {/* Rule Engine Builder */}
          <TabsContent value="rules" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Active Rules</h3>
                <p className="text-sm text-slate-300">Drag-and-drop logic builder with version control</p>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create New Rule
              </Button>
            </div>

            <div className="space-y-4">
              {rules.map((rule) => (
                <Card key={rule.id} className="border-2 border-purple-200 hover:border-purple-400 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="font-mono text-sm font-semibold text-slate-300">
                            {rule.id}
                          </span>
                          <Badge className="bg-purple-600">{rule.jurisdiction}</Badge>
                          <Badge className="bg-green-500">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                          <Badge variant="outline">v{rule.version}</Badge>
                        </div>

                        <h3 className="text-lg font-semibold text-white mb-4">{rule.name}</h3>

                        {/* Visual Rule Logic */}
                        <div className="space-y-4">
                          {/* Conditions */}
                          <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                            <div className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                              <GitBranch className="w-4 h-4" />
                              IF (Conditions)
                            </div>
                            <div className="space-y-2">
                              {rule.logic.conditions.map((condition, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm">
                                  <Badge variant="outline" className="bg-[#0d121d]">
                                    {condition.field}
                                  </Badge>
                                  <span className="text-slate-300 font-mono">{condition.operator}</span>
                                  <Badge className="bg-blue-600">{condition.value}</Badge>
                                  {idx < rule.logic.conditions.length - 1 && (
                                    <span className="text-blue-900 font-semibold">AND</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                            <div className="text-sm font-semibold text-green-900 mb-3 flex items-center gap-2">
                              <Zap className="w-4 h-4" />
                              THEN (Actions)
                            </div>
                            <div className="space-y-2">
                              {rule.logic.actions.map((action, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm">
                                  <Badge className="bg-green-600">{action.type}</Badge>
                                  {(action as any).subtype && (
                                    <span className="text-slate-300">→ {(action as any).subtype}</span>
                                  )}
                                  {(action as any).frequency && (
                                    <span className="text-slate-300">→ {(action as any).frequency}</span>
                                  )}
                                  {(action as any).role && (
                                    <span className="text-slate-300">→ {(action as any).role}</span>
                                  )}
                                  {(action as any).severity && (
                                    <Badge className="bg-red-500">{(action as any).severity}</Badge>
                                  )}
                                  {(action as any).recipient && (
                                    <span className="text-slate-300">→ {(action as any).recipient}</span>
                                  )}
                                  {(action as any).list && (
                                    <span className="text-slate-300">→ {(action as any).list}</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2 text-slate-300">
                            <Clock className="w-4 h-4" />
                            Last modified: {new Date(rule.lastModified).toLocaleDateString('en-AU')}
                          </div>
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            Triggered {rule.triggeredCount} times (30d)
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-6">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Rule
                        </Button>
                        <Button size="sm" variant="outline">
                          <GitBranch className="w-4 h-4 mr-2" />
                          Version History
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          Test Rule
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-2 border-amber-300 bg-amber-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-amber-900 mb-1">
                      Rule Conflict Detection Active
                    </div>
                    <p className="text-sm text-amber-800">
                      The system automatically detects conflicting rules across jurisdictions and 
                      prevents publishing. Review version history before deployment.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FATF Alignment Matrix */}
          <TabsContent value="fatf" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  FATF 40 Recommendations - Alignment Matrix
                </CardTitle>
                <CardDescription>
                  Track compliance with Financial Action Task Force standards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#0a0e17] border-b-2">
                      <tr>
                        <th className="text-left p-4 text-sm font-semibold text-white">Rec #</th>
                        <th className="text-left p-4 text-sm font-semibold text-white">FATF Recommendation</th>
                        <th className="text-left p-4 text-sm font-semibold text-white">Internal Control</th>
                        <th className="text-left p-4 text-sm font-semibold text-white">Status</th>
                        <th className="text-left p-4 text-sm font-semibold text-white">Evidence</th>
                        <th className="text-left p-4 text-sm font-semibold text-white">Owner</th>
                        <th className="text-left p-4 text-sm font-semibold text-white">Last Review</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {fatfRecommendations.map((item) => (
                        <tr key={item.id} className="hover:bg-white/5">
                          <td className="p-4">
                            <Badge variant="outline">{item.id}</Badge>
                          </td>
                          <td className="p-4 text-sm text-white max-w-md">
                            {item.recommendation}
                          </td>
                          <td className="p-4 text-sm font-medium text-white">
                            {item.internalControl}
                          </td>
                          <td className="p-4">
                            {item.status === 'compliant' ? (
                              <Badge className="bg-green-500">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Compliant
                              </Badge>
                            ) : (
                              <Badge className="bg-amber-500">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Partial
                              </Badge>
                            )}
                          </td>
                          <td className="p-4">
                            <Button size="sm" variant="ghost">
                              <Eye className="w-4 h-4 mr-2" />
                              {item.evidence}
                            </Button>
                          </td>
                          <td className="p-4 text-sm text-slate-300">{item.owner}</td>
                          <td className="p-4 text-sm text-slate-300">
                            {new Date(item.lastReview).toLocaleDateString('en-AU')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-3 gap-4">
              <Card className="border-2 border-green-300 bg-green-50">
                <CardContent className="p-6">
                  <div className="text-sm text-green-700">Compliant</div>
                  <div className="text-3xl font-bold text-green-900">5</div>
                  <Progress value={83} className="h-2 mt-2" />
                </CardContent>
              </Card>
              <Card className="border-2 border-amber-300 bg-amber-50">
                <CardContent className="p-6">
                  <div className="text-sm text-amber-700">Partial Compliance</div>
                  <div className="text-3xl font-bold text-amber-900">1</div>
                  <Progress value={17} className="h-2 mt-2" />
                </CardContent>
              </Card>
              <Card className="border-2 border-blue-300 bg-blue-50">
                <CardContent className="p-6">
                  <div className="text-sm text-blue-700">Total Recommendations</div>
                  <div className="text-3xl font-bold text-blue-900">40</div>
                  <div className="text-xs text-blue-600 mt-1">6 shown (core requirements)</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Regulatory Obligation Map */}
          <TabsContent value="obligations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="w-5 h-5" />
                  Regulatory Obligation Map
                </CardTitle>
                <CardDescription>
                  Visual mapping of regulatory obligations to system controls
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {regulatoryObligations.map((category) => (
                    <div key={category.category}>
                      <div className="flex items-center gap-3 mb-4">
                        <Badge className={`text-base py-1 px-3 ${
                          category.category === 'AML' ? 'bg-blue-600' :
                          category.category === 'Credit' ? 'bg-green-600' :
                          category.category === 'Privacy' ? 'bg-purple-600' :
                          category.category === 'Conduct' ? 'bg-amber-600' :
                          'bg-red-600'
                        }`}>
                          {category.category}
                        </Badge>
                        <div className="text-sm text-slate-300">
                          {category.obligations.length} obligations mapped
                        </div>
                      </div>

                      <div className="grid gap-3">
                        {category.obligations.map((obligation, idx) => (
                          <Card key={idx} className="border-2">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="font-semibold text-white mb-1">
                                    {obligation.name}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-300">→</span>
                                    <span className="text-sm text-blue-600 font-medium">
                                      {obligation.control}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {obligation.status === 'automated' ? (
                                    <Badge className="bg-green-500">
                                      <Zap className="w-3 h-3 mr-1" />
                                      Automated
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-amber-500">Manual</Badge>
                                  )}
                                  <Button size="sm" variant="ghost">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            <div className="grid grid-cols-4 gap-4">
              <Card className="border-2 border-blue-300 bg-blue-50">
                <CardContent className="p-6">
                  <div className="text-sm text-blue-700">Total Obligations</div>
                  <div className="text-3xl font-bold text-blue-900">18</div>
                </CardContent>
              </Card>
              <Card className="border-2 border-green-300 bg-green-50">
                <CardContent className="p-6">
                  <div className="text-sm text-green-700">Automated</div>
                  <div className="text-3xl font-bold text-green-900">14</div>
                  <div className="text-xs text-green-600 mt-1">78% automation rate</div>
                </CardContent>
              </Card>
              <Card className="border-2 border-amber-300 bg-amber-50">
                <CardContent className="p-6">
                  <div className="text-sm text-amber-700">Manual</div>
                  <div className="text-3xl font-bold text-amber-900">4</div>
                  <div className="text-xs text-amber-600 mt-1">Requires human review</div>
                </CardContent>
              </Card>
              <Card className="border-2 border-purple-300 bg-purple-50">
                <CardContent className="p-6">
                  <div className="text-sm text-purple-700">System Controls</div>
                  <div className="text-3xl font-bold text-purple-900">12</div>
                  <div className="text-xs text-purple-600 mt-1">Modules integrated</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

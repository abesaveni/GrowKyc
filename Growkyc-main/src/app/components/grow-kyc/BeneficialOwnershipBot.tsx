import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Network,
  CheckCircle,
  Clock,
  Search,
  ArrowRight,
  ArrowLeft,
  Download,
  AlertTriangle,
  XCircle,
  ChevronRight,
  Users,
  Building2,
  Eye,
  Sparkles,
  Upload
} from 'lucide-react';

type ViewMode = 'dashboard' | 'new-mapping' | 'graph-view';

interface BeneficialOwnershipBotProps {
  onBack?: () => void;
}

export function BeneficialOwnershipBot({ onBack }: BeneficialOwnershipBotProps) {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');

  if (currentView === 'dashboard') {
    return <OwnershipControlCentre onNavigate={setCurrentView} onBack={onBack} />;
  }

  if (currentView === 'new-mapping') {
    return <OwnershipMappingWizard onBack={() => setCurrentView('dashboard')} />;
  }

  return <OwnershipControlCentre onNavigate={setCurrentView} onBack={onBack} />;
}

// Screen 1: Ownership Control Centre
function OwnershipControlCentre({ onNavigate, onBack }: { onNavigate: (view: ViewMode) => void; onBack?: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          {onBack && (
            <Button onClick={onBack} variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Grow Compliance OS
            </Button>
          )}
          
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Network className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Beneficial Ownership Mapping Bot</h1>
                  <p className="text-gray-600">UBO identification • Ownership chains • AUSTRAC Tranche 2 ready</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button onClick={() => onNavigate('new-mapping')} className="bg-[#13B5EA] hover:bg-[#0E7C9E]">
                <Network className="w-4 h-4 mr-2" />
                Map Ownership
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="border-2 hover:border-blue-400 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <Badge className="bg-blue-100 text-blue-700">28</Badge>
              </div>
              <p className="text-sm font-medium text-gray-900">Pending Mapping</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-amber-400 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <Badge className="bg-amber-100 text-amber-700">11</Badge>
              </div>
              <p className="text-sm font-medium text-gray-900">Incomplete Structures</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-red-400 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <Badge className="bg-red-100 text-red-700">4</Badge>
              </div>
              <p className="text-sm font-medium text-gray-900">Missing UBOs</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-orange-400 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <Badge className="bg-orange-100 text-orange-700">6</Badge>
              </div>
              <p className="text-sm font-medium text-gray-900">High-Risk Structures</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-purple-400 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Eye className="w-5 h-5 text-purple-600" />
                <Badge className="bg-purple-100 text-purple-700">9</Badge>
              </div>
              <p className="text-sm font-medium text-gray-900">Escalations</p>
            </CardContent>
          </Card>
        </div>

        {/* Queue Tables */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Entity Queue */}
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-600" />
                Entity Mapping Queue
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Entity</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Type</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">UBO Status</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Risk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[
                      { entity: 'Pacific Holdings Trust', type: 'Trust', ubo: 'Identified', risk: 'Low' },
                      { entity: 'Global Investments Pty Ltd', type: 'Company', ubo: 'Pending', risk: 'Medium' },
                      { entity: 'Eastern Trading Group', type: 'Company', ubo: 'Missing', risk: 'High' },
                      { entity: 'Metro Property Fund', type: 'Trust', ubo: 'Incomplete', risk: 'Medium' },
                    ].map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 cursor-pointer">
                        <td className="px-4 py-3 font-medium text-gray-900">{item.entity}</td>
                        <td className="px-4 py-3 text-xs text-gray-600">{item.type}</td>
                        <td className="px-4 py-3">
                          <Badge className={
                            item.ubo === 'Identified' ? 'bg-green-100 text-green-700' :
                            item.ubo === 'Pending' ? 'bg-blue-100 text-blue-700' :
                            item.ubo === 'Incomplete' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }>
                            {item.ubo}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={
                            item.risk === 'Low' ? 'bg-gray-100 text-gray-700' :
                            item.risk === 'Medium' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }>
                            {item.risk}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t bg-gray-50">
                <Button variant="ghost" className="w-full text-purple-700 hover:bg-purple-50" onClick={() => onNavigate('new-mapping')}>
                  View All Entities <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Issues Table */}
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 border-b">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Ownership Issues
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Entity</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Issue Type</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Severity</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[
                      { entity: 'Eastern Trading Group', issue: 'Missing UBO', severity: 'Critical' },
                      { entity: 'Metro Property Fund', issue: 'Ownership gap (15%)', severity: 'High' },
                      { entity: 'Pacific Holdings Trust', issue: 'Circular ownership detected', severity: 'High' },
                      { entity: 'Global Investments', issue: 'Unknown controller', severity: 'Medium' },
                    ].map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 cursor-pointer">
                        <td className="px-4 py-3 font-medium text-gray-900">{item.entity}</td>
                        <td className="px-4 py-3 text-xs text-gray-700">{item.issue}</td>
                        <td className="px-4 py-3">
                          <Badge className={
                            item.severity === 'Critical' ? 'bg-red-600 text-white' :
                            item.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                            'bg-amber-100 text-amber-700'
                          }>
                            {item.severity}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Button size="sm" variant="outline" className="text-xs">
                            Review
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t bg-gray-50">
                <Button variant="ghost" className="w-full text-red-700 hover:bg-red-50">
                  View All Issues <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tranche 2 Compliance Notice */}
        <Card className="border border-gray-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Network className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">AUSTRAC Tranche 2 Ready</h3>
                <p className="text-purple-800 mb-4">
                  Beneficial ownership mapping meets AUSTRAC requirements for identifying and verifying ultimate beneficial owners (UBOs) at or above 25% ownership threshold. System automatically detects control without ownership and flags incomplete structures.
                </p>
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded border border-purple-300">
                    <p className="text-xs text-purple-700">Default UBO Threshold</p>
                    <p className="font-bold text-purple-900">25%</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-purple-300">
                    <p className="text-xs text-purple-700">Control Detection</p>
                    <p className="font-bold text-purple-900">AI-Powered</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-purple-300">
                    <p className="text-xs text-purple-700">Missing UBOs</p>
                    <p className="font-bold text-red-900">AUTO FAIL</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Screen 2: Ownership Mapping Wizard
function OwnershipMappingWizard({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    entityName: '',
    entityType: 'company',
    country: 'Australia',
    directors: '',
    shareholders: ''
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-8 py-6">
          <Button onClick={onBack} variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Network className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Ownership Mapping Wizard</h1>
              <p className="text-gray-600">AI-powered beneficial ownership identification</p>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-6 flex items-center justify-between max-w-2xl">
            {[
              { num: 1, label: 'Input' },
              { num: 2, label: 'Data Sources' },
              { num: 3, label: 'AI Structure' },
              { num: 4, label: 'Graph View' },
              { num: 5, label: 'Gap Detection' },
              { num: 6, label: 'Decision' }
            ].map((s) => (
              <div key={s.num} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= s.num ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {s.num}
                </div>
                <div className="ml-2">
                  <p className={`text-xs font-medium ${step >= s.num ? 'text-purple-600' : 'text-gray-500'}`}>
                    {s.label}
                  </p>
                </div>
                {s.num < 6 && <div className={`mx-2 w-8 h-0.5 ${step > s.num ? 'bg-purple-600' : 'bg-gray-300'}`}></div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8">
        {/* Step 1: Input */}
        {step === 1 && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Step 1: Entity Information</CardTitle>
              <CardDescription>Enter the entity details to map ownership</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label>Entity Name *</Label>
                  <Input 
                    value={formData.entityName}
                    onChange={(e) => setFormData({ ...formData, entityName: e.target.value })}
                    placeholder="e.g. Pacific Holdings Trust"
                  />
                </div>
                <div>
                  <Label>Entity Type *</Label>
                  <select
                    value={formData.entityType}
                    onChange={(e) => setFormData({ ...formData, entityType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="company">Company (Pty Ltd)</option>
                    <option value="trust">Trust</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other Structure</option>
                  </select>
                </div>
                <div>
                  <Label>Country *</Label>
                  <Input 
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="e.g. Australia"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Known Directors / Trustees</Label>
                  <Input 
                    value={formData.directors}
                    onChange={(e) => setFormData({ ...formData, directors: e.target.value })}
                    placeholder="e.g. John Smith, Sarah Johnson"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Known Shareholders / Beneficiaries</Label>
                  <Input 
                    value={formData.shareholders}
                    onChange={(e) => setFormData({ ...formData, shareholders: e.target.value })}
                    placeholder="e.g. ABC Trust 40%, John Smith 30%, Other 30%"
                  />
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 cursor-pointer transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="font-medium text-gray-900 mb-1">Upload Ownership Documents</p>
                <p className="text-sm text-gray-600 mb-3">Trust deeds, shareholder registers, company extracts</p>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Files
                </Button>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-2">AUSTRAC Tranche 2 Requirements</h4>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Identify all beneficial owners at or above 25% ownership</li>
                  <li>• Detect control without ownership (voting rights, appointments)</li>
                  <li>• Map complete ownership chains to ultimate beneficial owners</li>
                  <li>• Document gaps and inconsistencies for compliance review</li>
                </ul>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button variant="outline" onClick={onBack}>Cancel</Button>
                <Button 
                  onClick={() => setStep(2)}
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={!formData.entityName}
                >
                  Next: Data Sources <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Graph View */}
        {step === 4 && (
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Step 4: Interactive Ownership Graph
              </CardTitle>
              <CardDescription>Visual map of ownership structure and control</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-6 border-2 border-gray-300">
                <div className="text-center">
                  <Network className="w-24 h-24 text-purple-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Interactive Ownership Graph</p>
                  <p className="text-sm text-gray-500">Nodes represent people/entities • Edges show ownership %</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-green-600" />
                      <p className="font-semibold text-green-900">UBOs Identified</p>
                    </div>
                    <p className="text-3xl font-bold text-green-600">3</p>
                    <p className="text-xs text-green-700 mt-1">Above 25% threshold</p>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Network className="w-5 h-5 text-blue-600" />
                      <p className="font-semibold text-blue-900">Total Layers</p>
                    </div>
                    <p className="text-3xl font-bold text-blue-600">2</p>
                    <p className="text-xs text-blue-700 mt-1">Ownership levels</p>
                  </CardContent>
                </Card>

                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-purple-600" />
                      <p className="font-semibold text-purple-900">Coverage</p>
                    </div>
                    <p className="text-3xl font-bold text-purple-600">100%</p>
                    <p className="text-xs text-purple-700 mt-1">All ownership mapped</p>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-between gap-3 pt-6 border-t">
                <Button variant="outline" onClick={() => setStep(3)}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button onClick={() => setStep(5)} className="bg-purple-600 hover:bg-purple-700">
                  Next: Gap Detection <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Gap Detection */}
        {step === 5 && (
          <Card className="border-2 border-green-400">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Ownership Structure Complete</h2>
              <p className="text-gray-600 mb-8">All beneficial owners identified • No gaps detected</p>

              <div className="max-w-2xl mx-auto space-y-4 mb-8">
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">UBOs Identified</p>
                    <p className="font-semibold text-green-600">3 persons</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">Total Coverage</p>
                    <p className="font-semibold text-gray-900">100%</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">Structure Risk</p>
                    <p className="font-semibold text-green-600">Low</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">Mapping Status</p>
                    <p className="font-semibold text-green-600">COMPLETE</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <Button onClick={onBack} className="bg-purple-600 hover:bg-purple-700">
                  Return to Dashboard
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Structure
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

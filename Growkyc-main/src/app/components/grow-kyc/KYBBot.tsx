import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Building2,
  CheckCircle,
  Clock,
  Search,
  ArrowRight,
  ArrowLeft,
  Download,
  AlertTriangle,
  XCircle,
  ChevronRight,
  FileText,
  Users,
  Shield,
  RefreshCw
} from 'lucide-react';

type ViewMode = 'dashboard' | 'new-verification' | 'entity-profile';

interface KYBBotProps {
  onBack?: () => void;
}

export function KYBBot({ onBack }: KYBBotProps) {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');

  if (currentView === 'dashboard') {
    return <KYBControlCentre onNavigate={setCurrentView} onBack={onBack} />;
  }

  if (currentView === 'new-verification') {
    return <EntityVerificationWizard onBack={() => setCurrentView('dashboard')} />;
  }

  return <KYBControlCentre onNavigate={setCurrentView} onBack={onBack} />;
}

// Screen 1: KYB Control Centre
function KYBControlCentre({ onNavigate, onBack }: { onNavigate: (view: ViewMode) => void; onBack?: () => void }) {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="bg-[#1e293b] border-b border-white/10">
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
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">KYB Entity Verification Bot</h1>
                  <p className="text-slate-300">ABN/ACN validation • Registry lookup • Director verification</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button onClick={() => onNavigate('new-verification')} className="bg-[#13B5EA] hover:bg-[#0E7C9E]">
                <Search className="w-4 h-4 mr-2" />
                Verify Entity
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Results
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-2 hover:border-blue-400 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <Badge className="bg-blue-500/15 text-blue-300">34</Badge>
              </div>
              <p className="text-sm font-medium text-white">Pending Entities</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-green-400 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <Badge className="bg-green-500/15 text-green-300">142</Badge>
              </div>
              <p className="text-sm font-medium text-white">Verified</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-amber-400 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <Badge className="bg-amber-500/15 text-amber-300">7</Badge>
              </div>
              <p className="text-sm font-medium text-white">Mismatches</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-red-400 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <XCircle className="w-5 h-5 text-red-400" />
                <Badge className="bg-red-500/15 text-red-300">3</Badge>
              </div>
              <p className="text-sm font-medium text-white">Failed Checks</p>
            </CardContent>
          </Card>
        </div>

        {/* Queue Tables */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Entity Queue */}
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-400" />
                Entity Verification Queue
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#0f172a] border-b">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-slate-300">Entity Name</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-300">ABN</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-300">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[
                      { name: 'Acme Industries Pty Ltd', abn: '12 345 678 901', status: 'Verified' },
                      { name: 'TechStart Solutions', abn: '23 456 789 012', status: 'Checking' },
                      { name: 'Global Trading Co', abn: '34 567 890 123', status: 'Mismatch' },
                      { name: 'Premier Services Ltd', abn: '45 678 901 234', status: 'Verified' },
                    ].map((item, idx) => (
                      <tr key={idx} className="hover:bg-white/5 cursor-pointer">
                        <td className="px-4 py-3 font-medium text-white">{item.name}</td>
                        <td className="px-4 py-3 text-xs text-slate-300">{item.abn}</td>
                        <td className="px-4 py-3">
                          <Badge className={
                            item.status === 'Verified' ? 'bg-green-500/15 text-green-300' :
                            item.status === 'Checking' ? 'bg-blue-500/15 text-blue-300' :
                            'bg-amber-500/15 text-amber-300'
                          }>
                            {item.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t bg-[#0f172a]">
                <Button variant="ghost" className="w-full text-blue-300 hover:bg-blue-500/10" onClick={() => onNavigate('new-verification')}>
                  View All Entities <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Flagged Inconsistencies */}
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 border-b">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                Flagged Inconsistencies
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#0f172a] border-b">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-slate-300">Entity Name</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-300">Issue</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-300">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[
                      { name: 'Global Trading Co', issue: 'Name mismatch' },
                      { name: 'Eastern Holdings', issue: 'ABN mismatch' },
                      { name: 'Pacific Trust Ltd', issue: 'Inactive status' },
                      { name: 'Metro Services', issue: 'Director discrepancy' },
                    ].map((item, idx) => (
                      <tr key={idx} className="hover:bg-white/5 cursor-pointer">
                        <td className="px-4 py-3 font-medium text-white">{item.name}</td>
                        <td className="px-4 py-3 text-xs text-amber-300">{item.issue}</td>
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
              <div className="p-4 border-t bg-[#0f172a]">
                <Button variant="ghost" className="w-full text-amber-300 hover:bg-amber-500/10">
                  View All Issues <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Registry Connection Status */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              Registry Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <Badge className="bg-green-500/15 text-green-300 text-xs">Active</Badge>
                </div>
                <p className="font-semibold text-white mb-1">ABR Lookup</p>
                <p className="text-xs text-slate-300">Last sync: 5 mins ago</p>
              </div>

              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <Badge className="bg-green-500/15 text-green-300 text-xs">Active</Badge>
                </div>
                <p className="font-semibold text-white mb-1">ASIC Registry</p>
                <p className="text-xs text-slate-300">Last sync: 2 mins ago</p>
              </div>

              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <Badge className="bg-green-500/15 text-green-300 text-xs">Active</Badge>
                </div>
                <p className="font-semibold text-white mb-1">GST Status</p>
                <p className="text-xs text-slate-300">Real-time validation</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Screen 2: Entity Verification Wizard
function EntityVerificationWizard({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    entityName: '',
    abn: '',
    acn: '',
    country: 'Australia'
  });

  const [registryData, setRegistryData] = useState<any>(null);

  const lookupEntity = () => {
    // Simulate registry lookup
    setTimeout(() => {
      setRegistryData({
        name: 'ACME INDUSTRIES PTY LTD',
        abn: '12 345 678 901',
        acn: '123 456 789',
        status: 'Active',
        gstStatus: 'Registered',
        directors: ['John Smith', 'Sarah Johnson']
      });
      setStep(3);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="bg-[#1e293b] border-b border-white/10">
        <div className="max-w-5xl mx-auto px-8 py-6">
          <Button onClick={onBack} variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Entity Verification Wizard</h1>
              <p className="text-slate-300">Verify business details against official registries</p>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-6 flex items-center justify-between max-w-xl">
            {[
              { num: 1, label: 'Input' },
              { num: 2, label: 'Registry Lookup' },
              { num: 3, label: 'Comparison' },
              { num: 4, label: 'Results' },
              { num: 5, label: 'Decision' }
            ].map((s) => (
              <div key={s.num} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= s.num ? 'bg-green-600 text-white' : 'bg-white/10 text-slate-300'
                }`}>
                  {s.num}
                </div>
                <div className="ml-2">
                  <p className={`text-xs font-medium ${step >= s.num ? 'text-green-400' : 'text-slate-400'}`}>
                    {s.label}
                  </p>
                </div>
                {s.num < 5 && <div className={`mx-2 w-8 h-0.5 ${step > s.num ? 'bg-green-600' : 'bg-gray-300'}`}></div>}
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
              <CardDescription>Enter the business details to verify</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label>Entity Legal Name *</Label>
                  <Input 
                    value={formData.entityName}
                    onChange={(e) => setFormData({ ...formData, entityName: e.target.value })}
                    placeholder="e.g. Acme Industries Pty Ltd"
                  />
                </div>
                <div>
                  <Label>ABN (Australian Business Number) *</Label>
                  <Input 
                    value={formData.abn}
                    onChange={(e) => setFormData({ ...formData, abn: e.target.value })}
                    placeholder="e.g. 12 345 678 901"
                    maxLength={14}
                  />
                </div>
                <div>
                  <Label>ACN (Australian Company Number)</Label>
                  <Input 
                    value={formData.acn}
                    onChange={(e) => setFormData({ ...formData, acn: e.target.value })}
                    placeholder="e.g. 123 456 789"
                    maxLength={11}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Country *</Label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3 py-2 border border-white/10 rounded-md"
                  >
                    <option value="Australia">Australia</option>
                    <option value="New Zealand">New Zealand</option>
                    <option value="UK">United Kingdom</option>
                    <option value="USA">United States</option>
                  </select>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-blue-300 mb-2">What We'll Verify</h4>
                <ul className="text-sm text-blue-300 space-y-1">
                  <li>• Entity exists in official registry</li>
                  <li>• Entity is currently active</li>
                  <li>• Name matches official records</li>
                  <li>• ABN/ACN validation</li>
                  <li>• GST registration status</li>
                  <li>• Director information</li>
                </ul>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button variant="outline" onClick={onBack}>Cancel</Button>
                <Button 
                  onClick={() => setStep(2)}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={!formData.entityName || !formData.abn}
                >
                  Next: Registry Lookup <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Registry Lookup */}
        {step === 2 && (
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
              <CardTitle>Step 2: Registry Lookup</CardTitle>
              <CardDescription>Fetching official registry data</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-green-500/15 rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <Search className="w-10 h-10 text-green-400" />
                </div>

                <div>
                  <p className="text-lg font-semibold text-white mb-2">Searching Official Registries</p>
                  <p className="text-sm text-slate-300">
                    {formData.entityName} • ABN: {formData.abn}
                  </p>
                </div>

                <div className="space-y-3 max-w-md mx-auto">
                  <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-slate-300">Querying ABR (Australian Business Register)</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-slate-300">Checking ASIC Registry</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-slate-300">Validating GST status</span>
                  </div>
                </div>

                <Button onClick={lookupEntity} className="bg-green-600 hover:bg-green-700">
                  Complete Lookup
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Comparison */}
        {step === 3 && registryData && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Step 3: Results Comparison</CardTitle>
              <CardDescription>Compare provided vs registry data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#0f172a] border-b">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-slate-300">Field</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-300">Provided</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-300">Registry</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-300">Match</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="px-4 py-3 font-medium text-white">Entity Name</td>
                      <td className="px-4 py-3 text-slate-300">{formData.entityName}</td>
                      <td className="px-4 py-3 text-slate-300">{registryData.name}</td>
                      <td className="px-4 py-3">
                        <Badge className="bg-green-500/15 text-green-300">
                          <CheckCircle className="w-3 h-3 mr-1" /> Match
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-white">ABN</td>
                      <td className="px-4 py-3 text-slate-300">{formData.abn}</td>
                      <td className="px-4 py-3 text-slate-300">{registryData.abn}</td>
                      <td className="px-4 py-3">
                        <Badge className="bg-green-500/15 text-green-300">
                          <CheckCircle className="w-3 h-3 mr-1" /> Match
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-white">ACN</td>
                      <td className="px-4 py-3 text-slate-300">{formData.acn}</td>
                      <td className="px-4 py-3 text-slate-300">{registryData.acn}</td>
                      <td className="px-4 py-3">
                        <Badge className="bg-green-500/15 text-green-300">
                          <CheckCircle className="w-3 h-3 mr-1" /> Match
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-white">Status</td>
                      <td className="px-4 py-3 text-slate-300">-</td>
                      <td className="px-4 py-3 text-slate-300">{registryData.status}</td>
                      <td className="px-4 py-3">
                        <Badge className="bg-green-500/15 text-green-300">
                          <CheckCircle className="w-3 h-3 mr-1" /> Active
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-white">GST Status</td>
                      <td className="px-4 py-3 text-slate-300">-</td>
                      <td className="px-4 py-3 text-slate-300">{registryData.gstStatus}</td>
                      <td className="px-4 py-3">
                        <Badge className="bg-green-500/15 text-green-300">
                          <CheckCircle className="w-3 h-3 mr-1" /> Verified
                        </Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-blue-300 mb-2">Directors (from Registry)</h4>
                <div className="flex flex-wrap gap-2">
                  {registryData.directors.map((director: string, idx: number) => (
                    <Badge key={idx} className="bg-blue-500/15 text-blue-300">{director}</Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-between gap-3 pt-6 border-t">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Start New Verification
                </Button>
                <Button onClick={() => setStep(4)} className="bg-green-600 hover:bg-green-700">
                  View Results Summary <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Results */}
        {step === 4 && (
          <Card className="border-2 border-green-400">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-2">Entity Verified</h2>
              <p className="text-slate-300 mb-8">{registryData?.name}</p>

              <div className="max-w-2xl mx-auto space-y-4 mb-8">
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <div className="p-4 bg-[#0f172a] rounded-lg">
                    <p className="text-xs text-slate-300">Verification Status</p>
                    <p className="font-semibold text-green-400">VERIFIED</p>
                  </div>
                  <div className="p-4 bg-[#0f172a] rounded-lg">
                    <p className="text-xs text-slate-300">Entity Status</p>
                    <p className="font-semibold text-white">Active</p>
                  </div>
                  <div className="p-4 bg-[#0f172a] rounded-lg">
                    <p className="text-xs text-slate-300">ABN</p>
                    <p className="font-semibold text-white">{registryData?.abn}</p>
                  </div>
                  <div className="p-4 bg-[#0f172a] rounded-lg">
                    <p className="text-xs text-slate-300">ACN</p>
                    <p className="font-semibold text-white">{registryData?.acn}</p>
                  </div>
                  <div className="p-4 bg-[#0f172a] rounded-lg">
                    <p className="text-xs text-slate-300">GST Status</p>
                    <p className="font-semibold text-green-400">Registered</p>
                  </div>
                  <div className="p-4 bg-[#0f172a] rounded-lg">
                    <p className="text-xs text-slate-300">Directors</p>
                    <p className="font-semibold text-white">{registryData?.directors.length}</p>
                  </div>
                </div>

                <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg text-left">
                  <div className="flex items-start gap-2">
                    <RefreshCw className="w-5 h-5 text-purple-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-purple-300">Continuous Monitoring Active</p>
                      <p className="text-sm text-purple-300 mt-1">
                        Entity status will be monitored for changes in registration, directors, or deregistration risk.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <Button onClick={onBack} className="bg-green-600 hover:bg-green-700">
                  Return to Dashboard
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Verification
                </Button>
                <Button variant="outline" onClick={() => setStep(1)}>
                  Verify Another Entity
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

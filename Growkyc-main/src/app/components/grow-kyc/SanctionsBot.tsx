import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Ban,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Bell,
  Download,
  Sparkles,
  XCircle,
  ChevronRight,
  Globe,
  AlertOctagon,
  Eye,
  FileText,
  Lock
} from 'lucide-react';

type ViewMode = 'dashboard' | 'new-screening' | 'review-workbench' | 'subject-profile' | 'monitoring';

interface SanctionsBotProps {
  onBack?: () => void;
}

export function SanctionsBot({ onBack }: SanctionsBotProps) {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');

  if (currentView === 'dashboard') {
    return <SanctionsControlCentre onNavigate={setCurrentView} onBack={onBack} />;
  }

  if (currentView === 'new-screening') {
    return <SanctionsScreeningWizard onBack={() => setCurrentView('dashboard')} />;
  }

  return <SanctionsControlCentre onNavigate={setCurrentView} onBack={onBack} />;
}

// Screen 1: Sanctions Control Centre
function SanctionsControlCentre({ onNavigate, onBack }: { onNavigate: (view: ViewMode) => void; onBack?: () => void }) {
  return (
    <div className="min-h-screen bg-[#0a0e17]">
      <div className="bg-[#0d121d] border-b border-white/10">
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
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center">
                  <Ban className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Global Sanctions Screening Bot</h1>
                  <p className="text-slate-300">Real-time sanctions list monitoring - Non-negotiable compliance gate</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button onClick={() => onNavigate('new-screening')} className="bg-red-600 hover:bg-red-700">
                <Search className="w-4 h-4 mr-2" />
                Run New Screening
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
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <Card className="border-2 hover:border-blue-400 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <Badge className="bg-blue-100 text-blue-700">47</Badge>
              </div>
              <p className="text-sm font-medium text-white">Pending Screenings</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-amber-400 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Eye className="w-5 h-5 text-amber-600" />
                <Badge className="bg-amber-100 text-amber-700">12</Badge>
              </div>
              <p className="text-sm font-medium text-white">Possible Matches</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-400 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Ban className="w-5 h-5 text-red-600" />
                <Badge className="bg-red-600 text-white">2</Badge>
              </div>
              <p className="text-sm font-medium text-red-900">CONFIRMED HITS</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-orange-400 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <AlertOctagon className="w-5 h-5 text-orange-600" />
                <Badge className="bg-orange-100 text-orange-700">5</Badge>
              </div>
              <p className="text-sm font-medium text-white">Escalations</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-purple-400 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Bell className="w-5 h-5 text-purple-600" />
                <Badge className="bg-purple-100 text-purple-700">8</Badge>
              </div>
              <p className="text-sm font-medium text-white">Monitoring Alerts</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-gray-400 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <XCircle className="w-5 h-5 text-slate-300" />
                <Badge className="bg-[#0a0e17] text-slate-300">1</Badge>
              </div>
              <p className="text-sm font-medium text-white">Failed Screenings</p>
            </CardContent>
          </Card>
        </div>

        {/* Critical Alert */}
        <Card className="border-2 border-red-500 bg-red-50 mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Ban className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-red-900">SANCTIONS MATCH CONFIRMED</h3>
                  <Badge className="bg-red-600 text-white">CRITICAL</Badge>
                </div>
                <p className="text-red-800 mb-3">
                  <strong>Vladimir Petrov</strong> - CONFIRMED MATCH on OFAC SDN List. Automatic relationship block enforced.
                </p>
                <div className="grid md:grid-cols-4 gap-3">
                  <div className="bg-[#0d121d] p-3 rounded border border-red-300">
                    <p className="text-xs text-red-700">Matched List</p>
                    <p className="font-bold text-red-900">OFAC SDN</p>
                  </div>
                  <div className="bg-[#0d121d] p-3 rounded border border-red-300">
                    <p className="text-xs text-red-700">Match Type</p>
                    <p className="font-bold text-red-900">Exact Name + DOB</p>
                  </div>
                  <div className="bg-[#0d121d] p-3 rounded border border-red-300">
                    <p className="text-xs text-red-700">Confidence</p>
                    <p className="font-bold text-red-900">98% - Very High</p>
                  </div>
                  <div className="bg-[#0d121d] p-3 rounded border border-red-300">
                    <p className="text-xs text-red-700">Status</p>
                    <p className="font-bold text-red-900">AUTO BLOCKED</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Queue Tables */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* New Screenings */}
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-600" />
                New Screenings Queue
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#0a0e17] border-b">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-slate-300">Name</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-300">Type</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-300">Country</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-300">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[
                      { name: 'Sarah Johnson', type: 'Person', country: 'USA', status: 'Cleared', priority: 'Normal' },
                      { name: 'Tech Industries Ltd', type: 'Entity', country: 'UK', status: 'Screening', priority: 'Normal' },
                      { name: 'Ahmed Hassan', type: 'Person', country: 'UAE', status: 'Review Required', priority: 'High' },
                      { name: 'Global Shipping Co', type: 'Entity', country: 'Singapore', status: 'Queued', priority: 'Normal' },
                    ].map((item, idx) => (
                      <tr key={idx} className="hover:bg-white/5 cursor-pointer">
                        <td className="px-4 py-3 font-medium text-white">{item.name}</td>
                        <td className="px-4 py-3 text-xs text-slate-300">{item.type}</td>
                        <td className="px-4 py-3 text-xs text-slate-300">{item.country}</td>
                        <td className="px-4 py-3">
                          <Badge className={
                            item.status === 'Cleared' ? 'bg-green-100 text-green-700' :
                            item.status === 'Screening' ? 'bg-blue-100 text-blue-700' :
                            item.status === 'Review Required' ? 'bg-amber-100 text-amber-700' :
                            'bg-[#0a0e17] text-slate-300'
                          }>
                            {item.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t bg-[#0a0e17]">
                <Button variant="ghost" className="w-full text-blue-700 hover:bg-blue-50" onClick={() => onNavigate('new-screening')}>
                  View All Screenings <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Monitoring Alerts */}
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b">
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-purple-600" />
                Monitoring Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#0a0e17] border-b">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-slate-300">Name</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-300">Last Screened</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-300">Alert</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-300">Severity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[
                      { name: 'Vladimir Petrov', lastScreened: '2 days ago', alert: 'New OFAC match', severity: 'Critical' },
                      { name: 'Chen Industries', lastScreened: '1 day ago', alert: 'UN list update', severity: 'High' },
                      { name: 'Maria Garcia', lastScreened: '3 days ago', alert: 'Possible EU match', severity: 'Medium' },
                      { name: 'Eastern Trading Co', lastScreened: '1 day ago', alert: 'Name similarity alert', severity: 'Low' },
                    ].map((item, idx) => (
                      <tr key={idx} className="hover:bg-white/5 cursor-pointer">
                        <td className="px-4 py-3 font-medium text-white">{item.name}</td>
                        <td className="px-4 py-3 text-xs text-slate-300">{item.lastScreened}</td>
                        <td className="px-4 py-3 text-xs text-slate-300">{item.alert}</td>
                        <td className="px-4 py-3">
                          <Badge className={
                            item.severity === 'Critical' ? 'bg-red-600 text-white' :
                            item.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                            item.severity === 'Medium' ? 'bg-amber-100 text-amber-700' :
                            'bg-[#0a0e17] text-slate-300'
                          }>
                            {item.severity}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t bg-[#0a0e17]">
                <Button variant="ghost" className="w-full text-purple-700 hover:bg-purple-50">
                  View All Alerts <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sources Status */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              Sanctions List Coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-5 gap-4">
              {[
                { name: 'DFAT Consolidated', status: 'Active', lastUpdate: '2 hours ago', records: '2,847' },
                { name: 'UN Sanctions List', status: 'Active', lastUpdate: '1 hour ago', records: '1,923' },
                { name: 'OFAC SDN List', status: 'Active', lastUpdate: '30 mins ago', records: '6,542' },
                { name: 'UK HMT List', status: 'Active', lastUpdate: '1 hour ago', records: '3,214' },
                { name: 'EU Consolidated', status: 'Active', lastUpdate: '45 mins ago', records: '4,687' },
              ].map((source, idx) => (
                <div key={idx} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <Badge className="bg-green-100 text-green-700 text-xs">{source.status}</Badge>
                  </div>
                  <p className="font-semibold text-white text-sm mb-1">{source.name}</p>
                  <p className="text-xs text-slate-300">Updated: {source.lastUpdate}</p>
                  <p className="text-xs text-slate-300">{source.records} records</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Screen 2: Sanctions Screening Wizard
function SanctionsScreeningWizard({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(1);
  const [subjectType, setSubjectType] = useState<'person' | 'entity'>('person');
  const [formData, setFormData] = useState({
    fullName: '',
    aliases: '',
    dob: '',
    nationality: '',
    residenceCountry: '',
    entityName: '',
    registrationCountry: ''
  });

  const [searchConfig, setSearchConfig] = useState({
    standard: true,
    expandedGlobal: false,
    fuzzyMatching: true,
    transliteration: false,
    vesselSearch: false
  });

  const [searchResults, setSearchResults] = useState<any>(null);

  const runScreening = () => {
    setTimeout(() => {
      setSearchResults({
        exactMatches: [],
        probableMatches: [],
        weakMatches: []
      });
      setStep(4);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0e17]">
      <div className="bg-[#0d121d] border-b border-white/10">
        <div className="max-w-5xl mx-auto px-8 py-6">
          <Button onClick={onBack} variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center">
              <Ban className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Sanctions Screening Wizard</h1>
              <p className="text-slate-300">Real-time screening against global sanctions lists</p>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-6 flex items-center justify-between max-w-2xl">
            {[
              { num: 1, label: 'Input' },
              { num: 2, label: 'Configuration' },
              { num: 3, label: 'Search Plan' },
              { num: 4, label: 'Results' },
              { num: 5, label: 'Decision' },
              { num: 6, label: 'Outcome' }
            ].map((s) => (
              <div key={s.num} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= s.num ? 'bg-red-600 text-white' : 'bg-gray-200 text-slate-300'
                }`}>
                  {s.num}
                </div>
                <div className="ml-2">
                  <p className={`text-xs font-medium ${step >= s.num ? 'text-red-600' : 'text-slate-400'}`}>
                    {s.label}
                  </p>
                </div>
                {s.num < 6 && <div className={`mx-2 w-8 h-0.5 ${step > s.num ? 'bg-red-600' : 'bg-gray-300'}`}></div>}
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
              <CardTitle>Step 1: Subject Information</CardTitle>
              <CardDescription>Enter details of the person or entity to screen</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Subject Type *</Label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={subjectType === 'person'}
                      onChange={() => setSubjectType('person')}
                      className="w-4 h-4 text-red-600"
                    />
                    <span className="text-sm">Person</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={subjectType === 'entity'}
                      onChange={() => setSubjectType('entity')}
                      className="w-4 h-4 text-red-600"
                    />
                    <span className="text-sm">Entity</span>
                  </label>
                </div>
              </div>

              {subjectType === 'person' ? (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Full Legal Name *</Label>
                    <Input 
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Sarah Michelle Johnson"
                    />
                  </div>
                  <div>
                    <Label>Known Aliases</Label>
                    <Input 
                      value={formData.aliases}
                      onChange={(e) => setFormData({ ...formData, aliases: e.target.value })}
                      placeholder="e.g. S. Johnson, Sarah M. Johnson"
                    />
                  </div>
                  <div>
                    <Label>Date of Birth *</Label>
                    <Input 
                      type="date"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Nationality *</Label>
                    <Input 
                      value={formData.nationality}
                      onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                      placeholder="e.g. American"
                    />
                  </div>
                  <div>
                    <Label>Country of Residence</Label>
                    <Input 
                      value={formData.residenceCountry}
                      onChange={(e) => setFormData({ ...formData, residenceCountry: e.target.value })}
                      placeholder="e.g. USA"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Entity Legal Name *</Label>
                    <Input 
                      value={formData.entityName}
                      onChange={(e) => setFormData({ ...formData, entityName: e.target.value })}
                      placeholder="e.g. Tech Industries Ltd"
                    />
                  </div>
                  <div>
                    <Label>Registration Country *</Label>
                    <Input 
                      value={formData.registrationCountry}
                      onChange={(e) => setFormData({ ...formData, registrationCountry: e.target.value })}
                      placeholder="e.g. United Kingdom"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button variant="outline" onClick={onBack}>Cancel</Button>
                <Button 
                  onClick={() => setStep(2)}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={subjectType === 'person' ? (!formData.fullName || !formData.dob) : !formData.entityName}
                >
                  Next: Configuration <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Configuration */}
        {step === 2 && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Step 2: Search Configuration</CardTitle>
              <CardDescription>Configure sanctions screening parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-4 border-2 border-red-400 bg-red-50 rounded-lg">
                  <input
                    type="radio"
                    checked={searchConfig.standard}
                    onChange={() => setSearchConfig({ ...searchConfig, standard: true, expandedGlobal: false })}
                    className="w-5 h-5 text-red-600 mt-0.5"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-white">Standard Screening (Recommended)</p>
                    <p className="text-sm text-slate-300 mt-1">DFAT, UN, OFAC, UK HMT, EU lists with exact matching</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 border-2 border-gray-300 rounded-lg hover:border-gray-400 cursor-pointer">
                  <input
                    type="radio"
                    checked={searchConfig.expandedGlobal}
                    onChange={() => setSearchConfig({ ...searchConfig, standard: false, expandedGlobal: true })}
                    className="w-5 h-5 text-red-600 mt-0.5"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-white">Expanded Global Screening</p>
                    <p className="text-sm text-slate-300 mt-1">All major lists plus regional sanctions databases</p>
                  </div>
                </label>
              </div>

              <div className="pt-4 border-t space-y-3">
                <p className="font-semibold text-white">Additional Options</p>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={searchConfig.fuzzyMatching}
                    onChange={(e) => setSearchConfig({ ...searchConfig, fuzzyMatching: e.target.checked })}
                    className="w-4 h-4 text-red-600 rounded"
                  />
                  <span className="text-sm text-slate-300">Include fuzzy matching (name variations)</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={searchConfig.transliteration}
                    onChange={(e) => setSearchConfig({ ...searchConfig, transliteration: e.target.checked })}
                    className="w-4 h-4 text-red-600 rounded"
                  />
                  <span className="text-sm text-slate-300">Include transliteration (non-Latin scripts)</span>
                </label>

                {subjectType === 'entity' && (
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={searchConfig.vesselSearch}
                      onChange={(e) => setSearchConfig({ ...searchConfig, vesselSearch: e.target.checked })}
                      className="w-4 h-4 text-red-600 rounded"
                    />
                    <span className="text-sm text-slate-300">Include vessel search (if applicable)</span>
                  </label>
                )}
              </div>

              <div className="flex justify-between gap-3 pt-6 border-t">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button onClick={() => setStep(3)} className="bg-red-600 hover:bg-red-700">
                  Next: Review Plan <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: AI Search Plan */}
        {step === 3 && (
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Step 3: AI Search Plan
              </CardTitle>
              <CardDescription>Review the sanctions screening strategy</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="font-semibold text-red-900 mb-2">Search Target</p>
                <p className="text-sm text-red-800">
                  <strong>{subjectType === 'person' ? formData.fullName : formData.entityName}</strong> • {subjectType === 'person' ? formData.nationality : 'Entity'}
                </p>
              </div>

              <div>
                <p className="font-semibold text-white mb-3">Sanctions Lists Being Checked (5)</p>
                <div className="grid md:grid-cols-2 gap-2">
                  {[
                    'DFAT Consolidated List (Australia)',
                    'UN Security Council Sanctions List',
                    'OFAC SDN List (United States)',
                    'UK HMT Sanctions List',
                    'EU Consolidated Sanctions List'
                  ].map((list, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-[#0a0e17] rounded text-xs">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      <span className="text-slate-300">{list}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-semibold text-white mb-3">Name Variants & Aliases</p>
                <div className="flex flex-wrap gap-2">
                  {['Sarah Johnson', 'Sarah M. Johnson', 'S. Johnson', 'S.M. Johnson', 'Johnson, Sarah'].map((variant, idx) => (
                    <Badge key={idx} className="bg-purple-100 text-purple-700">{variant}</Badge>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-900 mb-1">Critical Matching Rules</p>
                    <ul className="text-sm text-amber-800 space-y-1">
                      <li>• Exact name + DOB match = High confidence</li>
                      <li>• <strong>CONFIRMED SANCTIONS MATCH = AUTOMATIC BLOCK</strong></li>
                      <li>• All matches require manual review before clearing</li>
                      <li>• Weak matches flagged for investigation</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#0a0e17] rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-300">Expected Runtime</p>
                  <p className="text-xs text-slate-300">Real-time screening across 5 major lists</p>
                </div>
                <p className="text-2xl font-bold text-red-600">~3 seconds</p>
              </div>

              <div className="flex justify-between gap-3 pt-6 border-t">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button onClick={runScreening} className="bg-green-600 hover:bg-green-700">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Execute Screening
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Results */}
        {step === 4 && (
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Step 4: Screening Results
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="p-6 bg-green-50 border-2 border-green-400 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-900">NO SANCTIONS MATCHES FOUND</p>
                      <p className="text-sm text-green-700">Subject cleared across all global sanctions lists</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-green-600">0</p>
                    <p className="text-xs text-green-700">Matches</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-5 gap-3 mt-4">
                  {[
                    { list: 'DFAT', matches: 0 },
                    { list: 'UN', matches: 0 },
                    { list: 'OFAC', matches: 0 },
                    { list: 'UK HMT', matches: 0 },
                    { list: 'EU', matches: 0 }
                  ].map((result, idx) => (
                    <div key={idx} className="bg-[#0d121d] p-3 rounded border border-green-200">
                      <p className="text-xs text-slate-300">{result.list}</p>
                      <p className="text-2xl font-bold text-green-600">{result.matches}</p>
                      <Badge className="bg-green-100 text-green-700 text-xs mt-1">Clear</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between gap-3 pt-6 border-t">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Start New Screening
                </Button>
                <Button onClick={() => setStep(5)} className="bg-red-600 hover:bg-red-700">
                  Next: Confirm Decision <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Decision */}
        {step === 5 && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Step 5: Analyst Decision</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="font-semibold text-blue-900 mb-2">AI Recommendation</p>
                <p className="text-sm text-blue-800">
                  No sanctions matches detected. Recommend <strong>CLEAR TO PROCEED</strong>.
                </p>
              </div>

              <div>
                <Label>Final Decision *</Label>
                <div className="space-y-2 mt-2">
                  <label className="flex items-start gap-3 p-3 border-2 border-green-400 bg-green-50 rounded-lg">
                    <input type="radio" name="decision" defaultChecked className="w-4 h-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-white">Confirm - No Match (Clear)</p>
                      <Badge className="mt-1 bg-green-600 text-white text-xs">Recommended</Badge>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-3 border-2 border-gray-300 rounded-lg">
                    <input type="radio" name="decision" className="w-4 h-4 text-red-600 mt-0.5" />
                    <p className="font-medium text-white">Mark as False Positive</p>
                  </label>
                  <label className="flex items-start gap-3 p-3 border-2 border-gray-300 rounded-lg">
                    <input type="radio" name="decision" className="w-4 h-4 text-red-600 mt-0.5" />
                    <p className="font-medium text-white">Escalate for Review</p>
                  </label>
                </div>
              </div>

              <div className="flex justify-between gap-3 pt-6 border-t">
                <Button variant="outline" onClick={() => setStep(4)}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button onClick={() => setStep(6)} className="bg-green-600 hover:bg-green-700">
                  Confirm Decision <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 6: Outcome */}
        {step === 6 && (
          <Card className="border-2 border-green-400">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-2">Sanctions Screening Complete</h2>
              <p className="text-slate-300 mb-8">{subjectType === 'person' ? formData.fullName : formData.entityName} - CLEARED</p>

              <div className="max-w-2xl mx-auto space-y-4 mb-8">
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <div className="p-4 bg-[#0a0e17] rounded-lg">
                    <p className="text-xs text-slate-300">Final Result</p>
                    <p className="font-semibold text-green-600">NO SANCTIONS MATCH</p>
                  </div>
                  <div className="p-4 bg-[#0a0e17] rounded-lg">
                    <p className="text-xs text-slate-300">Lists Checked</p>
                    <p className="font-semibold text-white">5 Major Lists</p>
                  </div>
                  <div className="p-4 bg-[#0a0e17] rounded-lg">
                    <p className="text-xs text-slate-300">Screening Date</p>
                    <p className="font-semibold text-white">{new Date().toLocaleDateString('en-AU')}</p>
                  </div>
                  <div className="p-4 bg-[#0a0e17] rounded-lg">
                    <p className="text-xs text-slate-300">Reviewer</p>
                    <p className="font-semibold text-white">Current User</p>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-left">
                  <div className="flex items-start gap-2">
                    <RefreshCw className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-purple-900">Continuous Monitoring Active</p>
                      <p className="text-sm text-purple-700 mt-1">
                        Subject will be automatically rescreened daily to detect any new sanctions list additions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <Button onClick={onBack} className="bg-red-600 hover:bg-red-700">
                  Return to Dashboard
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Certificate
                </Button>
                <Button variant="outline" onClick={() => setStep(1)}>
                  Screen Another Subject
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

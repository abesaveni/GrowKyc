import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import {
  Shield,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
  FileText,
  Globe,
  TrendingUp,
  Eye,
  ArrowRight,
  ArrowLeft,
  Calendar,
  RefreshCw,
  Bell,
  Filter,
  Download,
  Settings,
  Sparkles,
  Building2,
  Ban,
  AlertTriangle,
  Info,
  XCircle,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

type ViewMode = 'dashboard' | 'new-check' | 'monthly-queue' | 'review-workbench' | 'person-profile' | 'escalation' | 'rules' | 'reporting' | 'sources';

interface PEPScreeningBotProps {
  onBack?: () => void;
}

export function PEPScreeningBot({ onBack }: PEPScreeningBotProps) {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [selectedPerson, setSelectedPerson] = useState<any>(null);

  // Dashboard view
  if (currentView === 'dashboard') {
    return <PEPControlCentre onNavigate={setCurrentView} onBack={onBack} />;
  }

  // New check wizard
  if (currentView === 'new-check') {
    return <NewCheckWizard onBack={() => setCurrentView('dashboard')} />;
  }

  // Monthly queue
  if (currentView === 'monthly-queue') {
    return <MonthlyRescreeningQueue onBack={() => setCurrentView('dashboard')} />;
  }

  // Review workbench
  if (currentView === 'review-workbench') {
    return <SearchResultsWorkbench onBack={() => setCurrentView('dashboard')} />;
  }

  return <PEPControlCentre onNavigate={setCurrentView} onBack={onBack} />;
}

// Screen 1: PEP Control Centre Dashboard
function PEPControlCentre({ onNavigate, onBack }: { onNavigate: (view: ViewMode) => void; onBack?: () => void }) {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Header */}
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
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Global PEP Screening Bot</h1>
                  <p className="text-slate-300">AI-Powered Politically Exposed Person Monitoring</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button onClick={() => onNavigate('new-check')} className="bg-[#13B5EA] hover:bg-[#0E7C9E]">
                <Search className="w-4 h-4 mr-2" />
                Run New Check
              </Button>
              <Button variant="outline" onClick={() => onNavigate('reporting')}>
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="border-2 hover:border-blue-400 transition-colors cursor-pointer" onClick={() => onNavigate('new-check')}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <Badge className="bg-blue-100 text-blue-700">23</Badge>
              </div>
              <p className="text-sm font-medium text-white">Awaiting PEP Check</p>
              <p className="text-xs text-slate-300 mt-1">New clients</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-purple-400 transition-colors cursor-pointer" onClick={() => onNavigate('monthly-queue')}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <RefreshCw className="w-5 h-5 text-purple-600" />
                <Badge className="bg-purple-100 text-purple-700">147</Badge>
              </div>
              <p className="text-sm font-medium text-white">Monthly Reviews Due</p>
              <p className="text-xs text-slate-300 mt-1">This week</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-amber-400 transition-colors cursor-pointer" onClick={() => onNavigate('review-workbench')}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Eye className="w-5 h-5 text-amber-600" />
                <Badge className="bg-amber-100 text-amber-700">8</Badge>
              </div>
              <p className="text-sm font-medium text-white">Possible Matches</p>
              <p className="text-xs text-slate-300 mt-1">Needs review</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-red-400 transition-colors cursor-pointer" onClick={() => onNavigate('escalation')}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <Badge className="bg-red-100 text-red-700">3</Badge>
              </div>
              <p className="text-sm font-medium text-white">Foreign PEPs</p>
              <p className="text-xs text-slate-300 mt-1">High risk</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-orange-400 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Shield className="w-5 h-5 text-orange-600" />
                <Badge className="bg-orange-100 text-orange-700">5</Badge>
              </div>
              <p className="text-sm font-medium text-white">Escalated Cases</p>
              <p className="text-xs text-slate-300 mt-1">Pending approval</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-red-400 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <Badge className="bg-red-100 text-red-700">12</Badge>
              </div>
              <p className="text-sm font-medium text-white">Overdue Reviews</p>
              <p className="text-xs text-slate-300 mt-1">Action required</p>
            </CardContent>
          </Card>
        </div>

        {/* Queue Tables */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* New Checks Queue */}
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-600" />
                New Checks Queue
              </CardTitle>
              <CardDescription>Clients awaiting initial PEP screening</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#0f172a] border-b">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-slate-300">Name</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-300">Role</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-300">Country</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-300">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[
                      { name: 'Sarah Mitchell', role: 'Director', entity: 'Mitchell & Co Pty Ltd', country: 'Australia', status: 'Queued', risk: 'Low' },
                      { name: 'Michael Chen', role: 'Beneficial Owner', entity: 'Pacific Trust', country: 'Singapore', status: 'Searching', risk: 'Medium' },
                      { name: 'Emma Rodriguez', role: 'Client', entity: 'Individual', country: 'Spain', status: 'Review Required', risk: 'High' },
                      { name: 'James Thomson', role: 'Trustee', entity: 'Thomson Family Trust', country: 'Australia', status: 'Queued', risk: 'Low' },
                    ].map((item, idx) => (
                      <tr key={idx} className="hover:bg-white/5 cursor-pointer">
                        <td className="px-4 py-3 font-medium text-white">{item.name}</td>
                        <td className="px-4 py-3 text-slate-300 text-xs">{item.role}</td>
                        <td className="px-4 py-3 text-slate-300 text-xs">
                          <div className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {item.country}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={
                            item.status === 'Queued' ? 'bg-[#0f172a] text-slate-300' :
                            item.status === 'Searching' ? 'bg-blue-100 text-blue-700' :
                            'bg-amber-100 text-amber-700'
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
                <Button variant="ghost" className="w-full text-blue-700 hover:bg-blue-50" onClick={() => onNavigate('new-check')}>
                  View All New Checks <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Rescreens Queue */}
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b">
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-purple-600" />
                Monthly Rescreening Queue
              </CardTitle>
              <CardDescription>Active clients requiring periodic review</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#0f172a] border-b">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-slate-300">Name</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-300">Last Screened</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-300">Status</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-300">Priority</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[
                      { name: 'David Wilson', lastScreened: '30 days ago', currentStatus: 'Not PEP', priority: 'Standard' },
                      { name: 'Lisa Chang', lastScreened: '28 days ago', currentStatus: 'Domestic PEP', priority: 'Enhanced' },
                      { name: 'Marcus Johnson', lastScreened: '31 days ago', currentStatus: 'Not PEP', priority: 'Standard' },
                      { name: 'Sofia Martinez', lastScreened: '7 days ago', currentStatus: 'Foreign PEP', priority: 'Weekly' },
                    ].map((item, idx) => (
                      <tr key={idx} className="hover:bg-white/5 cursor-pointer">
                        <td className="px-4 py-3 font-medium text-white">{item.name}</td>
                        <td className="px-4 py-3 text-slate-300 text-xs">{item.lastScreened}</td>
                        <td className="px-4 py-3">
                          <Badge className={
                            item.currentStatus === 'Not PEP' ? 'bg-green-100 text-green-700' :
                            item.currentStatus === 'Domestic PEP' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }>
                            {item.currentStatus}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-300">{item.priority}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t bg-[#0f172a]">
                <Button variant="ghost" className="w-full text-purple-700 hover:bg-purple-50" onClick={() => onNavigate('monthly-queue')}>
                  View All Monthly Reviews <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Panel */}
        <Card className="border-2">
          <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-red-600" />
              Recent Alerts & System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-red-900 text-sm">Foreign PEP Identified</p>
                  <p className="text-xs text-red-700 mt-1">Emma Rodriguez flagged as possible foreign PEP - Ministry of Finance, Spain (2018-2021)</p>
                  <p className="text-xs text-red-600 mt-2">Action Required: Enhanced Due Diligence & Senior Approval</p>
                </div>
                <Badge className="bg-red-600 text-white">NEW</Badge>
              </div>

              <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <Info className="w-5 h-5 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-amber-900 text-sm">Client Became PEP During Relationship</p>
                  <p className="text-xs text-amber-700 mt-1">Lisa Chang appointed to State Infrastructure Board - now classified as Domestic PEP</p>
                  <p className="text-xs text-amber-600 mt-2">Monthly review detected status change - risk assessment updated</p>
                </div>
                <Badge className="bg-amber-600 text-white">3h ago</Badge>
              </div>

              <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-blue-900 text-sm">Monthly Screening Complete</p>
                  <p className="text-xs text-blue-700 mt-1">142 of 147 monthly reviews completed - 5 pending analyst review</p>
                </div>
                <Badge className="bg-blue-600 text-white">1d ago</Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-xs font-medium text-slate-300">Sources Online</p>
                  </div>
                  <p className="text-2xl font-bold text-green-600">18/18</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <p className="text-xs font-medium text-slate-300">Search Queue</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">23</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <p className="text-xs font-medium text-slate-300">Failed Jobs</p>
                  </div>
                  <p className="text-2xl font-bold text-amber-600">2</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Screen 2: New Client PEP Check Wizard
function NewCheckWizard({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    aliases: '',
    dob: '',
    countryOfResidence: '',
    nationality: '',
    occupation: '',
    roleInMatter: 'client',
    linkedEntity: '',
    beneficialOwnership: '',
    declaredPEP: false,
    declaredFamilyAssociate: false
  });

  const [searchScope, setSearchScope] = useState({
    standard: true,
    expandedGlobal: false,
    enhancedHighRisk: false,
    transliteration: false,
    historicOfficeHolders: true,
    familyAssociateSearch: false
  });

  const [searchResults, setSearchResults] = useState<any>(null);
  const [searching, setSearching] = useState(false);

  const runSearch = () => {
    setSearching(true);
    // Simulate AI search
    setTimeout(() => {
      setSearchResults({
        noPEP: { confidence: 85, matches: 0 },
        domesticPEP: { confidence: 0, matches: 0 },
        foreignPEP: { confidence: 0, matches: 0 },
        ioPEP: { confidence: 0, matches: 0 },
        familyMember: { confidence: 0, matches: 0 },
        closeAssociate: { confidence: 0, matches: 0 }
      });
      setSearching(false);
      setStep(4);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Header */}
      <div className="bg-[#1e293b] border-b border-white/10">
        <div className="max-w-5xl mx-auto px-8 py-6">
          <Button onClick={onBack} variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Search className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">New Client PEP Check</h1>
              <p className="text-slate-300">AI-powered global PEP screening wizard</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mt-6 flex items-center justify-between max-w-2xl">
            {[
              { num: 1, label: 'Person Details' },
              { num: 2, label: 'Search Scope' },
              { num: 3, label: 'AI Search Plan' },
              { num: 4, label: 'Results' },
              { num: 5, label: 'Decision' },
              { num: 6, label: 'Outcome' }
            ].map((s) => (
              <div key={s.num} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= s.num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-slate-300'
                }`}>
                  {s.num}
                </div>
                <div className="ml-2">
                  <p className={`text-xs font-medium ${step >= s.num ? 'text-blue-600' : 'text-slate-400'}`}>
                    {s.label}
                  </p>
                </div>
                {s.num < 6 && <div className={`mx-2 w-8 h-0.5 ${step > s.num ? 'bg-blue-600' : 'bg-gray-300'}`}></div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8">
        {/* Step 1: Person Details */}
        {step === 1 && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Step 1: Person Details</CardTitle>
              <CardDescription>Enter the details of the person to be screened</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Full Legal Name *</Label>
                  <Input 
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Sarah Jane Mitchell"
                  />
                </div>
                <div>
                  <Label>Known Aliases</Label>
                  <Input 
                    value={formData.aliases}
                    onChange={(e) => setFormData({ ...formData, aliases: e.target.value })}
                    placeholder="e.g. Sarah J. Mitchell, S. Mitchell"
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
                  <Label>Country of Residence *</Label>
                  <Input 
                    value={formData.countryOfResidence}
                    onChange={(e) => setFormData({ ...formData, countryOfResidence: e.target.value })}
                    placeholder="e.g. Australia"
                  />
                </div>
                <div>
                  <Label>Nationality *</Label>
                  <Input 
                    value={formData.nationality}
                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    placeholder="e.g. Australian"
                  />
                </div>
                <div>
                  <Label>Occupation</Label>
                  <Input 
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    placeholder="e.g. Business Owner"
                  />
                </div>
                <div>
                  <Label>Role in Matter *</Label>
                  <select
                    value={formData.roleInMatter}
                    onChange={(e) => setFormData({ ...formData, roleInMatter: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="client">Client</option>
                    <option value="representative">Client Representative</option>
                    <option value="director">Director</option>
                    <option value="beneficial-owner">Beneficial Owner</option>
                    <option value="trustee">Trustee</option>
                    <option value="beneficiary">Beneficiary</option>
                    <option value="ceo">CEO</option>
                  </select>
                </div>
                <div>
                  <Label>Linked Entity</Label>
                  <Input 
                    value={formData.linkedEntity}
                    onChange={(e) => setFormData({ ...formData, linkedEntity: e.target.value })}
                    placeholder="e.g. Mitchell & Co Pty Ltd"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.declaredPEP}
                      onChange={(e) => setFormData({ ...formData, declaredPEP: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-slate-300">Self-declared political exposure</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.declaredFamilyAssociate}
                      onChange={(e) => setFormData({ ...formData, declaredFamilyAssociate: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-slate-300">Family member or associate of PEP</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button variant="outline" onClick={onBack}>Cancel</Button>
                <Button 
                  onClick={() => setStep(2)}
                  disabled={!formData.fullName || !formData.dob || !formData.countryOfResidence}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Next: Search Scope <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Search Scope */}
        {step === 2 && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Step 2: Search Scope</CardTitle>
              <CardDescription>Configure the depth and coverage of the PEP search</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-4 border-2 border-blue-400 bg-blue-50 rounded-lg">
                  <input
                    type="radio"
                    name="searchType"
                    checked={searchScope.standard}
                    onChange={() => setSearchScope({ ...searchScope, standard: true, expandedGlobal: false, enhancedHighRisk: false })}
                    className="w-5 h-5 text-blue-600 mt-0.5"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-white">Standard Search (Recommended)</p>
                    <p className="text-sm text-slate-300 mt-1">Official government sources, parliament websites, international organization leadership pages</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 border-2 border-gray-300 rounded-lg hover:border-gray-400 cursor-pointer">
                  <input
                    type="radio"
                    name="searchType"
                    checked={searchScope.expandedGlobal}
                    onChange={() => setSearchScope({ ...searchScope, standard: false, expandedGlobal: true, enhancedHighRisk: false })}
                    className="w-5 h-5 text-blue-600 mt-0.5"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-white">Expanded Global Search</p>
                    <p className="text-sm text-slate-300 mt-1">Includes trusted news sources, archived pages, and commercial PEP databases</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 border-2 border-gray-300 rounded-lg hover:border-gray-400 cursor-pointer">
                  <input
                    type="radio"
                    name="searchType"
                    checked={searchScope.enhancedHighRisk}
                    onChange={() => setSearchScope({ ...searchScope, standard: false, expandedGlobal: false, enhancedHighRisk: true })}
                    className="w-5 h-5 text-blue-600 mt-0.5"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-white">Enhanced Search for High-Risk Country</p>
                    <p className="text-sm text-slate-300 mt-1">Maximum coverage including regional sources and local language searches</p>
                  </div>
                </label>
              </div>

              <div className="pt-4 border-t space-y-3">
                <p className="font-semibold text-white">Additional Search Options</p>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={searchScope.transliteration}
                    onChange={(e) => setSearchScope({ ...searchScope, transliteration: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-slate-300">Include transliteration variants (non-Latin scripts)</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={searchScope.historicOfficeHolders}
                    onChange={(e) => setSearchScope({ ...searchScope, historicOfficeHolders: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-slate-300">Include historic office holders (last 10 years)</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={searchScope.familyAssociateSearch}
                    onChange={(e) => setSearchScope({ ...searchScope, familyAssociateSearch: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-slate-300">Include family members and close associates</span>
                </label>
              </div>

              <div className="flex justify-between gap-3 pt-6 border-t">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button onClick={() => setStep(3)} className="bg-blue-600 hover:bg-blue-700">
                  Next: Review Search Plan <ArrowRight className="w-4 h-4 ml-2" />
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
              <CardDescription>Review the automated search strategy before execution</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="font-semibold text-blue-900 mb-2">Search Target</p>
                <p className="text-sm text-blue-800">
                  <strong>{formData.fullName}</strong> • {formData.nationality} • {formData.roleInMatter}
                </p>
              </div>

              <div>
                <p className="font-semibold text-white mb-3">Sources to be Searched (18)</p>
                <div className="grid md:grid-cols-2 gap-2">
                  {[
                    'Australian Parliament Website',
                    'Australian Government Ministers',
                    'Reserve Bank of Australia Leadership',
                    'High Court of Australia',
                    'State Parliament Websites (8)',
                    'UN Leadership Database',
                    'IMF Executive Board',
                    'World Bank Leadership',
                    'ASIC Registry (Cross-check)',
                    'Australian Embassy Network',
                    'AFP Leadership',
                    'State-Owned Enterprise Boards (12)',
                    'Government Gazette Archives',
                    'Foreign Government Sources (G20)',
                    'Diplomatic Mission Pages',
                    'Defence Leadership (Public)',
                    'ABC News Archive (Family/Associate)',
                    'SMH Archive (Family/Associate)'
                  ].map((source, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-[#0f172a] rounded text-xs">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      <span className="text-slate-300">{source}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-semibold text-white mb-3">Search Keywords & Variants</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    '"Sarah Mitchell"',
                    '"Sarah Jane Mitchell"',
                    '"S. Mitchell"',
                    '"S.J. Mitchell"',
                    '"Mitchell, Sarah"'
                  ].map((term, idx) => (
                    <Badge key={idx} className="bg-purple-100 text-purple-700">{term}</Badge>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-900 mb-1">Confidence Rules</p>
                    <ul className="text-sm text-amber-800 space-y-1">
                      <li>• Exact name + DOB + official source = Auto-clear if no match</li>
                      <li>• Name match only = Requires analyst review</li>
                      <li>• Foreign PEP match = Automatic high risk escalation</li>
                      <li>• Family/associate link = Manual review required</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#0f172a] rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-300">Expected Runtime</p>
                  <p className="text-xs text-slate-300">Based on search scope and coverage</p>
                </div>
                <p className="text-2xl font-bold text-blue-600">~45 seconds</p>
              </div>

              <div className="flex justify-between gap-3 pt-6 border-t">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button onClick={runSearch} className="bg-green-600 hover:bg-green-700">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Execute AI Search
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Search Results */}
        {step === 4 && (
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Step 4: Search Results
              </CardTitle>
              <CardDescription>AI-powered PEP classification results</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="p-6 bg-green-50 border-2 border-green-400 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-900">No PEP Indicators Found</p>
                      <p className="text-sm text-green-700">High confidence - 85% match certainty</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-green-600">0</p>
                    <p className="text-xs text-green-700">Matches</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-3 mt-4">
                  <div className="bg-[#1e293b] p-3 rounded">
                    <p className="text-xs text-slate-300">Sources Searched</p>
                    <p className="text-xl font-bold text-white">18</p>
                  </div>
                  <div className="bg-[#1e293b] p-3 rounded">
                    <p className="text-xs text-slate-300">Search Duration</p>
                    <p className="text-xl font-bold text-white">42s</p>
                  </div>
                  <div className="bg-[#1e293b] p-3 rounded">
                    <p className="text-xs text-slate-300">Identity Confidence</p>
                    <p className="text-xl font-bold text-green-600">High</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { type: 'Domestic PEP', confidence: 0, matches: 0, color: 'gray' },
                  { type: 'Foreign PEP', confidence: 0, matches: 0, color: 'gray' },
                  { type: 'International Organization PEP', confidence: 0, matches: 0, color: 'gray' },
                  { type: 'Family Member', confidence: 0, matches: 0, color: 'gray' },
                  { type: 'Close Associate', confidence: 0, matches: 0, color: 'gray' },
                ].map((result, idx) => (
                  <div key={idx} className={`p-4 border-2 rounded-lg bg-${result.color}-50 border-${result.color}-200`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-white">{result.type}</p>
                      <Badge className={`bg-${result.color}-100 text-${result.color}-700`}>
                        {result.matches} matches
                      </Badge>
                    </div>
                    <Progress value={result.confidence} className="h-2" />
                    <p className="text-xs text-slate-300 mt-2">Confidence: {result.confidence}%</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between gap-3 pt-6 border-t">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Start New Search
                </Button>
                <Button onClick={() => setStep(5)} className="bg-blue-600 hover:bg-blue-700">
                  Next: Analyst Decision <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Analyst Decision */}
        {step === 5 && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Step 5: Analyst Decision</CardTitle>
              <CardDescription>Review and confirm the PEP classification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="font-semibold text-blue-900 mb-2">AI Recommendation</p>
                <p className="text-sm text-blue-800">
                  Based on the search results, the AI bot recommends classifying <strong>{formData.fullName}</strong> as <strong>NOT A PEP</strong> with high confidence.
                </p>
              </div>

              <div>
                <Label className="mb-3 block">Final Classification *</Label>
                <div className="space-y-2">
                  {[
                    { value: 'not-pep', label: 'Not a PEP', color: 'green', recommended: true },
                    { value: 'domestic-pep', label: 'Domestic PEP', color: 'amber' },
                    { value: 'foreign-pep', label: 'Foreign PEP', color: 'red' },
                    { value: 'io-pep', label: 'International Organisation PEP', color: 'orange' },
                    { value: 'family-associate', label: 'Family Member / Associate of PEP', color: 'purple' },
                    { value: 'senior-review', label: 'Send to Senior Review', color: 'blue' },
                    { value: 'more-info', label: 'Request More Information', color: 'gray' },
                  ].map((option) => (
                    <label key={option.value} className={`flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-white/5 ${
                      option.recommended ? 'border-green-400 bg-green-50' : 'border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="classification"
                        value={option.value}
                        defaultChecked={option.recommended}
                        className="w-4 h-4 text-blue-600 mt-0.5"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-white">{option.label}</p>
                        {option.recommended && (
                          <Badge className="mt-1 bg-green-600 text-white text-xs">AI Recommended</Badge>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label>Analyst Notes</Label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Optional notes about this decision..."
                ></textarea>
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
              
              <h2 className="text-3xl font-bold text-white mb-2">PEP Check Complete</h2>
              <p className="text-slate-300 mb-8">{formData.fullName} has been classified as NOT A PEP</p>

              <div className="max-w-2xl mx-auto space-y-4 mb-8">
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <div className="p-4 bg-[#0f172a] rounded-lg">
                    <p className="text-xs text-slate-300">Result</p>
                    <p className="font-semibold text-white">Not a PEP</p>
                  </div>
                  <div className="p-4 bg-[#0f172a] rounded-lg">
                    <p className="text-xs text-slate-300">Date of Check</p>
                    <p className="font-semibold text-white">{new Date().toLocaleDateString('en-AU')}</p>
                  </div>
                  <div className="p-4 bg-[#0f172a] rounded-lg">
                    <p className="text-xs text-slate-300">Sources Searched</p>
                    <p className="font-semibold text-white">18 official sources</p>
                  </div>
                  <div className="p-4 bg-[#0f172a] rounded-lg">
                    <p className="text-xs text-slate-300">Reviewer</p>
                    <p className="font-semibold text-white">Current User</p>
                  </div>
                  <div className="p-4 bg-[#0f172a] rounded-lg">
                    <p className="text-xs text-slate-300">Final Risk Impact</p>
                    <p className="font-semibold text-green-600">Low Risk</p>
                  </div>
                  <div className="p-4 bg-[#0f172a] rounded-lg">
                    <p className="text-xs text-slate-300">Next Review Date</p>
                    <p className="font-semibold text-white">{new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('en-AU')}</p>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-left">
                  <div className="flex items-start gap-2">
                    <Calendar className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-purple-900">Automated Monthly Monitoring Enabled</p>
                      <p className="text-sm text-purple-700 mt-1">
                        This person will be automatically rescreened monthly to detect if they become a PEP during the relationship.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <Button onClick={onBack} className="bg-blue-600 hover:bg-blue-700">
                  Return to Dashboard
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Evidence Pack
                </Button>
                <Button variant="outline" onClick={() => setStep(1)}>
                  Screen Another Person
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Screen 3: Monthly Rescreening Queue
function MonthlyRescreeningQueue({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="bg-[#1e293b] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <Button onClick={onBack} variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-2xl font-bold text-white">Monthly PEP Rescreening Scheduler</h1>
          <p className="text-slate-300">Automated ongoing monitoring for existing clients</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {[
            { title: 'Due Today', count: 23, color: 'red' },
            { title: 'Due This Week', count: 147, color: 'amber' },
            { title: 'Overdue', count: 12, color: 'red' }
          ].map((section, idx) => (
            <Card key={idx} className="border-2">
              <CardHeader className={`bg-${section.color}-50`}>
                <CardTitle className="flex items-center justify-between">
                  <span>{section.title}</span>
                  <Badge className={`bg-${section.color}-600 text-white`}>{section.count}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm text-slate-300">Click to review and process</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6 border-2">
          <CardHeader>
            <CardTitle>Scheduler Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Default Frequency</Label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option>Monthly (30 days)</option>
                  <option>Quarterly (90 days)</option>
                  <option>Annually (365 days)</option>
                </select>
              </div>
              <div>
                <Label>High-Risk Clients</Label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option>Weekly (7 days)</option>
                  <option>Daily</option>
                  <option>Real-time</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <p className="font-semibold text-white">Automated Triggers</p>
              {[
                'Trigger rescan on role change',
                'Trigger rescan on ownership change',
                'Trigger rescan on adverse media hit',
                'Trigger rescan on sanctions hit',
                'Trigger rescan on new country exposure',
                'Enhanced monitoring for foreign PEPs'
              ].map((trigger, idx) => (
                <label key={idx} className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                  <span className="text-sm text-slate-300">{trigger}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Screen 4: Search Results Review Workbench
function SearchResultsWorkbench({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="bg-[#1e293b] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <Button onClick={onBack} variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-2xl font-bold text-white">Search Results Review Workbench</h1>
          <p className="text-slate-300">Analyst review of possible PEP matches</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Search Result Clusters */}
          <Card className="lg:col-span-1 border-2">
            <CardHeader>
              <CardTitle>Match Clusters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { type: 'Exact Match', count: 0, color: 'red' },
                { type: 'Probable Match', count: 2, color: 'amber' },
                { type: 'Weak Match', count: 5, color: 'gray' },
                { type: 'Historic Office', count: 1, color: 'blue' },
                { type: 'Family/Associate', count: 0, color: 'purple' }
              ].map((cluster, idx) => (
                <div key={idx} className={`p-3 bg-${cluster.color}-50 border border-${cluster.color}-200 rounded-lg`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">{cluster.type}</span>
                    <Badge className={`bg-${cluster.color}-600 text-white`}>{cluster.count}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Centre Panel - Entity Resolution */}
          <Card className="lg:col-span-2 border-2">
            <CardHeader>
              <CardTitle>Entity Resolution Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300">Select a match cluster to view resolution details</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

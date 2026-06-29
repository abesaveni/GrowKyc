import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Target,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Phone,
  Mail,
  MapPin,
  Tag,
  Calendar,
  TrendingUp,
  User,
  Building2,
  Globe,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  X,
  Edit,
  MessageSquare,
  FileText,
  Send,
  Zap,
  Award,
  ArrowRight,
  BarChart3,
  Activity
} from 'lucide-react';

interface LeadsModuleProps {
  role: string;
}

export function LeadsModule({ role }: any) {
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [notification, setNotification] = useState<string>('');

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const mockLeads = [
    {
      id: 'L-001',
      name: 'Maria Garcia',
      email: 'maria@techstart.io',
      phone: '+1 (555) 234-5678',
      company: 'TechStart Inc',
      position: 'VP Marketing',
      source: 'Website Form',
      status: 'new',
      score: 85,
      temperature: 'hot',
      estimatedValue: 35000,
      lastActivity: '5 minutes ago',
      assignedTo: 'Jessica Martinez',
      tags: ['Enterprise', 'Software']
    },
    {
      id: 'L-002',
      name: 'David Thompson',
      email: 'dthompson@growth.com',
      phone: '+1 (555) 345-6789',
      company: 'Growth Partners',
      position: 'CEO',
      source: 'LinkedIn',
      status: 'contacted',
      score: 92,
      temperature: 'hot',
      estimatedValue: 75000,
      lastActivity: '2 hours ago',
      assignedTo: 'Michael Brown',
      tags: ['Hot Lead', 'Consulting']
    },
    {
      id: 'L-003',
      name: 'Jennifer Lee',
      email: 'jlee@innovate.co',
      phone: '+1 (555) 456-7890',
      company: 'Innovate Co',
      position: 'Operations Director',
      source: 'Referral',
      status: 'qualified',
      score: 78,
      temperature: 'warm',
      estimatedValue: 45000,
      lastActivity: '1 day ago',
      assignedTo: 'Jessica Martinez',
      tags: ['Qualified', 'Mid-Market']
    },
    {
      id: 'L-004',
      name: 'Robert Chen',
      email: 'rchen@future.ai',
      phone: '+1 (555) 567-8901',
      company: 'Future AI Labs',
      position: 'CTO',
      source: 'Webinar',
      status: 'nurturing',
      score: 65,
      temperature: 'warm',
      estimatedValue: 28000,
      lastActivity: '3 days ago',
      assignedTo: 'Sarah Wilson',
      tags: ['Technical', 'AI/ML']
    },
    {
      id: 'L-005',
      name: 'Amanda Rodriguez',
      email: 'arodriguez@scale.com',
      phone: '+1 (555) 678-9012',
      company: 'Scale Solutions',
      position: 'Founder',
      source: 'Cold Email',
      status: 'new',
      score: 42,
      temperature: 'cold',
      estimatedValue: 15000,
      lastActivity: '1 week ago',
      assignedTo: 'Michael Brown',
      tags: ['StartUp', 'SMB']
    }
  ];

  const leadStages = [
    { id: 'new', label: 'New Leads', color: 'blue', icon: Star },
    { id: 'contacted', label: 'Contacted', color: 'purple', icon: Phone },
    { id: 'qualified', label: 'Qualified', color: 'indigo', icon: CheckCircle },
    { id: 'nurturing', label: 'Nurturing', color: 'orange', icon: Clock }
  ];

  if (viewMode === 'board') {
    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Lead Management</h1>
            <p className="text-slate-300 mt-1">Track and nurture leads through your sales funnel</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setViewMode('list')}>
              <BarChart3 className="w-4 h-4 mr-2" />
              List View
            </Button>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => setShowNewLeadModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Lead
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white border border-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-300">Total Leads</p>
              <Target className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-slate-100">{mockLeads.length}</p>
            <p className="text-xs text-green-400 mt-1">+12% this week</p>
          </div>

          <div className="bg-white border border-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-300">Hot Leads</p>
              <TrendingUp className="w-4 h-4 text-red-400" />
            </div>
            <p className="text-2xl font-bold text-slate-100">
              {mockLeads.filter(l => l.temperature === 'hot').length}
            </p>
            <p className="text-xs text-slate-400 mt-1">Needs immediate action</p>
          </div>

          <div className="bg-white border border-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-300">Avg. Lead Score</p>
              <Award className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-slate-100">
              {Math.round(mockLeads.reduce((sum, l) => sum + l.score, 0) / mockLeads.length)}
            </p>
            <p className="text-xs text-slate-400 mt-1">Quality metric</p>
          </div>

          <div className="bg-white border border-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-300">Pipeline Value</p>
              <BarChart3 className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-slate-100">
              ${(mockLeads.reduce((sum, l) => sum + l.estimatedValue, 0) / 1000).toFixed(0)}K
            </p>
            <p className="text-xs text-slate-400 mt-1">Total estimated</p>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-4 gap-4">
          {leadStages.map((stage) => {
            const stageLeads = mockLeads.filter(l => l.status === stage.id);
            const StageIcon = stage.icon;
            
            return (
              <div key={stage.id} className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <StageIcon className={`w-4 h-4 text-${stage.color}-600`} />
                    <h3 className="font-semibold text-slate-100">{stage.label}</h3>
                  </div>
                  <span className="px-2 py-1 bg-white rounded-full text-xs font-semibold text-slate-300">
                    {stageLeads.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => {
                        setSelectedLead(lead);
                        setShowDetailModal(true);
                      }}
                      className="bg-white border border-white/10 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                    >
                      {/* Temperature Indicator */}
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          lead.temperature === 'hot' ? 'bg-red-500/15 text-red-300' :
                          lead.temperature === 'warm' ? 'bg-yellow-500/15 text-yellow-300' :
                          'bg-blue-500/15 text-blue-300'
                        }`}>
                          {lead.temperature.toUpperCase()}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs font-semibold text-slate-300">{lead.score}</span>
                        </div>
                      </div>

                      {/* Lead Info */}
                      <div className="mb-3">
                        <p className="font-semibold text-slate-100 mb-1">{lead.name}</p>
                        <p className="text-xs text-slate-300">{lead.position}</p>
                        <p className="text-xs text-slate-400">{lead.company}</p>
                      </div>

                      {/* Value */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-slate-400">Est. Value</span>
                        <span className="text-sm font-bold text-slate-100">
                          ${(lead.estimatedValue / 1000).toFixed(0)}K
                        </span>
                      </div>

                      {/* Source & Activity */}
                      <div className="flex items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-3">
                        <span>{lead.source}</span>
                        <span>{lead.lastActivity}</span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {lead.tags.slice(0, 2).map((tag, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-indigo-500/10 text-indigo-300 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Lead Detail Modal */}
        {showDetailModal && selectedLead && (
          <LeadDetailModal
            lead={selectedLead}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedLead(null);
            }}
          />
        )}

        {/* New Lead Modal */}
        {showNewLeadModal && (
          <NewLeadModal
            onClose={() => setShowNewLeadModal(false)}
            onAddLead={(newLead: any) => {
              mockLeads.push(newLead);
              showNotification('Lead added successfully!');
              setShowNewLeadModal(false);
            }}
          />
        )}

        {/* Notification */}
        {notification && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow">
            {notification}
          </div>
        )}
      </div>
    );
  }

  // List View
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Lead Management</h1>
          <p className="text-slate-300 mt-1">Track and nurture leads through your sales funnel</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setViewMode('board')}>
            <Target className="w-4 h-4 mr-2" />
            Board View
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => setShowNewLeadModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Lead
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search leads..."
            className="pl-10 pr-4 py-2 w-full border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Leads Table */}
      <div className="bg-white border border-white/10 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Lead</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Company</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Score</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Source</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Value</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Assigned To</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {mockLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-white/5 cursor-pointer">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-slate-100">{lead.name}</p>
                    <p className="text-sm text-slate-400">{lead.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-slate-100">{lead.company}</p>
                    <p className="text-xs text-slate-400">{lead.position}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    lead.temperature === 'hot' ? 'bg-red-500/15 text-red-300' :
                    lead.temperature === 'warm' ? 'bg-yellow-500/15 text-yellow-300' :
                    'bg-blue-500/15 text-blue-300'
                  }`}>
                    {lead.temperature}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-white/10 rounded-full">
                      <div
                        className={`h-2 rounded-full ${
                          lead.score >= 80 ? 'bg-green-600' :
                          lead.score >= 60 ? 'bg-yellow-600' : 'bg-orange-600'
                        }`}
                        style={{ width: `${lead.score}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-100">{lead.score}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-100">{lead.source}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-slate-100">${lead.estimatedValue.toLocaleString()}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-100">{lead.assignedTo}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Lead Detail Modal
function LeadDetailModal({ lead, onClose }: any) {
  const [activeTab, setActiveTab] = useState<'info' | 'activity' | 'scoring'>('info');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-white/10 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-500/15 flex items-center justify-center">
              <span className="text-lg font-bold text-indigo-400">
                {lead.name.split(' ').map((n: string) => n[0]).join('')}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">{lead.name}</h2>
              <p className="text-sm text-slate-300">{lead.position} at {lead.company}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-slate-300">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-white/10 flex">
          {[
            { id: 'info', label: 'Information' },
            { id: 'activity', label: 'Activity' },
            { id: 'scoring', label: 'Lead Scoring' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-4 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-400 font-medium'
                  : 'border-transparent text-slate-300 hover:text-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* Contact Info */}
              <div>
                <h3 className="font-semibold text-slate-100 mb-4">Contact Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <Mail className="w-4 h-4 text-slate-300" />
                    <div>
                      <p className="text-xs text-slate-400">Email</p>
                      <p className="text-sm font-medium text-slate-100">{lead.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <Phone className="w-4 h-4 text-slate-300" />
                    <div>
                      <p className="text-xs text-slate-400">Phone</p>
                      <p className="text-sm font-medium text-slate-100">{lead.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <Building2 className="w-4 h-4 text-slate-300" />
                    <div>
                      <p className="text-xs text-slate-400">Company</p>
                      <p className="text-sm font-medium text-slate-100">{lead.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <Globe className="w-4 h-4 text-slate-300" />
                    <div>
                      <p className="text-xs text-slate-400">Source</p>
                      <p className="text-sm font-medium text-slate-100">{lead.source}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="font-semibold text-slate-100 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-3 gap-3">
                  <Button variant="outline">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                  <Button variant="outline">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Lead
                  </Button>
                  <Button variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule
                  </Button>
                  <Button variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Add Note
                  </Button>
                  <Button variant="outline">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Convert to Deal
                  </Button>
                  <Button variant="outline">
                    <X className="w-4 h-4 mr-2" />
                    Disqualify
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-4">
              {[
                { type: 'form', title: 'Lead captured', content: `Submitted form on pricing page`, time: lead.lastActivity },
                { type: 'email', title: 'Welcome email sent', content: 'Automated sequence started', time: '6 hours ago' },
                { type: 'score', title: 'Lead score updated', content: `Score increased to ${lead.score}`, time: '1 day ago' }
              ].map((activity, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 border border-white/10 rounded-lg">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'form' ? 'bg-blue-500/15' :
                    activity.type === 'email' ? 'bg-purple-500/15' : 'bg-green-500/15'
                  }`}>
                    {activity.type === 'form' && <Target className="w-5 h-5 text-blue-400" />}
                    {activity.type === 'email' && <Mail className="w-5 h-5 text-purple-400" />}
                    {activity.type === 'score' && <Star className="w-5 h-5 text-green-400" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-slate-100">{activity.title}</p>
                      <p className="text-xs text-slate-400">{activity.time}</p>
                    </div>
                    <p className="text-sm text-slate-300">{activity.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'scoring' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                <div>
                  <p className="text-sm text-slate-300 mb-1">Overall Lead Score</p>
                  <p className="text-4xl font-bold text-indigo-400">{lead.score}</p>
                </div>
                <div className={`px-4 py-2 rounded-lg text-lg font-bold ${
                  lead.temperature === 'hot' ? 'bg-red-500/15 text-red-300' :
                  lead.temperature === 'warm' ? 'bg-yellow-500/15 text-yellow-300' :
                  'bg-blue-500/15 text-blue-300'
                }`}>
                  {lead.temperature.toUpperCase()}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-100 mb-4">Scoring Factors</h3>
                <div className="space-y-3">
                  {[
                    { factor: 'Company Size', score: 25, max: 30 },
                    { factor: 'Job Title', score: 20, max: 25 },
                    { factor: 'Engagement', score: 18, max: 20 },
                    { factor: 'Budget Authority', score: 15, max: 15 },
                    { factor: 'Timeline', score: 7, max: 10 }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">{item.factor}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-white/10 rounded-full">
                          <div
                            className="h-2 bg-indigo-600 rounded-full"
                            style={{ width: `${(item.score / item.max) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-slate-100 w-12 text-right">
                          {item.score}/{item.max}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white/5 border-t border-white/10 p-6 flex items-center justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit Lead
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <ArrowRight className="w-4 h-4 mr-2" />
              Convert to Deal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// New Lead Modal
function NewLeadModal({ onClose, onAddLead }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [source, setSource] = useState('Website Form');
  const [status, setStatus] = useState('new');
  const [score, setScore] = useState(50);
  const [temperature, setTemperature] = useState('warm');
  const [estimatedValue, setEstimatedValue] = useState(25000);
  const [assignedTo, setAssignedTo] = useState('Jessica Martinez');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLead = {
      id: `L-${Date.now().toString().slice(-3)}`,
      name,
      email,
      phone,
      company,
      position,
      source,
      status,
      score,
      temperature,
      estimatedValue,
      lastActivity: 'Just now',
      assignedTo,
      tags: [] as string[]
    };
    onAddLead(newLead);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-white/10 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-100">Add New Lead</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-slate-300">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full border border-white/10 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border border-white/10 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 block w-full border border-white/10 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Company</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="mt-1 block w-full border border-white/10 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Position</label>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="mt-1 block w-full border border-white/10 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Source</label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="mt-1 block w-full border border-white/10 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 block w-full border border-white/10 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="nurturing">Nurturing</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Score</label>
              <input
                type="number"
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="mt-1 block w-full border border-white/10 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Temperature</label>
              <select
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                className="mt-1 block w-full border border-white/10 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="hot">Hot</option>
                <option value="warm">Warm</option>
                <option value="cold">Cold</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Estimated Value</label>
              <input
                type="number"
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(Number(e.target.value))}
                className="mt-1 block w-full border border-white/10 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Assigned To</label>
              <input
                type="text"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="mt-1 block w-full border border-white/10 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white ml-3" type="submit">
              Add Lead
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
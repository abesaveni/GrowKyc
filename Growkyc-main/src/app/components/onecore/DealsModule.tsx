import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Target,
  Plus,
  Filter,
  Download,
  TrendingUp,
  DollarSign,
  Calendar,
  User,
  Building2,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  ArrowRight,
  Percent,
  Activity,
  FileText,
  X,
  Search
} from 'lucide-react';

export function DealsModule({ role }: any) {
  const [viewMode, setViewMode] = useState<'pipeline' | 'list' | 'forecast'>('pipeline');
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [showDealModal, setShowDealModal] = useState(false);

  const mockStages = [
    { id: 'lead', name: 'Lead', deals: 45, value: 450000, color: 'gray', probability: 10 },
    { id: 'qualified', name: 'Qualified', deals: 32, value: 1200000, color: 'blue', probability: 25 },
    { id: 'proposal', name: 'Proposal', deals: 18, value: 1800000, color: 'indigo', probability: 50 },
    { id: 'negotiation', name: 'Negotiation', deals: 12, value: 980000, color: 'purple', probability: 75 },
    { id: 'closed-won', name: 'Closed Won', deals: 8, value: 640000, color: 'green', probability: 100 }
  ];

  const mockDeals = [
    {
      id: 'DEAL-001',
      name: 'Enterprise Software License',
      company: 'Acme Corporation',
      value: 85000,
      stage: 'proposal',
      probability: 50,
      owner: 'Sarah Chen',
      closeDate: '2024-03-15',
      lastActivity: '2 hours ago',
      contactName: 'John Smith',
      contactEmail: 'john@acme.com',
      tags: ['Enterprise', 'Hot']
    },
    {
      id: 'DEAL-002',
      name: 'Cloud Migration Services',
      company: 'Beta Solutions',
      value: 125000,
      stage: 'negotiation',
      probability: 75,
      owner: 'Michael Brown',
      closeDate: '2024-03-20',
      lastActivity: '1 day ago',
      contactName: 'Jane Doe',
      contactEmail: 'jane@beta.com',
      tags: ['Cloud', 'Services']
    },
    {
      id: 'DEAL-003',
      name: 'Marketing Automation Platform',
      company: 'Gamma Industries',
      value: 45000,
      stage: 'qualified',
      probability: 25,
      owner: 'Emily Davis',
      closeDate: '2024-04-10',
      lastActivity: '3 hours ago',
      contactName: 'Bob Wilson',
      contactEmail: 'bob@gamma.com',
      tags: ['Marketing']
    }
  ];

  const totalPipelineValue = mockStages.reduce((sum, stage) => sum + stage.value, 0);
  const weightedForecast = mockStages.reduce((sum, stage) => sum + (stage.value * stage.probability / 100), 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Sales Pipeline</h1>
          <p className="text-slate-300 mt-1">Manage deals, forecast revenue, and track progress</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => setShowDealModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Deal
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-white/10 rounded-lg p-4">
          <p className="text-sm text-slate-300 mb-1">Total Pipeline</p>
          <p className="text-2xl font-bold text-slate-100">${(totalPipelineValue / 1000000).toFixed(2)}M</p>
          <p className="text-xs text-slate-400 mt-1">Across {mockStages.reduce((sum, s) => sum + s.deals, 0)} deals</p>
        </div>

        <div className="bg-white border border-white/10 rounded-lg p-4">
          <p className="text-sm text-slate-300 mb-1">Weighted Forecast</p>
          <p className="text-2xl font-bold text-green-400">${(weightedForecast / 1000000).toFixed(2)}M</p>
          <p className="text-xs text-slate-400 mt-1">Expected close value</p>
        </div>

        <div className="bg-white border border-white/10 rounded-lg p-4">
          <p className="text-sm text-slate-300 mb-1">Avg Deal Size</p>
          <p className="text-2xl font-bold text-slate-100">${(totalPipelineValue / mockStages.reduce((sum, s) => sum + s.deals, 0) / 1000).toFixed(0)}K</p>
          <p className="text-xs text-slate-400 mt-1">Per opportunity</p>
        </div>

        <div className="bg-white border border-white/10 rounded-lg p-4">
          <p className="text-sm text-slate-300 mb-1">Close Rate</p>
          <p className="text-2xl font-bold text-slate-100">32%</p>
          <p className="text-xs text-green-400 mt-1">+4% vs last month</p>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="bg-white border border-white/10 rounded-lg overflow-hidden">
        <div className="flex border-b border-white/10">
          {[
            { id: 'pipeline', label: 'Pipeline View', icon: Target },
            { id: 'list', label: 'List View', icon: FileText },
            { id: 'forecast', label: 'Forecast', icon: TrendingUp }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                  viewMode === tab.id
                    ? 'border-indigo-600 text-indigo-400 font-medium bg-indigo-500/10'
                    : 'border-transparent text-slate-300 hover:text-slate-100 hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {viewMode === 'pipeline' && <PipelineView stages={mockStages} deals={mockDeals} onSelectDeal={setSelectedDeal} />}
          {viewMode === 'list' && <ListView deals={mockDeals} onSelectDeal={setSelectedDeal} />}
          {viewMode === 'forecast' && <ForecastView stages={mockStages} />}
        </div>
      </div>

      {/* Deal Modal */}
      {showDealModal && (
        <DealModal onClose={() => setShowDealModal(false)} />
      )}

      {/* Deal Detail Sidebar */}
      {selectedDeal && (
        <DealDetailSidebar deal={selectedDeal} onClose={() => setSelectedDeal(null)} />
      )}
    </div>
  );
}

// Pipeline View with Kanban
function PipelineView({ stages, deals, onSelectDeal }: any) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {stages.map((stage: any) => (
        <div key={stage.id} className="flex-shrink-0 w-80">
          <div className={`bg-${stage.color}-50 border border-${stage.color}-300 rounded-t-lg p-4`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-slate-100">{stage.name}</h3>
              <span className="px-2 py-1 bg-white rounded text-xs font-medium text-slate-300">
                {stage.deals}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <p className="text-slate-300">${(stage.value / 1000).toFixed(0)}K</p>
              <p className="text-slate-300">{stage.probability}% prob</p>
            </div>
          </div>

          <div className="space-y-3 p-3 bg-white/5 rounded-b-lg border border-t-0 border-white/10 min-h-[400px]">
            {deals
              .filter((d: any) => d.stage === stage.id)
              .map((deal: any) => (
                <div
                  key={deal.id}
                  className="bg-white border border-white/10 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onSelectDeal(deal)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-slate-100 text-sm">{deal.name}</h4>
                    <span className="text-xs font-bold text-green-400">${(deal.value / 1000).toFixed(0)}K</span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3 h-3" />
                      <span>{deal.company}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3" />
                      <span>{deal.contactName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>Close: {deal.closeDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
                    <div className="flex-1 bg-white/10 rounded-full h-1.5">
                      <div
                        className="bg-indigo-600 h-1.5 rounded-full"
                        style={{ width: `${deal.probability}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-300">{deal.probability}%</span>
                  </div>

                  {deal.tags && (
                    <div className="flex gap-1 mt-2">
                      {deal.tags.map((tag: string) => (
                        <span key={tag} className="px-2 py-0.5 bg-indigo-500/15 text-indigo-300 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// List View
function ListView({ deals, onSelectDeal }: any) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-white/5 border-b border-white/10">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Deal Name</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Company</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Value</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Stage</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Probability</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Close Date</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Owner</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {deals.map((deal: any) => (
            <tr key={deal.id} className="hover:bg-white/5 cursor-pointer" onClick={() => onSelectDeal(deal)}>
              <td className="px-4 py-3">
                <p className="font-medium text-slate-100">{deal.name}</p>
                <p className="text-xs text-slate-400">{deal.id}</p>
              </td>
              <td className="px-4 py-3 text-sm text-slate-100">{deal.company}</td>
              <td className="px-4 py-3">
                <p className="font-semibold text-slate-100">${deal.value.toLocaleString()}</p>
              </td>
              <td className="px-4 py-3">
                <span className="px-2 py-1 bg-indigo-500/15 text-indigo-300 rounded text-xs font-medium capitalize">
                  {deal.stage.replace('-', ' ')}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1 w-20 bg-white/10 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${deal.probability}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-100">{deal.probability}%</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-slate-100">{deal.closeDate}</td>
              <td className="px-4 py-3 text-sm text-slate-100">{deal.owner}</td>
              <td className="px-4 py-3">
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Forecast View
function ForecastView({ stages }: any) {
  const totalPipeline = stages.reduce((sum: number, s: any) => sum + s.value, 0);
  const weightedForecast = stages.reduce((sum: number, s: any) => sum + (s.value * s.probability / 100), 0);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
          <p className="text-sm text-blue-400 mb-1">Total Pipeline</p>
          <p className="text-3xl font-bold text-blue-300">${(totalPipeline / 1000000).toFixed(2)}M</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
          <p className="text-sm text-green-400 mb-1">Weighted Forecast</p>
          <p className="text-3xl font-bold text-green-300">${(weightedForecast / 1000000).toFixed(2)}M</p>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6">
          <p className="text-sm text-purple-400 mb-1">Expected Close Rate</p>
          <p className="text-3xl font-bold text-purple-300">35%</p>
        </div>
      </div>

      {/* Forecast Breakdown */}
      <div className="bg-white border border-white/10 rounded-lg p-6">
        <h3 className="font-semibold text-slate-100 mb-4">Forecast by Stage</h3>
        <div className="space-y-3">
          {stages.map((stage: any) => {
            const weighted = stage.value * stage.probability / 100;
            return (
              <div key={stage.id} className="flex items-center gap-4">
                <div className="w-32">
                  <p className="text-sm font-medium text-slate-100">{stage.name}</p>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-white/10 rounded-full h-6">
                      <div
                        className={`h-6 rounded-full bg-${stage.color}-600 flex items-center justify-end pr-2`}
                        style={{ width: `${(weighted / weightedForecast) * 100}%` }}
                      >
                        <span className="text-xs font-medium text-white">
                          ${(weighted / 1000).toFixed(0)}K
                        </span>
                      </div>
                    </div>
                    <div className="w-24 text-right">
                      <p className="text-sm font-medium text-slate-100">${(stage.value / 1000).toFixed(0)}K</p>
                      <p className="text-xs text-slate-400">{stage.deals} deals</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Deal Modal
function DealModal({ onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-100">Create New Deal</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-slate-300">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Deal Name</label>
            <input
              type="text"
              placeholder="e.g. Enterprise Software License"
              className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Company</label>
              <select className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Select company...</option>
                <option>Acme Corporation</option>
                <option>Beta Solutions</option>
                <option>Gamma Industries</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Deal Value</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  placeholder="0"
                  className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Pipeline Stage</label>
              <select className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Lead</option>
                <option>Qualified</option>
                <option>Proposal</option>
                <option>Negotiation</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Expected Close Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Assign To</label>
            <select className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Select owner...</option>
              <option>Sarah Chen</option>
              <option>Michael Brown</option>
              <option>Emily Davis</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
            <textarea
              rows={4}
              placeholder="Add deal details..."
              className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="p-6 border-t border-white/10 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <CheckCircle className="w-4 h-4 mr-2" />
            Create Deal
          </Button>
        </div>
      </div>
    </div>
  );
}

// Deal Detail Sidebar
function DealDetailSidebar({ deal, onClose }: any) {
  return (
    <div className="fixed right-0 top-0 h-full w-[500px] bg-white border-l border-white/10 shadow-2xl z-50 overflow-y-auto">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-100">{deal.name}</h2>
            <p className="text-sm text-slate-300 mt-1">{deal.id} • {deal.company}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <span className="px-3 py-1 bg-indigo-500/15 text-indigo-300 rounded-full text-sm font-medium capitalize">
            {deal.stage.replace('-', ' ')}
          </span>
          <span className="px-3 py-1 bg-green-500/15 text-green-300 rounded-full text-sm font-medium">
            ${deal.value.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Key Details */}
        <div>
          <h3 className="font-semibold text-slate-100 mb-3">Key Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="text-sm text-slate-300">Probability</span>
              <span className="text-sm font-medium text-slate-100">{deal.probability}%</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="text-sm text-slate-300">Owner</span>
              <span className="text-sm font-medium text-slate-100">{deal.owner}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="text-sm text-slate-300">Close Date</span>
              <span className="text-sm font-medium text-slate-100">{deal.closeDate}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="text-sm text-slate-300">Last Activity</span>
              <span className="text-sm font-medium text-slate-100">{deal.lastActivity}</span>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-semibold text-slate-100 mb-3">Primary Contact</h3>
          <div className="p-4 bg-white/5 rounded-lg">
            <p className="font-medium text-slate-100">{deal.contactName}</p>
            <p className="text-sm text-slate-300 mt-1">{deal.contactEmail}</p>
            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="outline">
                <Phone className="w-3 h-3 mr-1" />
                Call
              </Button>
              <Button size="sm" variant="outline">
                <Mail className="w-3 h-3 mr-1" />
                Email
              </Button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
            <Edit className="w-4 h-4 mr-2" />
            Edit Deal
          </Button>
          <Button variant="outline" className="w-full">
            <FileText className="w-4 h-4 mr-2" />
            Generate Proposal
          </Button>
          <Button variant="outline" className="w-full">
            <Activity className="w-4 h-4 mr-2" />
            Log Activity
          </Button>
        </div>
      </div>
    </div>
  );
}

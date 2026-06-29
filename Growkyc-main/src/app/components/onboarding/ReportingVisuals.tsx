// Reporting & Visuals - Blueprint diagrams and visual meeting packets
import React, { useState } from 'react';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  FileText,
  Download,
  Share2,
  Eye,
  Edit,
  Copy,
  Plus,
  Layers,
  Users,
  Building2,
  Target,
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Briefcase,
  Network
} from 'lucide-react';
import { toast } from 'sonner';

interface Blueprint {
  id: string;
  name: string;
  type: 'entity-structure' | 'trust-diagram' | 'group-structure' | 'ownership-chart';
  client: string;
  lastUpdated: string;
  entities: number;
}

interface MeetingPacket {
  id: string;
  title: string;
  client: string;
  date: string;
  type: 'quarterly-review' | 'tax-planning' | 'annual-review' | 'advisory';
  status: 'draft' | 'ready' | 'sent';
  pages: number;
}

export function ReportingVisuals() {
  const [activeTab, setActiveTab] = useState<'blueprints' | 'packets' | 'dashboards' | 'templates'>('blueprints');
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(null);
  const [selectedPacket, setSelectedPacket] = useState<MeetingPacket | null>(null);

  const [blueprints] = useState<Blueprint[]>([
    {
      id: 'bp-001',
      name: 'Acme Group Structure',
      type: 'group-structure',
      client: 'Acme Pty Ltd',
      lastUpdated: '2024-02-15',
      entities: 5
    },
    {
      id: 'bp-002',
      name: 'Smith Family Trust Diagram',
      type: 'trust-diagram',
      client: 'Smith Family Trust',
      lastUpdated: '2024-02-10',
      entities: 3
    },
    {
      id: 'bp-003',
      name: 'Jones SMSF Structure',
      type: 'entity-structure',
      client: 'Jones Superannuation Fund',
      lastUpdated: '2024-02-18',
      entities: 2
    },
    {
      id: 'bp-004',
      name: 'Brown Holdings Ownership',
      type: 'ownership-chart',
      client: 'Brown Holdings Pty Ltd',
      lastUpdated: '2024-02-12',
      entities: 8
    }
  ]);

  const [meetingPackets] = useState<MeetingPacket[]>([
    {
      id: 'mp-001',
      title: 'Q1 2024 Business Review',
      client: 'Acme Pty Ltd',
      date: '2024-03-15',
      type: 'quarterly-review',
      status: 'ready',
      pages: 12
    },
    {
      id: 'mp-002',
      title: 'FY2024 Tax Planning Session',
      client: 'Smith Family Trust',
      date: '2024-03-20',
      type: 'tax-planning',
      status: 'draft',
      pages: 8
    },
    {
      id: 'mp-003',
      title: 'Annual Review Meeting Pack',
      client: 'Jones Superannuation Fund',
      date: '2024-03-10',
      type: 'annual-review',
      status: 'sent',
      pages: 15
    },
    {
      id: 'mp-004',
      title: 'Strategic Advisory Session',
      client: 'Brown Holdings Pty Ltd',
      date: '2024-03-25',
      type: 'advisory',
      status: 'draft',
      pages: 10
    }
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'entity-structure': return Building2;
      case 'trust-diagram': return Users;
      case 'group-structure': return Network;
      case 'ownership-chart': return Layers;
      case 'quarterly-review': return Calendar;
      case 'tax-planning': return Target;
      case 'annual-review': return BarChart3;
      case 'advisory': return Briefcase;
      default: return FileText;
    }
  };

  const getTypeLabel = (type: string) => {
    return type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const getStatusBadge = (status: string) => {
    const config = {
      draft: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Draft' },
      ready: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Ready' },
      sent: { bg: 'bg-green-100', text: 'text-green-700', label: 'Sent' }
    };
    const { bg, text, label } = config[status as keyof typeof config] || config.draft;
    return <span className={`px-3 py-1 rounded-full text-xs font-bold ${bg} ${text}`}>{label}</span>;
  };

  const renderBlueprints = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Entity Blueprint Diagrams</h3>
          <p className="text-gray-600">Visual representations of entity structures and relationships</p>
        </div>
        <button
          onClick={() => toast.info('Create new blueprint')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          <Plus className="w-5 h-5" />
          New Blueprint
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Blueprints</span>
            <Network className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{blueprints.length}</p>
        </div>
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Group Structures</span>
            <Layers className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {blueprints.filter(b => b.type === 'group-structure').length}
          </p>
        </div>
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Trust Diagrams</span>
            <Users className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {blueprints.filter(b => b.type === 'trust-diagram').length}
          </p>
        </div>
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Entities</span>
            <Building2 className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {blueprints.reduce((sum, b) => sum + b.entities, 0)}
          </p>
        </div>
      </div>

      {/* Blueprint Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blueprints.map((blueprint) => {
          const Icon = getTypeIcon(blueprint.type);
          return (
            <div key={blueprint.id} className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1">{blueprint.name}</h4>
                    <p className="text-sm text-gray-600">{blueprint.client}</p>
                  </div>
                </div>
              </div>

              {/* Blueprint Preview */}
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4 min-h-[200px] flex items-center justify-center">
                <div className="text-center">
                  <Network className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">{getTypeLabel(blueprint.type)}</p>
                  <p className="text-xs text-gray-500 mt-1">{blueprint.entities} entities</p>
                </div>
              </div>

              {/* Metadata */}
              <div className="flex items-center gap-4 mb-4 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" />
                  {getTypeLabel(blueprint.type)}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Updated {new Date(blueprint.lastUpdated).toLocaleDateString('en-AU')}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedBlueprint(blueprint)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm">
                  <Download className="w-4 h-4" />
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderMeetingPackets = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Visual Meeting Packets</h3>
          <p className="text-gray-600">Professional presentation materials for client meetings</p>
        </div>
        <button
          onClick={() => toast.info('Create new meeting packet')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          <Plus className="w-5 h-5" />
          New Packet
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Packets</span>
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{meetingPackets.length}</p>
        </div>
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Ready to Send</span>
            <Target className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {meetingPackets.filter(p => p.status === 'ready').length}
          </p>
        </div>
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Draft</span>
            <Edit className="w-5 h-5 text-gray-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {meetingPackets.filter(p => p.status === 'draft').length}
          </p>
        </div>
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Sent</span>
            <Share2 className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {meetingPackets.filter(p => p.status === 'sent').length}
          </p>
        </div>
      </div>

      {/* Packets List */}
      <div className="grid grid-cols-1 gap-4">
        {meetingPackets.map((packet) => {
          const Icon = getTypeIcon(packet.type);
          return (
            <div key={packet.id} className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-gray-900">{packet.title}</h4>
                      {getStatusBadge(packet.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{packet.client}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(packet.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" />
                        {packet.pages} pages
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5" />
                        {getTypeLabel(packet.type)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedPacket(packet)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button className="px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderDashboards = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900">Client Dashboards</h3>
        <p className="text-gray-600">Real-time visual analytics for client performance</p>
      </div>

      {/* Example Dashboard */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <h4 className="font-bold text-gray-900 mb-4">Sample Client Dashboard</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-blue-700 font-semibold">Revenue</span>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-900">$2.4M</p>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <ArrowUpRight className="w-4 h-4 text-green-600" />
              <span className="text-green-600 font-semibold">12.5%</span>
              <span className="text-gray-600">vs last year</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-green-700 font-semibold">Profit Margin</span>
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-900">18.2%</p>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <ArrowUpRight className="w-4 h-4 text-green-600" />
              <span className="text-green-600 font-semibold">2.1%</span>
              <span className="text-gray-600">improvement</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-purple-700 font-semibold">Growth Rate</span>
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-900">24%</p>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <ArrowUpRight className="w-4 h-4 text-green-600" />
              <span className="text-green-600 font-semibold">8.5%</span>
              <span className="text-gray-600">YoY growth</span>
            </div>
          </div>
        </div>

        {/* Chart Placeholders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-2 border-gray-200 rounded-lg p-6 min-h-[250px] flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 font-semibold">Revenue Trend</p>
              <p className="text-xs text-gray-500">Monthly comparison</p>
            </div>
          </div>

          <div className="border-2 border-gray-200 rounded-lg p-6 min-h-[250px] flex items-center justify-center">
            <div className="text-center">
              <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 font-semibold">Expense Breakdown</p>
              <p className="text-xs text-gray-500">Category analysis</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900">Report Templates</h3>
        <p className="text-gray-600">Pre-designed templates for common reports and presentations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { name: 'Quarterly Business Review', icon: BarChart3, color: 'blue', slides: 12 },
          { name: 'Tax Planning Presentation', icon: Target, color: 'green', slides: 8 },
          { name: 'Annual Financial Summary', icon: FileText, color: 'purple', slides: 15 },
          { name: 'Strategic Advisory Pack', icon: Briefcase, color: 'orange', slides: 10 },
          { name: 'Entity Structure Report', icon: Network, color: 'indigo', slides: 6 },
          { name: 'Performance Dashboard', icon: TrendingUp, color: 'pink', slides: 9 }
        ].map((template, idx) => {
          const Icon = template.icon;
          return (
            <div key={idx} className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors cursor-pointer">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{template.name}</h4>
              <p className="text-sm text-gray-600 mb-4">{template.slides} slides included</p>
              <button
                onClick={() => toast.info(`Using template: ${template.name}`)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
              >
                <Copy className="w-4 h-4" />
                Use Template
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Reporting & Visuals</h2>
        <p className="text-gray-600">Create professional blueprints, dashboards, and meeting materials</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('blueprints')}
          className={`px-4 py-2 font-semibold transition-colors border-b-2 ${
            activeTab === 'blueprints'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Blueprint Diagrams
        </button>
        <button
          onClick={() => setActiveTab('packets')}
          className={`px-4 py-2 font-semibold transition-colors border-b-2 ${
            activeTab === 'packets'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Meeting Packets
        </button>
        <button
          onClick={() => setActiveTab('dashboards')}
          className={`px-4 py-2 font-semibold transition-colors border-b-2 ${
            activeTab === 'dashboards'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Dashboards
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 font-semibold transition-colors border-b-2 ${
            activeTab === 'templates'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Templates
        </button>
      </div>

      {/* Content */}
      {activeTab === 'blueprints' && renderBlueprints()}
      {activeTab === 'packets' && renderMeetingPackets()}
      {activeTab === 'dashboards' && renderDashboards()}
      {activeTab === 'templates' && renderTemplates()}

      {/* Blueprint Detail Modal */}
      {selectedBlueprint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedBlueprint.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedBlueprint.client}</p>
              </div>
              <button onClick={() => setSelectedBlueprint(null)}>
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* Large Blueprint Visualization */}
              <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-12 mb-6 min-h-[500px] flex items-center justify-center">
                <div className="text-center">
                  <Network className="w-32 h-32 text-gray-400 mx-auto mb-4" />
                  <p className="text-xl font-bold text-gray-900 mb-2">{getTypeLabel(selectedBlueprint.type)}</p>
                  <p className="text-gray-600">{selectedBlueprint.entities} entities in structure</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                  <Edit className="w-5 h-5" />
                  Edit Blueprint
                </button>
                <button className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                  <Download className="w-5 h-5" />
                </button>
                <button className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Meeting Packet Detail Modal */}
      {selectedPacket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedPacket.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedPacket.client}</p>
              </div>
              <button onClick={() => setSelectedPacket(null)}>
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* Packet Preview */}
              <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-12 mb-6 min-h-[500px] flex items-center justify-center">
                <div className="text-center">
                  <FileText className="w-32 h-32 text-gray-400 mx-auto mb-4" />
                  <p className="text-xl font-bold text-gray-900 mb-2">{selectedPacket.title}</p>
                  <p className="text-gray-600">{selectedPacket.pages} pages • {getTypeLabel(selectedPacket.type)}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                  <Share2 className="w-5 h-5" />
                  Send to Client
                </button>
                <button className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                  <Edit className="w-5 h-5" />
                </button>
                <button className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

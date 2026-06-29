import React, { useState } from 'react';
import { toast } from '../../lib/toast';
import { Button } from '../ui/button';
import {
  Users,
  Building2,
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
  FileText,
  Activity,
  BarChart3,
  Edit,
  Trash2,
  MoreVertical,
  Star,
  Globe,
  Briefcase,
  Clock,
  CheckCircle,
  MessageSquare,
  Eye,
  Send,
  X,
  ChevronRight,
  TrendingUp,
  DollarSign
} from 'lucide-react';

interface ContactsModuleProps {
  role: string;
}

export function ContactsModule({ role }: ContactsModuleProps) {
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'leads' | 'customers' | 'partners'>('all');
  const [showNewContactModal, setShowNewContactModal] = useState(false);

  const handleImport = () => {
    // Placeholder for import functionality
    toast.info('Import contacts functionality - CSV/Excel upload coming soon');
  };

  const handleExport = () => {
    // Placeholder for export functionality
    toast.info('Exporting contacts as CSV...');
  };

  const handleNewContact = () => {
    setShowNewContactModal(true);
  };

  const mockContacts = [
    {
      id: 'C-001',
      name: 'John Anderson',
      email: 'john.anderson@techcorp.com',
      phone: '+1 (555) 123-4567',
      company: 'TechCorp Solutions',
      position: 'CTO',
      status: 'customer',
      tags: ['Enterprise', 'Technical'],
      leadScore: 85,
      lastActivity: '2 hours ago',
      dealValue: 45000,
      lifetime: 120000
    },
    {
      id: 'C-002',
      name: 'Sarah Mitchell',
      email: 'sarah@innovate.io',
      phone: '+1 (555) 987-6543',
      company: 'Innovate Labs',
      position: 'CEO',
      status: 'leads',
      tags: ['Hot Lead', 'StartUp'],
      leadScore: 92,
      lastActivity: '1 day ago',
      dealValue: 25000,
      lifetime: 0
    },
    {
      id: 'C-003',
      name: 'Michael Chen',
      email: 'mchen@globaltech.com',
      phone: '+1 (555) 456-7890',
      company: 'Global Tech Inc',
      position: 'VP of Operations',
      status: 'customer',
      tags: ['Strategic', 'Renewal'],
      leadScore: 78,
      lastActivity: '3 hours ago',
      dealValue: 75000,
      lifetime: 250000
    },
    {
      id: 'C-004',
      name: 'Emily Rodriguez',
      email: 'emily.r@startupco.com',
      phone: '+1 (555) 234-5678',
      company: 'StartUp Co',
      position: 'Founder',
      status: 'leads',
      tags: ['Warm Lead', 'SMB'],
      leadScore: 68,
      lastActivity: '1 week ago',
      dealValue: 15000,
      lifetime: 0
    }
  ];

  const filteredContacts = filterStatus === 'all' 
    ? mockContacts 
    : mockContacts.filter(c => c.status === filterStatus);

  if (viewMode === 'detail' && selectedContact) {
    return <ContactDetail contact={selectedContact} onBack={() => {
      setViewMode('list');
      setSelectedContact(null);
    }} role={role} />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600 mt-1">Manage all your contacts and companies</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleImport}>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleNewContact}>
            <Plus className="w-4 h-4 mr-2" />
            New Contact
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search contacts..."
              className="pl-10 pr-4 py-2 w-96 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg">
            <Filter className="w-4 h-4 text-gray-600" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="bg-transparent text-sm font-medium text-gray-700 border-none focus:outline-none"
            >
              <option value="all">All Contacts</option>
              <option value="leads">Leads</option>
              <option value="customers">Customers</option>
              <option value="partners">Partners</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium">{filteredContacts.length}</span>
          <span>contacts</span>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-300">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Company</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Lead Score</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Deal Value</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Last Activity</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredContacts.map((contact) => (
              <tr
                key={contact.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  setSelectedContact(contact);
                  setViewMode('detail');
                }}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-sm font-semibold text-indigo-600">
                        {contact.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{contact.name}</p>
                      <p className="text-sm text-gray-500">{contact.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{contact.company}</p>
                    <p className="text-xs text-gray-500">{contact.position}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    contact.status === 'customer' ? 'bg-green-100 text-green-800' :
                    contact.status === 'leads' ? 'bg-purple-100 text-purple-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {contact.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full">
                      <div
                        className={`h-2 rounded-full ${
                          contact.leadScore >= 80 ? 'bg-green-600' :
                          contact.leadScore >= 60 ? 'bg-yellow-600' : 'bg-orange-600'
                        }`}
                        style={{ width: `${contact.leadScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{contact.leadScore}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-gray-900">${contact.dealValue.toLocaleString()}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-600">{contact.lastActivity}</p>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-400 hover:text-gray-600" onClick={(e) => e.stopPropagation()}>
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Contact Detail View
function ContactDetail({ contact, onBack, role }: any) {
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'deals' | 'tickets' | 'documents'>('overview');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ChevronRight className="w-5 h-5 rotate-180" />
          </Button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-xl font-bold text-indigo-600">
                {contact.name.split(' ').map((n: string) => n[0]).join('')}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{contact.name}</h1>
              <p className="text-gray-600">{contact.position} at {contact.company}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Mail className="w-4 h-4 mr-2" />
            Email
          </Button>
          <Button variant="outline">
            <Phone className="w-4 h-4 mr-2" />
            Call
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Lead Score</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-gray-900">{contact.leadScore}</p>
            <div className={`px-2 py-1 rounded text-xs font-medium ${
              contact.leadScore >= 80 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {contact.leadScore >= 80 ? 'Hot' : 'Warm'}
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Deal Value</p>
          <p className="text-2xl font-bold text-gray-900">${(contact.dealValue / 1000).toFixed(0)}K</p>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Lifetime Value</p>
          <p className="text-2xl font-bold text-gray-900">${(contact.lifetime / 1000).toFixed(0)}K</p>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Last Contact</p>
          <p className="text-lg font-semibold text-gray-900">{contact.lastActivity}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
        <div className="border-b border-gray-300 flex">
          {[
            { id: 'overview', label: 'Overview', icon: Users },
            { id: 'activity', label: 'Activity', icon: Activity },
            { id: 'deals', label: 'Deals', icon: Briefcase },
            { id: 'tickets', label: 'Support', icon: MessageSquare },
            { id: 'documents', label: 'Documents', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600 font-medium bg-indigo-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {activeTab === 'overview' && <ContactOverviewTab contact={contact} />}
          {activeTab === 'activity' && <ContactActivityTab contact={contact} />}
          {activeTab === 'deals' && <ContactDealsTab contact={contact} />}
        </div>
      </div>
    </div>
  );
}

// Contact Overview Tab
function ContactOverviewTab({ contact }: any) {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Contact Information */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="w-4 h-4 text-gray-600" />
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-medium text-gray-900">{contact.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Phone className="w-4 h-4 text-gray-600" />
            <div>
              <p className="text-xs text-gray-500">Phone</p>
              <p className="text-sm font-medium text-gray-900">{contact.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Building2 className="w-4 h-4 text-gray-600" />
            <div>
              <p className="text-xs text-gray-500">Company</p>
              <p className="text-sm font-medium text-gray-900">{contact.company}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Briefcase className="w-4 h-4 text-gray-600" />
            <div>
              <p className="text-xs text-gray-500">Position</p>
              <p className="text-sm font-medium text-gray-900">{contact.position}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tags and Notes */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Tags & Segments</h3>
        <div className="flex flex-wrap gap-2 mb-6">
          {contact.tags.map((tag: string, idx: number) => (
            <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
              {tag}
            </span>
          ))}
          <button className="px-3 py-1 border border-gray-300 rounded-full text-xs font-medium text-gray-600 hover:bg-gray-50">
            + Add Tag
          </button>
        </div>

        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" size="sm">
            <Send className="w-4 h-4 mr-2" />
            Send Email
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Meeting
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Create Proposal
          </Button>
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Log Activity
          </Button>
        </div>
      </div>
    </div>
  );
}

// Contact Activity Tab
function ContactActivityTab({ contact }: any) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Activity Timeline</h3>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Log Activity
        </Button>
      </div>

      <div className="space-y-4">
        {[
          { type: 'email', title: 'Email sent', content: 'Proposal for Q2 project', time: '2 hours ago', user: 'Jessica Martinez' },
          { type: 'call', title: 'Call completed', content: '15 minute discovery call', time: '1 day ago', user: 'Michael Brown' },
          { type: 'meeting', title: 'Meeting scheduled', content: 'Product demo next Tuesday', time: '2 days ago', user: 'Jessica Martinez' },
          { type: 'note', title: 'Note added', content: 'Decision maker confirmed. Budget approved.', time: '3 days ago', user: 'Sarah Wilson' }
        ].map((activity, idx) => (
          <div key={idx} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              activity.type === 'email' ? 'bg-blue-100' :
              activity.type === 'call' ? 'bg-green-100' :
              activity.type === 'meeting' ? 'bg-purple-100' : 'bg-gray-100'
            }`}>
              {activity.type === 'email' && <Mail className="w-5 h-5 text-blue-600" />}
              {activity.type === 'call' && <Phone className="w-5 h-5 text-green-600" />}
              {activity.type === 'meeting' && <Calendar className="w-5 h-5 text-purple-600" />}
              {activity.type === 'note' && <FileText className="w-5 h-5 text-gray-600" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium text-gray-900">{activity.title}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
              <p className="text-sm text-gray-600 mb-2">{activity.content}</p>
              <p className="text-xs text-gray-500">by {activity.user}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Contact Deals Tab
function ContactDealsTab({ contact }: any) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">Associated Deals</h3>
      <div className="space-y-3">
        {[
          { name: 'Q2 Enterprise License', stage: 'Negotiation', value: 45000, probability: 75, closeDate: '2024-03-15' },
          { name: 'Implementation Services', stage: 'Proposal', value: 28000, probability: 50, closeDate: '2024-04-01' }
        ].map((deal, idx) => (
          <div key={idx} className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-medium text-gray-900">{deal.name}</p>
                <p className="text-xs text-gray-500">Expected close: {deal.closeDate}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">${deal.value.toLocaleString()}</p>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">{deal.stage}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">Close Probability:</span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-green-600 rounded-full" style={{ width: `${deal.probability}%` }} />
              </div>
              <span className="text-xs font-semibold text-gray-900">{deal.probability}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
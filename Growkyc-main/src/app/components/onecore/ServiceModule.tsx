import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Headphones,
  Plus,
  Search,
  Filter,
  Clock,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  User,
  Calendar,
  Tag,
  Send,
  Paperclip,
  MoreVertical,
  X,
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  Target,
  Zap
} from 'lucide-react';

export function ServiceModule({ role }: any) {
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState('open');

  const mockTickets = [
    {
      id: 'TIC-1245',
      subject: 'Unable to login to dashboard',
      customer: 'John Smith',
      company: 'Acme Corp',
      status: 'open',
      priority: 'high',
      assignedTo: 'Sarah Chen',
      created: '2024-02-28 10:30',
      responseTime: '2h 15m',
      slaStatus: 'on-track',
      channel: 'email'
    },
    {
      id: 'TIC-1244',
      subject: 'Feature request: Bulk export',
      customer: 'Jane Doe',
      company: 'Beta Solutions',
      status: 'in-progress',
      priority: 'medium',
      assignedTo: 'Michael Brown',
      created: '2024-02-28 09:15',
      responseTime: '45m',
      slaStatus: 'on-track',
      channel: 'chat'
    },
    {
      id: 'TIC-1243',
      subject: 'Invoice payment issue',
      customer: 'Bob Wilson',
      company: 'Gamma Industries',
      status: 'waiting',
      priority: 'high',
      assignedTo: 'Emily Davis',
      created: '2024-02-27 16:20',
      responseTime: '18h 10m',
      slaStatus: 'at-risk',
      channel: 'phone'
    },
    {
      id: 'TIC-1242',
      subject: 'General inquiry about pricing',
      customer: 'Alice Cooper',
      company: 'Delta Corp',
      status: 'resolved',
      priority: 'low',
      assignedTo: 'Sarah Chen',
      created: '2024-02-27 14:00',
      responseTime: '1h 30m',
      slaStatus: 'met',
      channel: 'email',
      resolvedAt: '2024-02-27 18:30'
    }
  ];

  const filteredTickets = mockTickets.filter(t => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'open') return t.status === 'open' || t.status === 'in-progress';
    if (activeFilter === 'urgent') return t.priority === 'high' && t.slaStatus === 'at-risk';
    return t.status === activeFilter;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service & Support</h1>
          <p className="text-gray-600 mt-1">Manage tickets, track SLAs, and deliver exceptional customer service</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Ticket
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-gray-600">Open Tickets</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">34</p>
          <p className="text-xs text-orange-600 mt-1">8 urgent</p>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600">Avg Response</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">2.4h</p>
          <p className="text-xs text-green-600 mt-1">-15% vs last week</p>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <p className="text-sm text-gray-600">At Risk</p>
          </div>
          <p className="text-2xl font-bold text-orange-600">5</p>
          <p className="text-xs text-gray-500 mt-1">SLA breach risk</p>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600">Resolved</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">127</p>
          <p className="text-xs text-gray-500 mt-1">This month</p>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-purple-600" />
            <p className="text-sm text-gray-600">CSAT Score</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">4.6/5</p>
          <p className="text-xs text-green-600 mt-1">92% satisfaction</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 bg-white border border-gray-300 rounded-lg p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search tickets..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2">
          {[
            { id: 'all', label: 'All' },
            { id: 'open', label: 'Open' },
            { id: 'urgent', label: 'Urgent' },
            { id: 'in-progress', label: 'In Progress' },
            { id: 'waiting', label: 'Waiting' },
            { id: 'resolved', label: 'Resolved' }
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === filter.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-300">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Ticket</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Assigned</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Response Time</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">SLA</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{ticket.subject}</p>
                    <p className="text-xs text-gray-500">{ticket.id} • {ticket.created}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-900">{ticket.customer}</p>
                    <p className="text-xs text-gray-500">{ticket.company}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      ticket.status === 'open' ? 'bg-blue-100 text-blue-800' :
                      ticket.status === 'in-progress' ? 'bg-purple-100 text-purple-800' :
                      ticket.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {ticket.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      ticket.priority === 'high' ? 'bg-red-100 text-red-800' :
                      ticket.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{ticket.assignedTo}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{ticket.responseTime}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {ticket.slaStatus === 'on-track' && <CheckCircle className="w-4 h-4 text-green-600" />}
                      {ticket.slaStatus === 'at-risk' && <AlertTriangle className="w-4 h-4 text-orange-600" />}
                      {ticket.slaStatus === 'met' && <CheckCircle className="w-4 h-4 text-green-600" />}
                      <span className={`text-xs font-medium ${
                        ticket.slaStatus === 'on-track' ? 'text-green-600' :
                        ticket.slaStatus === 'at-risk' ? 'text-orange-600' :
                        'text-green-600'
                      }`}>
                        {ticket.slaStatus.replace('-', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="ghost">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Detail Sidebar */}
      {selectedTicket && (
        <TicketDetailSidebar ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
      )}
    </div>
  );
}

// Ticket Detail Sidebar
function TicketDetailSidebar({ ticket, onClose }: any) {
  return (
    <div className="fixed right-0 top-0 h-full w-[600px] bg-white border-l border-gray-300 shadow-2xl z-50 overflow-y-auto">
      <div className="p-6 border-b border-gray-300">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                ticket.status === 'open' ? 'bg-blue-100 text-blue-800' :
                ticket.status === 'in-progress' ? 'bg-purple-100 text-purple-800' :
                ticket.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {ticket.status.replace('-', ' ')}
              </span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                ticket.priority === 'high' ? 'bg-red-100 text-red-800' :
                ticket.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {ticket.priority}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">{ticket.subject}</h2>
            <p className="text-sm text-gray-600 mt-1">{ticket.id} • Created {ticket.created}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Customer Info */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Customer</h3>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-900">{ticket.customer}</p>
            <p className="text-sm text-gray-600">{ticket.company}</p>
          </div>
        </div>

        {/* SLA Timer */}
        <div className={`p-4 rounded-lg border ${
          ticket.slaStatus === 'on-track' ? 'bg-green-50 border-green-200' :
          ticket.slaStatus === 'at-risk' ? 'bg-orange-50 border-orange-200' :
          'bg-green-50 border-green-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-900">Response SLA</p>
            <span className={`text-sm font-semibold ${
              ticket.slaStatus === 'on-track' ? 'text-green-600' :
              ticket.slaStatus === 'at-risk' ? 'text-orange-600' :
              'text-green-600'
            }`}>
              {ticket.responseTime}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                ticket.slaStatus === 'on-track' ? 'bg-green-600' :
                ticket.slaStatus === 'at-risk' ? 'bg-orange-600' :
                'bg-green-600'
              }`}
              style={{ width: ticket.slaStatus === 'at-risk' ? '85%' : '45%' }}
            />
          </div>
        </div>

        {/* Conversation Thread */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Conversation</h3>
          <div className="space-y-4">
            {/* Customer Message */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                {ticket.customer.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <div className="flex-1">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-900 mb-1">{ticket.customer}</p>
                  <p className="text-sm text-gray-700">
                    Hi team, I'm having trouble logging into the dashboard. I get an error message every time I try to sign in.
                    Can you please help?
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">{ticket.created}</p>
              </div>
            </div>

            {/* Agent Response */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                SC
              </div>
              <div className="flex-1">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-900 mb-1">{ticket.assignedTo}</p>
                  <p className="text-sm text-gray-700">
                    Hi {ticket.customer.split(' ')[0]}, I'm looking into this for you. Can you try clearing your browser cache
                    and attempting to log in again? Let me know if that resolves the issue.
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reply Box */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Reply</h3>
          <div className="border border-gray-300 rounded-lg">
            <textarea
              rows={4}
              placeholder="Type your response..."
              className="w-full px-4 py-3 rounded-t-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <div className="flex items-center justify-between p-3 bg-gray-50 border-t border-gray-300">
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost">
                  <Paperclip className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <select className="px-3 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Reply</option>
                  <option>Reply & Close</option>
                  <option>Internal Note</option>
                </select>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Send className="w-3 h-3 mr-1" />
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline">
            <CheckCircle className="w-4 h-4 mr-2" />
            Resolve Ticket
          </Button>
          <Button variant="outline">
            <User className="w-4 h-4 mr-2" />
            Reassign
          </Button>
        </div>
      </div>
    </div>
  );
}

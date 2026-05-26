import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { toast } from '../../lib/toast';
import { EmptyState } from '../ui/empty-state';
import { Breadcrumbs } from '../ui/breadcrumbs';
import { 
  MessageSquare,
  Search,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageCircleMore,
  X
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface Ticket {
  id: string;
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  description: string;
  createdAt: Date;
  updatedAt: Date;
  responses: number;
}

const mockTickets: Ticket[] = [
  {
    id: 'TKT-001',
    subject: 'Unable to upload KYC documents',
    category: 'Technical',
    priority: 'high',
    status: 'in_progress',
    description: 'I\'m getting an error when trying to upload my driver\'s license for KYC verification.',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
    responses: 2
  },
  {
    id: 'TKT-002',
    subject: 'Question about auction bidding',
    category: 'General',
    priority: 'medium',
    status: 'open',
    description: 'Can I place multiple bids on the same property? What happens if I change my mind?',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    responses: 0
  },
  {
    id: 'TKT-003',
    subject: 'Payment confirmation not received',
    category: 'Billing',
    priority: 'high',
    status: 'resolved',
    description: 'I transferred funds 3 days ago but haven\'t received confirmation. Transaction ref: TXN-12345',
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    responses: 4
  }
];

export function SupportTickets() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: 'general',
    priority: 'medium' as 'low' | 'medium' | 'high',
    description: ''
  });

  // Filter tickets
  const filteredTickets = tickets.filter(ticket => {
    const searchMatch = searchQuery === '' ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const statusMatch = statusFilter === 'all' || ticket.status === statusFilter;
    
    return searchMatch && statusMatch;
  });

  // Calculate stats
  const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;
  const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;

  const getStatusBadge = (status: string) => {
    const colors = {
      open: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-amber-100 text-amber-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    const labels = {
      open: 'Open',
      in_progress: 'In Progress',
      resolved: 'Resolved',
      closed: 'Closed'
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[status as keyof typeof colors]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[priority as keyof typeof colors]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const handleCreateTicket = () => {
    if (!newTicket.subject.trim() || !newTicket.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const ticket: Ticket = {
      id: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
      subject: newTicket.subject,
      category: newTicket.category,
      priority: newTicket.priority,
      status: 'open',
      description: newTicket.description,
      createdAt: new Date(),
      updatedAt: new Date(),
      responses: 0
    };

    setTickets([ticket, ...tickets]);
    setShowNewTicketModal(false);
    setNewTicket({
      subject: '',
      category: 'general',
      priority: 'medium',
      description: ''
    });

    toast.success('Support ticket created', {
      description: `Ticket ${ticket.id} has been submitted`
    });
  };

  const handleViewTicket = (ticketId: string) => {
    toast.info('Opening ticket details...', {
      description: ticketId
    });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    toast.info('Filters cleared');
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '#' },
    { label: 'Support Tickets' }
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Tickets</p>
                <p className="text-3xl font-semibold text-gray-900">{tickets.length}</p>
                <p className="text-xs text-gray-500 mt-1">All time</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Open Tickets</p>
                <p className="text-3xl font-semibold text-gray-900">{openTickets}</p>
                <p className="text-xs text-gray-500 mt-1">Active support</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Resolved</p>
                <p className="text-3xl font-semibold text-gray-900">{resolvedTickets}</p>
                <p className="text-xs text-gray-500 mt-1">Completed</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tickets List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Support Tickets ({filteredTickets.length})</CardTitle>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tickets..."
                  className="pl-9 w-64"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>

              {/* Actions */}
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                Clear
              </Button>

              <Button size="sm" onClick={() => setShowNewTicketModal(true)}>
                <Plus className="w-4 h-4 mr-1" />
                New Ticket
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTickets.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No tickets found"
              description={
                searchQuery || statusFilter !== 'all'
                  ? "No tickets match your filters"
                  : "You haven't created any support tickets yet"
              }
              action={
                searchQuery || statusFilter !== 'all'
                  ? { label: 'Clear Filters', onClick: handleClearFilters }
                  : { label: 'Create Ticket', onClick: () => setShowNewTicketModal(true) }
              }
            />
          ) : (
            <div className="space-y-3">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleViewTicket(ticket.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-mono text-gray-500">{ticket.id}</span>
                        {getStatusBadge(ticket.status)}
                        {getPriorityBadge(ticket.priority)}
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          {ticket.category}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900">{ticket.subject}</h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{ticket.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-3 pt-3 border-t">
                    <div className="flex items-center gap-4">
                      <span>Created {formatDistanceToNow(ticket.createdAt, { addSuffix: true })}</span>
                      {ticket.responses > 0 && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MessageCircleMore className="w-3 h-3" />
                            {ticket.responses} response{ticket.responses !== 1 ? 's' : ''}
                          </span>
                        </>
                      )}
                    </div>
                    <span>Updated {formatDistanceToNow(ticket.updatedAt, { addSuffix: true })}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <MessageSquare className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">Support Response Times</p>
              <p className="text-sm text-blue-800">
                Our support team typically responds within 4 business hours. High priority tickets are addressed within 1 hour.
              </p>
              <div className="mt-2 text-xs text-blue-700 space-y-1">
                <p>• Monday-Friday: 9am-5pm AEST</p>
                <p>• Emergency support available 24/7 for critical issues</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle>Create Support Ticket</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewTicketModal(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  placeholder="Brief description of your issue"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="general">General Question</option>
                    <option value="technical">Technical Issue</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="account">Account & KYC</option>
                    <option value="legal">Legal & Compliance</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  placeholder="Please provide detailed information about your issue..."
                  rows={6}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Include any relevant case numbers, transaction IDs, or error messages
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowNewTicketModal(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateTicket}>
                  Create Ticket
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
